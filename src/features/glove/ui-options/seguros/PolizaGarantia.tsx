import { Alert, Box, Paper, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { DocumentUploadCard } from "../../../../shared/ui/molecules/DocumentUploadCard";
import { useVehicleDocumentInfo } from "../../hooks/useVehicleDocumentInfo";
import { getVehicleDocumentNodes, type VehicleDocumentNode } from "../../services/propertyCardService";
import { getDocumentTypeByCode } from "../../services";

export interface PolizaGarantiaProps {
  plate: string;
  vehicleId?: number | string;
}

export function PolizaGarantia({ plate, vehicleId: vehicleIdProp }: Readonly<PolizaGarantiaProps>) {
  const theme = useTheme();
  const borderColor =
    (theme.palette as { border?: { main?: string } })?.border?.main ??
    theme.palette.divider ??
    "#D0D0D0";

  const [documentsExpanded, setDocumentsExpanded] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  const [documentTypeId, setDocumentTypeId] = useState<string>("");
  const [documentNodes, setDocumentNodes] = useState<VehicleDocumentNode[]>([]);

  useEffect(() => {
    let ignore = false;
    getDocumentTypeByCode("PG")
      .then((res) => {
        if (!ignore) setDocumentTypeId(String(res.data.id));
      })
      .catch(() => undefined);
    return () => {
      ignore = true;
    };
  }, []);

  const { data: vehicleDocument, error: docError, refetch } =
    useVehicleDocumentInfo(vehicleIdProp ?? "", documentTypeId);

  const collectionId: string | null =
    vehicleDocument?.documentCollectionId ?? null;

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
    const fetchNodes = async () => {
      await loadNodes(collectionId);
    };
    fetchNodes();
  }, [collectionId]);

  const handleAfterChange = async () => {
    await refetch();
    if (collectionId) await loadNodes(collectionId);
  };

  const metadata = { PolicyTypeID: 4 };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {docError ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {docError}
        </Alert>
      ) : null}
      {message ? (
        <Alert severity="success" sx={{ mb: 2 }}>
          {message}
        </Alert>
      ) : null}

      <Paper
        sx={{
          p: 2,
          bgcolor: theme.palette.background.paper,
          borderRadius: 2,
          border: `1px solid ${borderColor}`,

      
        }}
      >
        <Box
          onClick={() => setDocumentsExpanded(!documentsExpanded)}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: documentsExpanded ? 2 : 0,
            cursor: "pointer",
          }}
        >
          <Typography
            sx={{
              fontSize: "1rem",
              fontWeight: 800,
              color: theme.palette.text.primary,
            }}
          >
            Adjuntar póliza de garantía
          </Typography>
          {documentsExpanded ? (
            <ExpandLessIcon
              sx={{ fontSize: "1.25rem", color: theme.palette.text.secondary }}
            />
          ) : (
            <ExpandMoreIcon
              sx={{ fontSize: "1.25rem", color: theme.palette.text.secondary }}
            />
          )}
        </Box>

        {documentsExpanded && (
          <>
            {documentNodes.length > 0 ? (
              documentNodes.map((node) => (
                <DocumentUploadCard
                  key={node.nodeId}
                  instruction={`Adjunte aquí la póliza de garantía del vehículo (Placa: ${plate}).`}
                  hasFile
                  fileName={node.name}
                  vehicleId={
                    vehicleIdProp !== undefined
                      ? String(vehicleIdProp)
                      : undefined
                  }
                  documentTypeId={documentTypeId}
                  collectionId={collectionId ?? undefined}
                  nodeId={node.nodeId}
                  onDelete={handleAfterChange}
                  metadata={metadata}
                  onSave={async (file, newCollectionId) => {
                    setMessage(`${file.name} guardado correctamente.`);
                    const idToUse = newCollectionId ?? collectionId ?? null;
                    if (idToUse) await loadNodes(idToUse);
                    else await refetch();
                  }}
                />
              ))
            ) : (
              <DocumentUploadCard
                instruction={`Adjunte aquí la póliza de garantía del vehículo (Placa: ${plate}).`}
                hasFile={false}
                fileName="Sin archivo"
                vehicleId={
                  vehicleIdProp !== undefined
                    ? String(vehicleIdProp)
                    : undefined
                }
                documentTypeId={documentTypeId}
                collectionId={collectionId ?? undefined}
                metadata={metadata}
                onSave={async (file, newCollectionId) => {
                  setMessage(`${file.name} guardado correctamente.`);
                  const idToUse = newCollectionId ?? collectionId ?? null;
                  if (idToUse) await loadNodes(idToUse);
                  else await refetch();
                }}
              />
            )}
          </>
        )}
      </Paper>
    </Box>
  );
}
