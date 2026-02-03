import { Box } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import {
  GloveLayout,
  OptionsGrid,
  PageHeader,
  VehicleInfoSection,
} from "../components";
import {
  MODULE_LABELS,
  type ModuleKey,
  OPTIONS_CONFIG,
} from "../config/optionsConfig";
import { getAggregatedStatus, getVehicleStatus } from "../lib/status";
import { useVehicle } from "../hooks/useVehicle";
import { ModuleIcon } from "../../../shared/ui/atoms/ModuleIcon";

export function GuanteraDetailPage() {
  const { plate, module } = useParams<{ plate: string; module: string }>();
  const navigate = useNavigate();

  const moduleKey = (module as ModuleKey) || "propiedad";
  const moduleLabel = MODULE_LABELS[moduleKey] ?? "Módulo";

  const { vehicle } = useVehicle(plate);
  const isActive = (() => {
    if (!vehicle) return true;
    const agg = getAggregatedStatus(vehicle);
    return getVehicleStatus(agg) === "activo";
  })();

  const breadcrumbItems = [
    { label: "", to: "/glove" },
    { label: plate ?? "—", to: "/glove" },
    { label: moduleLabel },
  ];

  return (
    <GloveLayout>
      <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3, minHeight: 0 }}>
        <PageHeader
          title={moduleLabel}
          onBack={() => navigate("/glove")}
          breadcrumbItems={breadcrumbItems}
          trailing={
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 3,
                bgcolor: (t) =>
                  ((t.palette as { surface?: { alt?: string } })?.surface
                    ?.alt ??
                    t.palette.background.paper ??
                    t.palette.background.default),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ModuleIcon variant={moduleKey} size={26} />
            </Box>
          }
        />

        <VehicleInfoSection plate={plate ?? "—"} isActive={isActive} />

        <OptionsGrid
          options={OPTIONS_CONFIG[moduleKey] ?? []}
          vehicle={vehicle}
          onSelect={(optionKey) =>
            navigate(`/glove/${plate}/${moduleKey}/${optionKey}`)
          }
        />
      </Box>
    </GloveLayout>
  );
}
