import type { MouseEvent } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import InfoIcon from '@mui/icons-material/Info';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';

const ASSISTANCES_TERMS_URL = import.meta.env.VITE_ASSISTANCES_TERMS_URL as string;

export interface AsistenciasVialesProps {
	plate: string;
}

export function AsistenciasViales({ plate: _plate }: Readonly<AsistenciasVialesProps>) {
	const theme = useTheme();

	const borderColor =
		(theme.palette as { border?: { main?: string } })?.border?.main ??
		theme.palette.divider ??
		'#D0D0D0';

	const surfaceAlt =
		(theme.palette as { surface?: { alt?: string } })?.surface?.alt ??
		theme.palette.background.paper ??
		theme.palette.background.default;

	const img1 = new URL('../../../../assets/assistance/1.webp', import.meta.url).href;
	const img2 = new URL('../../../../assets/assistance/2.webp', import.meta.url).href;
	const img3 = new URL('../../../../assets/assistance/3.webp', import.meta.url).href;
	const img4 = new URL('../../../../assets/assistance/4.webp', import.meta.url).href;
	const img5 = new URL('../../../../assets/assistance/5.webp', import.meta.url).href;
	const img6 = new URL('../../../../assets/assistance/6.webp', import.meta.url).href;

	const assistances = [
		{
			title: 'Vehículo sustituto extendido',
			description:
				'Hasta 3 días adicionales de auto de reemplazo una vez agotado el beneficio de tu aseguradora, garantizando que nunca te detengas.',
			image: img1,
		},
		{
			title: 'Grúa por avería o accidentes',
			description:
				'Traslado por avería o accidente hacia el taller de tu preferencia o dirección indicada (sujeto a cobertura y tipo de vehículo).',
			image: img2,
		},
		{
			title: 'Peritaje',
			description:
				'Desplazamiento de un técnico experto para evaluar el estado general de tu vehículo, con entrega de informe detallado de condiciones y características.',
			image: img3,
		},
		{
			title: 'Inspección pre-viaje',
			description:
				'Dos inspecciones anuales en talleres aliados para verificar frenos, fluidos, luces, batería y motor antes de tus viajes.',
			image: img4,
		},
		{
			title: 'Descuentos pequeños accesorios',
			description:
				'10% de ahorro ilimitado en pequeños accesorios para tu vehículo en nuestra red de aliados nacionales durante la vigencia de tu plan.',
			image: img5,
		},
		{
			title: 'Teleorientación mecánica 24/7',
			description:
				'Asesoría experta 24/7 vía telefónica o virtual para identificar y resolver fallas mecánicas en cualquier lugar del país.',
			image: img6,
		},
	];

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
			<Paper
				sx={{
					p: 2,
					display: 'flex',
					alignItems: 'flex-start',
					gap: 1.5,
					borderRadius: 2,
					border: `1px solid ${borderColor}`,
					bgcolor: surfaceAlt,
				}}
			>
				<InfoIcon
					sx={{
						color: theme.palette.text.secondary,
						fontSize: '1.4rem',
						mt: 0.25,
					}}
				/>
				<Typography
					sx={{
						fontSize: '0.875rem',
						color: theme.palette.text.secondary,
					}}
				>
					Los servicios de asistencias son prestados por Asistencias y Servicios
					Automatizados YA S.A.S (Asisya), para más detalles consulte términos y
					condiciones. Quantum Data no se hace responsable por la prestación de estos
					servicios. Esta plataforma, únicamente las visibiliza, NO es responsable de lo
					que la fuente de información emita.
				</Typography>
			</Paper>

			{/* Card principal de asistencias */}
			<Paper
				sx={{
					p: 3,
					borderRadius: 2,
					border: `1px solid ${borderColor}`,
					bgcolor: theme.palette.background.paper,
					display: 'flex',
					flexDirection: 'column',
					gap: 3,
				}}
			>
				<Typography
					sx={{
						fontSize: '1rem',
						fontWeight: 800,
						color: theme.palette.text.primary,
					}}
				>
					Información de las asistencias con las que cuentas
				</Typography>

				<Box
					sx={{
						borderRadius: 3,
						bgcolor: surfaceAlt,
						px: { xs: 2, md: 4 },
						py: 3,
					}}
				>
					<Box
						sx={{
							display: 'grid',
							gridTemplateColumns: {
								xs: '1fr',
								md: 'repeat(2, 1fr)',
								lg: 'repeat(3, 1fr)',
							},
							gap: 2,
						}}
					>
						{assistances.map((item) => (
							<Paper
								key={item.title}
								sx={{
									position: 'relative',
									overflow: 'hidden',
									borderRadius: 2,
									minHeight: 160,
									bgcolor: '#111827',
									color: '#ffffff',
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'flex-end',
									p: 2,
								}}
							>
								{/* Imagen de fondo */}
								<Box
									component='img'
									src={item.image}
									alt={item.title}
									sx={{
										position: 'absolute',
										inset: 0,
										width: '100%',
										height: '100%',
										objectFit: 'cover',
										zIndex: 0,
									}}
								/>

								<Box
									sx={{
										position: 'absolute',
										top: 0,
										left: 0,
										right: 0,
										height: '40%',
										background:
											'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)',
										zIndex: 1,
									}}
								/>

								<Box sx={{ position: 'relative', zIndex: 2 }}>
									<Typography
										sx={{ fontSize: '0.85rem', fontWeight: 700, mb: 0.5 }}
									>
										{item.title}
									</Typography>
									<Typography sx={{ fontSize: '0.75rem' }}>
										{item.description}
									</Typography>
								</Box>
							</Paper>
						))}
					</Box>

					<Box
						sx={{
							mt: 3,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							gap: 1,
							color: theme.palette.text.secondary,
							fontSize: '0.85rem',
						}}
					>
						<InfoIcon sx={{ fontSize: '1rem' }} />
						<Box
							component='span'
							onClick={(e: MouseEvent) => {
								e.preventDefault();
								e.stopPropagation();
								window.open(ASSISTANCES_TERMS_URL, '_blank', 'noopener,noreferrer');
							}}
							sx={{
								fontWeight: 600,
								textDecoration: 'underline',
								cursor: 'pointer',
								color: theme.palette.text.secondary,
								'&:hover': { color: theme.palette.primary.light },
							}}
						>
							Consultar términos y condiciones de Asisya
						</Box>
					</Box>
				</Box>

				<Paper
					sx={{
						mt: 2,
						px: 3,
						py: 2.5,
						borderRadius: 2,
						border: `1px solid ${borderColor}`,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						gap: 2,
						flexWrap: 'wrap',
					}}
				>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
						<Typography
							sx={{
								fontSize: { xs: '0.95rem', md: '1.1rem' },
								maxWidth: 420,
							}}
						>
							<strong>Comunícate</strong> a través de tu{' '}
							<strong>celular y solicita nuestras asistencias</strong>
						</Typography>
					</Box>

					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							gap: 1,
						}}
					>
						<LocalPhoneIcon
							sx={{
								fontSize: '1.5rem',
								color: theme.palette.primary.light,
							}}
						/>
						<Typography
							sx={{
								fontSize: { xs: '1rem', md: '1.25rem' },
								fontWeight: 800,
							}}
						>
							601 742 9022
						</Typography>
					</Box>
				</Paper>
			</Paper>
		</Box>
	);
}
