import { Alert } from "@mui/material";
import { useMemo, useState } from "react";
import { DocumentUploadCard } from "../../../../shared/ui/molecules/DocumentUploadCard";

export interface FacturaProps {
  plate: string;
}

/**
aquí se conectará a `useFactura(plate)` + `uploadDocument({ sourceModuleId: 11 })`.
 */
export function Factura({ plate }: Readonly<FacturaProps>) {
  const [message, setMessage] = useState<string | null>(null);
  const [hasFile, setHasFile] = useState(true);
  const [fileName, setFileName] = useState("factura.pdf");
  const [fileSizeLabel, setFileSizeLabel] = useState("312.4 KB");

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

      <DocumentUploadCard
        instruction={instruction}
        hasFile={hasFile}
        fileName={fileName}
        fileSizeLabel={fileSizeLabel}
        onView={() =>
          setMessage(
            "Vista previa (mock): aquí se abriría el archivo desde la API.",
          )
        }
        onSave={async (file) => {
          // Mock: simular guardado y dejar el archivo como el actual
          setHasFile(true);
          setFileName(file.name);
          setFileSizeLabel(`${(file.size / 1024).toFixed(1)} KB`);
          setMessage("Factura guardada (mock).");
        }}
      />
    </>
  );
}
