import { Box, Paper, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { GloveLayout, PageHeader, VehicleInfoSection } from "../components";
import {
  findOption,
  MODULE_LABELS,
  type ModuleKey,
} from "../config/optionsConfig";
import { getAggregatedStatus, getVehicleStatus } from "../lib/status";
import { useVehicle } from "../hooks/useVehicle";
import { getOptionComponent } from "../ui-options";

export function GuanteraOptionPage() {
  const { plate, module, option } = useParams<{
    plate: string;
    module: string;
    option: string;
  }>();
  const navigate = useNavigate();

  const moduleKey = (module as ModuleKey) || "propiedad";
  const moduleLabel = MODULE_LABELS[moduleKey] ?? "Módulo";
  const optionItem = findOption(moduleKey, option ?? "") ?? null;
  const optionLabel = optionItem?.label ?? option ?? "Opción";

  const { vehicle } = useVehicle(plate);
  const isActive = (() => {
    if (!vehicle) return true;
    const agg = getAggregatedStatus(vehicle);
    return getVehicleStatus(agg) === "activo";
  })();

  const breadcrumbItems = [
    { label: "Guantera", to: "/glove" },
    { label: plate ?? "—", to: "/glove" },
    { label: moduleLabel, to: `/glove/${plate}/${moduleKey}` },
    { label: optionLabel },
  ];

  const OptionComponent = getOptionComponent(moduleKey, option);

  return (
    <GloveLayout>
      <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3 }}>
        <PageHeader
          title={optionLabel}
          onBack={() => navigate(`/glove/${plate}/${moduleKey}`)}
          breadcrumbItems={breadcrumbItems}
        />

        <VehicleInfoSection plate={plate ?? "—"} isActive={isActive} />

        {OptionComponent ? (
          <OptionComponent plate={plate ?? ""} />
        ) : (
          <Paper
            sx={{
              p: 3,
              bgcolor: "background.paper",
              borderRadius: 2,
              border: (t) => `1px solid ${t.palette.border.main}`,
            }}
          >
            <Typography sx={{ color: "text.secondary", mb: 1 }}>
              {" "}
              <Box component="span" sx={{ fontWeight: 700 }}>
                {optionLabel}
              </Box>{" "}
            </Typography>
            <Typography sx={{ color: "text.tertiary" }}>
              aquí se renderizará el componente, por ejemplo: SOAT, Póliza de
              seguro, Revisión técnico-mecánica, etc.
            </Typography>
          </Paper>
        )}
      </Box>
    </GloveLayout>
  );
}
