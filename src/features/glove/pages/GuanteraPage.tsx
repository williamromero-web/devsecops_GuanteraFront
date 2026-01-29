import { Box, Paper, Typography, Grid, Pagination } from "@mui/material";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GloveLayout, DisclaimerBanner, VehicleCard } from "../components";
import { SearchInput } from "../../../shared/ui/molecules/SearchInput";
import { MOCK_VEHICLES } from "../lib/mockData";
import type { Vehicle } from "../types/domain";

export function GuanteraPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const pageSize = 6;

  const filtered: Vehicle[] = useMemo(() => {
    const term = search.trim().toUpperCase();
    if (!term) return MOCK_VEHICLES;
    return MOCK_VEHICLES.filter((v) =>
      (v.plate ?? "").toUpperCase().includes(term),
    );
  }, [search]);

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

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
        <Typography
          sx={{ color: (t) => t.palette.primary.light, whiteSpace: "nowrap" }}
        >
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
            {MOCK_VEHICLES.length}
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
      <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3 }}>
        <DisclaimerBanner />

        <Paper
          sx={{
            p: 3,
            bgcolor: "background.paper",
            borderRadius: 3,
            border: (t) => `1px solid ${t.palette.border.main}`,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
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
        </Paper>

        <Paper
          sx={{
            p: 2,
            bgcolor: "background.paper",
            borderRadius: 3,
            border: (t) => `1px solid ${t.palette.border.main}`,
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
                bgcolor: "surface.alt",
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
          />
        </Paper>
      </Box>
    </GloveLayout>
  );
}
