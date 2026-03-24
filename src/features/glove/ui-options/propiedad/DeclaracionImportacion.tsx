import { Alert } from "@mui/material";
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
