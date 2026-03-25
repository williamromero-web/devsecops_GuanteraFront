import {
  Alert,
  Box,
  Button,
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
import { useState } from "react";
import iconMotor from "../../../../assets/witness/motor-gray.svg";
import iconElectric from "../../../../assets/witness/gas-gray.svg";

interface WitnessCategory {
  Id: string;
  Name: string;
  Description: string;
  Color?: string;
  UrlImage?: string;
}

interface Witness {
  Name: string;
  Description: string;
  RecommendedAction?: string;
  UrlImage?: string;
}

export interface TestigosProps {
  plate: string;
}

export function Testigos({ plate: _plate }: Readonly<TestigosProps>) {
  const theme = useTheme();
  const [categories] = useState<WitnessCategory[]>([
    {
      Id: "motor",
      Name: "Motor",
      Description: "Testigos relacionados con el funcionamiento del motor.",
      Color: "#F97316",
      UrlImage:
        iconMotor,
    },
    {
      Id: "seguridad",
      Name: "Seguridad",
      Description:
        "Indicadores de seguridad activa y pasiva del vehículo (ABS, airbag, etc.).",
      Color: "#0EA5E9",
      UrlImage: iconMotor,
    },
    {
      Id: "electricos",
      Name: "Sistema eléctrico",
      Description:
        "Avisos asociados al sistema eléctrico y carga de batería.",
      Color: "#22C55E",
      UrlImage: iconElectric,
    },
  ]);

  const [witnesses] = useState<Record<string, Witness[]>>({
    motor: [
      {
        Name: "Check Engine",
        Description:
          "Indica que la unidad de control detectó una condición anómala en el motor o en el sistema de emisiones.",
        RecommendedAction:
          "Evita exigencias fuertes al motor y agenda una revisión en un taller autorizado lo antes posible.",
        UrlImage: iconMotor,
      },
      {
        Name: "Temperatura del motor",
        Description:
          "Se enciende cuando la temperatura del refrigerante supera el rango recomendado.",
        RecommendedAction:
          "Detén el vehículo en un lugar seguro, apaga el motor y espera a que se enfríe. No abras el radiador en caliente.",
        UrlImage: iconMotor,
      },
    ],
    seguridad: [
      {
        Name: "Airbag",
        Description:
          "Indica una posible falla en el sistema de retención suplementaria (airbags).",
        RecommendedAction:
          "Dirígete a un taller especializado para revisar el sistema, ya que los airbags podrían no activarse en un choque.",
        UrlImage: iconMotor,
      },
      {
        Name: "ABS",
        Description:
          "Señala un problema en el sistema de frenos antibloqueo (ABS). El frenado convencional sigue funcionando.",
        RecommendedAction:
          "Conduce con precaución, evitando frenadas bruscas, y agenda revisión en un centro de servicio.",
        UrlImage: iconMotor,
      },
    ],
    electricos: [
      {
        Name: "Batería / Carga",
        Description:
          "Indica una anomalía en el sistema de carga (alternador, batería o cableado).",
        RecommendedAction:
          "Evita hacer trayectos largos hasta que un técnico revise el sistema de carga.",
        UrlImage: iconElectric,
      },
    ],
  });

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedWitness, setSelectedWitness] = useState<Witness | null>(null);
  const [error, setError] = useState<string | null>(null);

  const borderColor =
    (theme.palette as { border?: { main?: string } })?.border?.main ??
    theme.palette.divider ??
    "#D0D0D0";

  const surfaceAlt =
    (theme.palette as { surface?: { alt?: string } })?.surface?.alt ??
    theme.palette.background.paper ??
    theme.palette.background.default;

  const isDark = theme.palette.mode === "dark";

  // Seleccionamos por defecto la primera categoría disponible (mock)
  if (!selectedCategory && categories.length > 0) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    setSelectedCategory(categories[0].Id);
  }

  const handleCategoryClick = async (categoryId: string) => {
    setSelectedCategory(categoryId);
    setError(null);
  };

  const hexToRgba = (hex: string, opacity: number) => {
    const cleaned = hex.replace("#", "");
    const bigint = Number.parseInt(cleaned, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const selectedCategoryObj = categories?.find(
    (c) => c.Id === selectedCategory,
  );

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

      {error ? (
        <Alert severity="error">{error}</Alert>
      ) : categories && categories.length === 0 ? (
        <Alert severity="warning">
          No se encontraron testigos para esta marca.
        </Alert>
      ) : null}

      {/* Grid de categorías */}
      {categories && categories.length > 0 ? (
        <Grid container spacing={2}>
          {categories.map((category) => {
            const bgColor = category.Color || "#e5e7eb";
            const isSelected = selectedCategory === category.Id;

            return (
              <Grid key={category.Id} size={{ xs: 12, md: 6, lg: 4 }}>
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
                  onClick={() => handleCategoryClick(category.Id)}
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
                    {category.UrlImage ? (
                      <Box
                        component="img"
                        src={category.UrlImage}
                        alt={category.Name}
                        sx={{ width: 24, height: 24, objectFit: "contain" }}
                      />
                    ) : null}
                  </Box>

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                      }}
                    >
                      {category.Name}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.7rem",
                        color: theme.palette.text.secondary,
                      }}
                      noWrap
                    >
                      {category.Description}
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
            {selectedCategoryObj?.Name ?? "Categoría no disponible"}
          </Typography>
          <Typography
            sx={{
              fontSize: "0.9rem",
              color: theme.palette.text.secondary,
            }}
          >
            {selectedCategoryObj?.Description ?? "Descripción no disponible"}
          </Typography>
        </Box>

        <Box sx={{ p: 3, pt: 0 }}>
          {!selectedCategory || !witnesses[selectedCategory] ? (
            <Alert severity="warning">
              No se encontraron testigos para esta categoría.
            </Alert>
          ) : null}

          {selectedCategory && witnesses[selectedCategory] ? (
            <Grid container spacing={2}>
              {witnesses[selectedCategory].map((w) => {
                const bg = selectedCategoryObj?.Color ?? "#e5e7eb";

                return (
                  <Grid key={w.Name} size={{ xs: 12, sm: 6, md: 3 }}>
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
                        {w.UrlImage ? (
                          <Box
                            component="img"
                            src={w.UrlImage}
                            alt={w.Name}
                            sx={{
                              width: 24,
                              height: 24,
                              objectFit: "contain",
                            }}
                          />
                        ) : null}
                      </Box>

                      <Typography
                        sx={{
                          fontSize: "0.9rem",
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                        }}
                      >
                        {w.Name}
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
            <DialogTitle>{selectedWitness.Name}</DialogTitle>
            <DialogContent dividers>
              <Typography
                sx={{
                  mb: 2,
                  fontSize: "0.9rem",
                  color: theme.palette.text.secondary,
                }}
              >
                {selectedWitness.Description}
              </Typography>

              {selectedWitness.RecommendedAction ? (
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: hexToRgba(
                      selectedCategoryObj?.Color ?? "#f97373",
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
                    {selectedWitness.RecommendedAction}
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

