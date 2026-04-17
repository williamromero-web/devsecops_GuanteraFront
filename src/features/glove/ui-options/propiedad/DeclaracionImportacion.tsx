import { Alert, Paper, Typography, useTheme } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { useEffect, useMemo, useState } from "react";
import { DocumentUploadCard } from "../../../../shared/ui/molecules/DocumentUploadCard";
import { getDocumentTypeByCode } from "../../services";
import { getVehicleDocumentNodes, type VehicleDocumentNode } from "../../services/propertyCardService";
import { useVehicleDocumentInfo } from "../../hooks/useVehicleDocumentInfo";

export interface DeclaracionImportacionProps {
  plate: string;
  vehicleId: Number;
}

export function DeclaracionImportacion({
  plate,
  vehicleId,
}: Readonly<DeclaracionImportacionProps>) {
  const [message, setMessage] = useState<string | null>(null);
  const [documentTypeId, setDocumentTypeId] = useState("");
  const [documentNodes, setDocumentNodes] = useState<VehicleDocumentNode[]>([]);

  const theme = useTheme();
  const borderColor =
    (theme.palette as { border?: { main?: string } })?.border?.main ??
    theme.palette.divider ??
    "#D0D0D0";
  const surfaceAlt =
    (theme.palette as { surface?: { alt?: string } })?.surface?.alt ??
    theme.palette.background.paper ??
    theme.palette.background.default;

  useEffect(() => {
    let ignore = false;
    getDocumentTypeByCode("DI")
      .then((res) => { if (!ignore) setDocumentTypeId(String(res.data.id)); })
      .catch(() => undefined);
    return () => { ignore = true; };
  }, []);

  const { data, refetch } = useVehicleDocumentInfo(String(vehicleId), documentTypeId);

  const collectionId = data?.documentCollectionId ?? null;

  const loadNodes = async (id: string) => {
    try {
      const nodes = await getVehicleDocumentNodes(id);
      setDocumentNodes(nodes);
    } catch {
      setDocumentNodes([]);
    }
  };

  useEffect(() => {
    if (!collectionId) return;
    const fetch = async () => {
      await loadNodes(collectionId);
    };
    fetch();
  }, [collectionId]);

  const handleAfterChange = async () => {
    await refetch();
    if (collectionId) await loadNodes(collectionId);
  };

  const instruction = useMemo(
    () =>
      `Adjunte aquí el documento en mención, para su registro (Placa: ${plate}).`,
    [plate],
  );

  return (
    <>
      <Paper
        sx={{
          p: 2,
          display: "flex",
          alignItems: "flex-start",
          gap: 1.5,
          borderRadius: 2,
          border: `1px solid ${borderColor}`,
          bgcolor: surfaceAlt,
        }}
      >
        <InfoIcon
          sx={{
            color: theme.palette.text.secondary,
            fontSize: "1.4rem",
            mt: 0.25,
          }}
        />
        <Typography
          sx={{
            fontSize: "0.875rem",
            color: theme.palette.text.secondary,
          }}
        >
          La digitalización de estos documentos es únicamente para fines informativos y no reemplaza los documentos originales, 
          los cuales deberán presentarse en caso de ser requeridos por las autoridades competentes.
        </Typography>
      </Paper>

      {message ? (
        <Alert severity="success" sx={{ mb: 2 }}>
          {message}
        </Alert>
      ) : null}

      {documentNodes.length > 0 ? (
        documentNodes.map((node) => (
          <DocumentUploadCard
            key={node.nodeId}
            instruction={instruction}
            hasFile
            fileName={node.name}
            vehicleId={String(vehicleId)}
            documentTypeId={documentTypeId}
            collectionId={collectionId ?? undefined}
            nodeId={node.nodeId}
            onDelete={handleAfterChange}
            onSave={async (file) => {
              setMessage(`${file.name} guardado correctamente.`);
              await handleAfterChange();
            }}
          />
        ))
      ) : (
        <DocumentUploadCard
          instruction={instruction}
          hasFile={false}
          fileName="Sin archivo"
          collectionId={collectionId ?? undefined}  
          vehicleId={String(vehicleId)}
          documentTypeId={documentTypeId}
          onSave={async (file) => {
            setMessage(`${file.name} guardado correctamente.`);
            await handleAfterChange();
          }}
        />
      )}
    </>
  );
}
