import { Alert } from "@mui/material";
import { useMemo, useState } from "react";
import { DocumentUploadCard } from "../../../../shared/ui/molecules/DocumentUploadCard";

export interface AsistenciasVialesProps {
  plate: string;
}

export function AsistenciasViales({ plate }: Readonly<AsistenciasVialesProps>) {
  const [message, setMessage] = useState<string | null>(null);
  const [hasFile, setHasFile] = useState(false);
  const [fileName, setFileName] = useState("Sin archivo");
  const [fileSizeLabel, setFileSizeLabel] = useState("0 KB");

  const instruction = useMemo(
    () =>
      `Adjunte aquí el documento con las asistencias viales asociadas al vehículo (Placa: ${plate}).`,
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
        onView={() => setMessage("Vista previa ")}
        onSave={async (file) => {
          setHasFile(true);
          setFileName(file.name);
          setFileSizeLabel(`${(file.size / 1024).toFixed(1)} KB`);
          setMessage("Asistencias viales guardadas (mock).");
        }}
      />
    </>
  );
}
