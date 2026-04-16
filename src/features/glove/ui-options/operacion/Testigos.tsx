import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import InfoIcon from "@mui/icons-material/Info";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useEffect, useState } from "react";
import iconMotor from "../../../../assets/witness/motor-gray.svg";
import iconElectric from "../../../../assets/witness/gas-gray.svg";
import { useBrandWitnesses } from "../../hooks/useBrandWitnesses";
import type { ApiWitness } from "../../services/brandWitnessService";

export interface TestigosProps {
  plate: string;
}

export function Testigos({ plate }: Readonly<TestigosProps>) {
  const theme = useTheme();
  const { categories, vehicleBrand, isLoading, error } = useBrandWitnesses(plate);

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedWitness, setSelectedWitness] = useState<ApiWitness | null>(null);

  useEffect(() => {
    if (categories.length > 0 && selectedCategory === null) {
      setSelectedCategory(categories[0].categoryId);
    }
  }, [categories, selectedCategory]);

  const borderColor =
    (theme.palette as { border?: { main?: string } })?.border?.main ??
    theme.palette.divider ??
    "#D0D0D0";

  const surfaceAlt =
    (theme.palette as { surface?: { alt?: string } })?.surface?.alt ??
    theme.palette.background.paper ??
    theme.palette.background.default;

  const isDark = theme.palette.mode === "dark";

  const hexToRgba = (hex: string, opacity: number) => {
    const cleaned = hex.replace("#", "");
    const bigint = Number.parseInt(cleaned, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const selectedCategoryObj = categories.find(
    (c) => c.categoryId === selectedCategory,
  );

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Banner legal */}
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
          Los datos son de carácter informativo y no oficial (aplica únicamente
          para las marcas Chevrolet, Volkswagen, Ford, KIA, Renault, Nissan,
          Mazda, JAC, JMC, Foton). En caso de inconsistencias, el Usuario deberá
          consultar el Manual del Vehículo correspondiente a su marca, el cual
          constituye la fuente de referencia oficial y prevalece sobre cualquier
          otra información aquí contenida. <strong>Quantum Data</strong> no se
          hace responsable por la exactitud, actualización o interpretación de
          los datos presentados en este submódulo.
        </Typography>
      </Paper>

      {vehicleBrand ? (
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            px: 2,
            py: 0.75,
            borderRadius: 2,
            border: `1px solid ${borderColor}`,
            bgcolor: surfaceAlt,
            alignSelf: "flex-start",
          }}
        >
          <Typography
            sx={{
              fontSize: "0.75rem",
              fontWeight: 500,
              color: theme.palette.text.secondary,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Marca
          </Typography>
          <Typography
            sx={{
              fontSize: "0.875rem",
              fontWeight: 700,
              color: theme.palette.text.primary,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {vehicleBrand}
          </Typography>
        </Box>
      ) : null}

      {error ? (
        <Alert severity="error">{error}</Alert>
      ) : categories.length === 0 ? (
        <Alert severity="warning">
          No se encontraron testigos para esta marca.
        </Alert>
      ) : null}

      {/* Grid de categorías */}
      {categories.length > 0 ? (
        <Grid container spacing={2}>
          {categories.map((category) => {
            const bgColor = category.color || "#e5e7eb";
            const isSelected = selectedCategory === category.categoryId;
            const imgSrc = category.urlImage || iconMotor;

            return (
              <Grid key={category.categoryId} size={{ xs: 12, md: 6, lg: 4 }}>
                <Paper
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: 2,
                    borderRadius: 2,
                    border: `1px solid ${
                      isSelected ? theme.palette.primary.light : borderColor
                    }`,
                    bgcolor: isSelected
                      ? isDark
                        ? hexToRgba(
                            theme.palette.primary.light ?? "#00F1C7",
                            0.25,
                          )
                        : `${theme.palette.primary.light}1A`
                      : isDark
                        ? surfaceAlt
                        : "#ffffff",
                    boxShadow: theme.shadows[1],
                    cursor: "pointer",
                    transition: "all 0.2s",
                    "&:hover": {
                      borderColor: theme.palette.primary.light,
                      bgcolor: isDark
                        ? hexToRgba(
                            theme.palette.primary.light ?? "#00F1C7",
                            0.25,
                          )
                        : `${theme.palette.primary.light}1A`,
                    },
                  }}
                  onClick={() => setSelectedCategory(category.categoryId)}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      bgcolor: bgColor,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      flexShrink: 0,
                    }}
                  >
                    <Box
                      component="img"
                      src={imgSrc}
                      alt={category.categoryName}
                      sx={{ width: 24, height: 24, objectFit: "contain" }}
                    />
                  </Box>

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                      }}
                    >
                      {category.categoryName}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.7rem",
                        color: theme.palette.text.secondary,
                      }}
                      noWrap
                    >
                      {category.description}
                    </Typography>
                  </Box>

                  <ChevronRightIcon
                    sx={{
                      color: theme.palette.text.secondary,
                      fontSize: "1.25rem",
                    }}
                  />
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      ) : null}

      {/* Detalle de categoría + testigos */}
      <Paper
        sx={{
          mt: 2,
          borderRadius: 2,
          border: `1px solid ${borderColor}`,
          bgcolor: theme.palette.background.paper,
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography
            sx={{
              fontSize: "1.1rem",
              fontWeight: 600,
              mb: 1,
              color: theme.palette.text.primary,
            }}
          >
            {selectedCategoryObj?.categoryName ?? "Categoría no disponible"}
          </Typography>
          <Typography
            sx={{
              fontSize: "0.9rem",
              color: theme.palette.text.secondary,
            }}
          >
            {selectedCategoryObj?.description ?? "Descripción no disponible"}
          </Typography>
        </Box>

        <Box sx={{ p: 3, pt: 0 }}>
          {!selectedCategoryObj?.witnesses?.length ? (
            <Alert severity="warning">
              No se encontraron testigos para esta categoría.
            </Alert>
          ) : null}

          {selectedCategoryObj?.witnesses?.length ? (
            <Grid container spacing={2}>
              {selectedCategoryObj.witnesses.map((w) => {
                const bg = selectedCategoryObj.color ?? "#e5e7eb";
                const imgSrc = w.urlImage || iconElectric;

                return (
                  <Grid key={w.id} size={{ xs: 12, sm: 6, md: 3 }}>
                    <Paper
                      sx={{
                        height: "100%",
                        p: 2,
                        borderRadius: 2,
                        border: `1px solid ${borderColor}`,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "stretch",
                        gap: 1,
                        boxShadow: theme.shadows[1],
                      }}
                    >
                      <Box
                        sx={{
                          mb: 1.5,
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          bgcolor: bg,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden",
                        }}
                      >
                        <Box
                          component="img"
                          src={imgSrc}
                          alt={w.name}
                          sx={{
                            width: 24,
                            height: 24,
                            objectFit: "contain",
                          }}
                        />
                      </Box>

                      <Typography
                        sx={{
                          fontSize: "0.9rem",
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                        }}
                      >
                        {w.name}
                      </Typography>

                      <Box sx={{ mt: "auto" }}>
                        <Typography
                          sx={{
                            mt: 1,
                            fontSize: "0.7rem",
                            color: theme.palette.text.secondary,
                            textDecoration: "underline",
                            cursor: "pointer",
                            textAlign: "center",
                          }}
                          onClick={() => setSelectedWitness(w)}
                        >
                          Ver más
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          ) : null}
        </Box>
      </Paper>

      {/* Diálogo detalle de testigo */}
      <Dialog
        open={!!selectedWitness}
        onClose={() => setSelectedWitness(null)}
      >
        {selectedWitness ? (
          <>
            <DialogTitle>{selectedWitness.name}</DialogTitle>
            <DialogContent dividers>
              <Typography
                sx={{
                  mb: 2,
                  fontSize: "0.9rem",
                  color: theme.palette.text.secondary,
                }}
              >
                {selectedWitness.description}
              </Typography>

              {selectedWitness.recommendedAction ? (
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: hexToRgba(
                      selectedCategoryObj?.color ?? "#f97373",
                      0.15,
                    ),
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      mb: 1,
                    }}
                  >
                    ¿Qué debo hacer?
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.85rem",
                      color: theme.palette.text.secondary,
                    }}
                  >
                    {selectedWitness.recommendedAction}
                  </Typography>
                </Box>
              ) : null}
            </DialogContent>
            <DialogActions>
              <Button variant="outlined" onClick={() => setSelectedWitness(null)}>
                Cerrar
              </Button>
            </DialogActions>
          </>
        ) : null}
      </Dialog>
    </Box>
  );
}
