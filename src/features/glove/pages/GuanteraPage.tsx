import {
  Box,
  Paper,
  Typography,
  Grid,
  Pagination,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { GloveLayout, DisclaimerBanner, VehicleCard } from "../components";
import { SearchInput } from "../../../shared/ui/molecules/SearchInput";
import { useDevices } from "../hooks/useDevices";
import { useGuanteraConfig } from "../providers/GuanteraProvider";

const DEFAULT_PAGE_SIZE = 6;

export function GuanteraPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { devicesApiConfig } = useGuanteraConfig();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const pageSize = useMemo(
    () => devicesApiConfig?.defaultPageSize ?? DEFAULT_PAGE_SIZE,
    [devicesApiConfig?.defaultPageSize],
  );

  const {
    vehicles: pageItems,
    total: totalItems,
    totalPages,
    isLoading,
    isInitialLoad,
    error,
    refetch,
  } = useDevices({ page, pageSize, search });

  const currentPage = Math.min(page, Math.max(1, totalPages));

  const headerExtra = (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        flexWrap: "wrap",
        justifyContent: { xs: "flex-start", sm: "flex-end" },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography sx={{ color: "#000000", whiteSpace: "nowrap" }}>
          Total Vehículos
        </Typography>
        <Box
          sx={{
            px: 1.5,
            py: 0.5,
            borderRadius: 3,
            border: (t) => `2px solid ${t.palette.primary.light}`,
            bgcolor: (t) => `${t.palette.primary.light}1A`,
            minWidth: 60,
            textAlign: "center",
          }}
        >
          <Typography
            sx={{ color: (t) => t.palette.primary.light, fontWeight: 600 }}
          >
            {totalItems}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ width: { xs: "100%", sm: 360 } }}>
        <SearchInput
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          onClear={() => {
            setSearch("");
            setPage(1);
          }}
          placeholder="Buscar por placa..."
        />
      </Box>
    </Box>
  );

  return (
    <GloveLayout headerExtra={headerExtra}>
      <Box
        sx={{
          p: 3,
          pb: 4,
          display: "flex",
          flexDirection: "column",
          gap: 3,
          minHeight: 0,
        }}
      >
        <DisclaimerBanner />

        {error && (
          <Alert
            severity="error"
            onClose={() => refetch()}
            sx={{ borderRadius: 2 }}
          >
            {error.message}
          </Alert>
        )}

        <Paper
          sx={{
            p: 3,
            bgcolor: "background.paper",
            borderRadius: 3,
            border: `1px solid ${
              (theme.palette as { border?: { main?: string } })?.border?.main ??
              theme.palette.divider ??
              "#D0D0D0"
            }`,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {isInitialLoad && isLoading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: 280,
              }}
            >
              <CircularProgress color="primary" />
            </Box>
          ) : (
            <Grid container spacing={2}>
              {pageItems.length === 0 ? (
                <Grid size={{ xs: 12 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      minHeight: 200,
                    }}
                  >
                    <Typography
                      sx={{ color: "text.secondary", fontSize: "1rem" }}
                    >
                      No hay vehículos disponibles
                    </Typography>
                  </Box>
                </Grid>
              ) : (
                pageItems.map((vehicle) => (
                  <VehicleCard
                    key={String(vehicle.id ?? vehicle.plate)}
                    vehicle={vehicle}
                    searchTerm={search}
                    onModuleClick={(moduleKey) =>
                      navigate(`/glove/${vehicle.plate}/${moduleKey}`)
                    }
                  />
                ))
              )}
            </Grid>
          )}
        </Paper>

        {!isInitialLoad && (
          <Paper
            sx={{
              p: 2,
              bgcolor: "background.paper",
              borderRadius: 3,
              border: `1px solid ${
                (theme.palette as { border?: { main?: string } })?.border
                  ?.main ??
                theme.palette.divider ??
                "#D0D0D0"
              }`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Typography
              component="span"
              sx={{
                fontSize: "0.875rem",
                color: "text.secondary",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              Mostrando{" "}
              <Box
                component="span"
                sx={{
                  bgcolor: (t) =>
                    (t.palette as { surface?: { alt?: string } })?.surface
                      ?.alt ??
                    t.palette.background.paper ??
                    t.palette.background.default,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                  fontWeight: 600,
                }}
              >
                {pageItems.length}
              </Box>{" "}
              de {totalItems} resultado{totalItems === 1 ? "" : "s"}
            </Typography>

            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(_, value) => setPage(value)}
              shape="rounded"
              color="primary"
              disabled={isLoading}
            />
          </Paper>
        )}
      </Box>
    </GloveLayout>
  );
}
