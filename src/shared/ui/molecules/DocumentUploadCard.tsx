import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import {
	Alert,
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	IconButton,
	Paper,
	Tooltip,
	Typography,
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '@mui/material/styles';
import { httpDelete, httpGetBlob } from '../../../features/glove/lib/httpClient';
import { uploadDocument } from '../../../features/glove/services';

export interface DocumentUploadCardProps {
	instruction: string;

	fileName: string;

	fileSizeLabel?: string;

	hasFile: boolean;
	accept?: string;
	/** Límite en bytes (default 5MB). */
	maxBytes?: number;
	/** ID del tipo de documento. Si se provee junto con vehicleId, el componente sube el archivo automáticamente. */
	documentTypeId?: string;
	/** ID del vehículo al que pertenece el documento. */
	vehicleId?: string;
	/** Fecha de inicio del documento en formato DD-MM-YYYY (requerido por el servicio de upload). */
	startDate?: string;
	/** Fecha de vencimiento del documento en formato DD-MM-YYYY (requerido por el servicio de upload). */
	expiredDate?: string;
	/** Metadata adicional enviada al servicio de upload. */
	metadata?: Record<string, string | number | null | undefined>;
	/** ID de colección existente para agregar el archivo a una colección ya creada. */
	collectionId?: string;

	onView?: () => void;

	/** ID del nodo del documento para eliminarlo. Si se provee, se muestra el botón de eliminar. */
	nodeId?: string;
	/** Callback invocado tras una eliminación exitosa. */
	onDelete?: () => Promise<void> | void;

	/**
	 * Callback invocado tras un guardado exitoso (sea upload o delegación).
	 * Recibe el archivo y, si el backend devolvió un collectionId nuevo, también lo recibe.
	 */
	onSave?: (file: File, collectionId?: string) => Promise<void> | void;
	saveLabel?: string;

	updateLabel?: string;

	sx?: SxProps<Theme>;
}

function bytesToLabel(bytes: number) {
	const kb = bytes / 1024;
	if (kb > 1024) return `${(kb / 1024).toFixed(1)} MB`;
	return `${kb.toFixed(1)} KB`;
}

export function DocumentUploadCard({
	instruction,
	fileName,
	fileSizeLabel,
	hasFile,
	accept = 'application/pdf,image/png,image/jpeg',
	maxBytes = 5 * 1024 * 1024,
	documentTypeId,
	vehicleId,
	startDate,
	expiredDate,
	metadata,
	collectionId,
	onView,
	nodeId,
	onDelete,
	onSave,
	saveLabel = 'Guardar',
	updateLabel = 'Actualizar',
	sx,
}: Readonly<DocumentUploadCardProps>) {
	const theme = useTheme();

	const [isEditing, setIsEditing] = useState(false);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [saving, setSaving] = useState(false);
	const [deleting, setDeleting] = useState(false);
	const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
	const [localError, setLocalError] = useState<string | null>(null);
	const [savedFileUrl, setSavedFileUrl] = useState<string | null>(null);
	const savedFileUrlRef = useRef<string | null>(null);

	useEffect(() => {
		return () => {
			if (savedFileUrlRef.current) URL.revokeObjectURL(savedFileUrlRef.current);
		};
	}, []);

	const handleDelete = async () => {
		if (!nodeId) return;
		setConfirmDeleteOpen(false);
		try {
			setDeleting(true);
			setLocalError(null);
			await httpDelete(`/vehicledocument/nodes/${nodeId}`);
			if (onDelete) {
				await onDelete();
			}
		} catch (e) {
			const msg = e instanceof Error ? e.message : 'No se pudo eliminar el documento';
			setLocalError(msg);
		} finally {
			setDeleting(false);
		}
	};

	const openInNewTab = (url: string) => {
		const a = document.createElement('a');
		a.href = url;
		a.target = '_blank';
		a.rel = 'noopener noreferrer';
		document.body.appendChild(a);
		a.click();
		a.remove();
	};

	const handleView = async () => {
		if (onView) {
			onView();
			return;
		}
		if (selectedFile) {
			openInNewTab(URL.createObjectURL(selectedFile));
			return;
		}
		if (savedFileUrl) {
			openInNewTab(savedFileUrl);
			return;
		}
		if (nodeId) {
			try {
				setLocalError(null);
				const blob = await httpGetBlob(`/vehicledocument/view/${nodeId}`);
				openInNewTab(URL.createObjectURL(blob));
			} catch (e) {
				const msg = e instanceof Error ? e.message : 'No se pudo abrir el documento';
				setLocalError(msg);
			}
		}
	};

	const effectiveName = useMemo(() => {
		if (selectedFile) return selectedFile.name;
		return hasFile ? fileName : 'Sin archivo';
	}, [fileName, hasFile, selectedFile]);

	const effectiveSize = useMemo(() => {
		if (selectedFile) return bytesToLabel(selectedFile.size);
		if (fileSizeLabel) return fileSizeLabel;
		return hasFile ? '' : '0 KB';
	}, [fileSizeLabel, hasFile, selectedFile]);

	const handleCancel = () => {
		setIsEditing(false);
		setSelectedFile(null);
		setLocalError(null);
	};

	const handlePickFile = useCallback(() => {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = accept;
		input.onchange = () => {
			const file = input.files?.[0] ?? null;
			if (!file) {
				input.remove();
				return;
			}

			const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
			if (!allowedTypes.includes(file.type)) {
				setLocalError(
					'Formato no permitido. Solo se aceptan archivos PDF, PNG o JPEG.',
				);
				setSelectedFile(null);
				input.remove();
				return;
			}

			if (file.size > maxBytes) {
				setLocalError(
					`El archivo supera el límite de ${bytesToLabel(maxBytes)}.`,
				);
				setSelectedFile(null);
				input.remove();
				return;
			}

			setLocalError(null);
			setSelectedFile(file);
			input.remove();
		};
		document.body.appendChild(input);
		input.click();
	}, [accept, maxBytes]);

	const handleSave = async () => {
		if (!selectedFile) {
			setIsEditing(false);
			return;
		}
		try {
			setSaving(true);
			setLocalError(null);

			let returnedCollectionId: string | undefined;
			if (documentTypeId && vehicleId) {
				const result = await uploadDocument({
					documentTypeId,
					vehicleId,
					file: selectedFile,
					startDate: startDate ?? '',
					expiredDate: expiredDate ?? '',
					metadata,
					collectionId,
				});
				returnedCollectionId = result ?? undefined;
			}

			if (onSave) {
				await onSave(selectedFile, returnedCollectionId);
			}

			if (!onView) {
				if (savedFileUrlRef.current) URL.revokeObjectURL(savedFileUrlRef.current);
				const url = URL.createObjectURL(selectedFile);
				savedFileUrlRef.current = url;
				setSavedFileUrl(url);
			}

			setIsEditing(false);
			setSelectedFile(null);
		} catch (e) {
			const msg = e instanceof Error ? e.message : 'No se pudo guardar el documento';
			setLocalError(msg);
		} finally {
			setSaving(false);
		}
	};

	return (
		<Box sx={sx}>
			<Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
				<DialogTitle>Confirmar eliminación</DialogTitle>
				<DialogContent>
					<DialogContentText>
						¿Está seguro de que desea eliminar este documento? Esta acción no se puede
						deshacer.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => setConfirmDeleteOpen(false)}
						sx={{ textTransform: 'none' }}
					>
						Cancelar
					</Button>
					<Button
						onClick={handleDelete}
						color='error'
						variant='contained'
						sx={{ textTransform: 'none' }}
					>
						Eliminar
					</Button>
				</DialogActions>
			</Dialog>

			{localError ? (
				<Alert severity='error' sx={{ mb: 2 }}>
					{localError}
				</Alert>
			) : null}

			<Paper
				sx={{
					p: 2,
					bgcolor: theme.palette.background.paper,
					borderRadius: 2,
					border: `1px solid ${theme.palette.border.main}`,
				}}
			>
				<Box sx={{ mb: 2, display: 'flex', alignItems: 'flex-start', gap: 1 }}>
					<Typography
						sx={{
							fontSize: '0.875rem',
							color: theme.palette.text.secondary,
							flex: 1,
						}}
					>
						{instruction}
					</Typography>
					<Tooltip
						title={
							<Box>
								<Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 0.5 }}>
									Restricciones de archivo
								</Typography>
								<Typography sx={{ fontSize: '0.75rem' }}>
									• Formatos permitidos: PDF, PNG o JPEG
								</Typography>
								<Typography sx={{ fontSize: '0.75rem' }}>
									• Tamaño máximo: 5 MB por archivo
								</Typography>
							</Box>
						}
						arrow
						placement='top'
					>
						<IconButton
							size='small'
							sx={{ color: theme.palette.text.secondary }}
							aria-label='Ayuda'
						>
							<HelpOutlineIcon fontSize='small' />
						</IconButton>
					</Tooltip>
				</Box>

				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						p: 1.5,
						borderRadius: 1,
						border: `1px solid ${theme.palette.border.main}`,
						bgcolor: theme.palette.surface.alt,
						mb: 2,
						gap: 1.5,
					}}
				>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							gap: 1.5,
							minWidth: 0,
						}}
					>
						<DescriptionIcon
							sx={{ color: theme.palette.text.secondary, fontSize: '1.5rem' }}
						/>
						<Box sx={{ minWidth: 0 }}>
							<Typography
								sx={{
									fontSize: '0.875rem',
									fontWeight: 500,
									color: theme.palette.text.primary,
									overflow: 'hidden',
									textOverflow: 'ellipsis',
									whiteSpace: 'nowrap',
								}}
							>
								{effectiveName}
							</Typography>
							<Typography
								sx={{
									fontSize: '0.75rem',
									color: theme.palette.text.secondary,
								}}
							>
								{effectiveSize}
							</Typography>
						</Box>
					</Box>

					<Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
						{!isEditing ? (
							<>
								<IconButton
									size='small'
									disabled={
										!hasFile || (!onView && !savedFileUrl && !selectedFile && !nodeId)
									}
									onClick={handleView}
									sx={{
										color: theme.palette.text.secondary,
										'&:hover': {
											color:
												theme.palette.mode === 'dark'
													? theme.palette.primary.light
													: theme.palette.primary.dark,
										},
									}}
									aria-label='Ver'
								>
									<VisibilityIcon fontSize='small' />
								</IconButton>
								{nodeId ? (
									<IconButton
										size='small'
										onClick={() => setConfirmDeleteOpen(true)}
										disabled={deleting}
										sx={{
											color: theme.palette.text.secondary,
											'&:hover': { color: theme.palette.error.main },
										}}
										aria-label='Eliminar'
									>
										<DeleteIcon fontSize='small' />
									</IconButton>
								) : null}
								<IconButton
									size='small'
									onClick={() => setIsEditing(true)}
									sx={{
										color: theme.palette.text.secondary,
										'&:hover': {
											color:
												theme.palette.mode === 'dark'
													? theme.palette.primary.light
													: theme.palette.primary.dark,
										},
									}}
									aria-label='Editar'
								>
									<EditIcon fontSize='small' />
								</IconButton>
							</>
						) : (
							''
						)}
					</Box>
				</Box>

				{isEditing ? (
					<Box
						sx={{
							display: 'flex',
							gap: 1,
							justifyContent: 'flex-end',
							flexWrap: 'wrap',
						}}
					>
						<Button
							onClick={handlePickFile}
							size='small'
							variant='outlined'
							startIcon={<UploadFileIcon />}
							sx={{
								textTransform: 'none',
								cursor: 'pointer',
								borderColor:
									theme.palette.mode === 'dark'
										? theme.palette.primary.light
										: theme.palette.primary.dark,
								color:
									theme.palette.mode === 'dark'
										? theme.palette.primary.light
										: theme.palette.primary.dark,
							}}
						>
							{updateLabel}
						</Button>
						<Button
							onClick={handleCancel}
							size='small'
							variant='text'
							sx={{
								textTransform: 'none',
								color: theme.palette.text.secondary,
							}}
						>
							Cancelar
						</Button>
						<Button
							onClick={handleSave}
							size='small'
							variant='contained'
							disabled={!selectedFile || saving || (!onSave && !documentTypeId)}
							startIcon={<SaveIcon />}
							sx={{
								bgcolor:
									theme.palette.mode === 'dark'
										? theme.palette.primary.main
										: theme.palette.primary.dark,
								color: '#FFFFFF',
								'&:hover': {
									bgcolor: theme.palette.primary.light,
									color: '#181818',
								},
								textTransform: 'none',
							}}
						>
							{saveLabel}
						</Button>
					</Box>
				) : null}
			</Paper>
		</Box>
	);
}
