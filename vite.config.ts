import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const pkg = require("./package.json") as {
  dependencies?: Record<string, string>;
};
const deps = pkg.dependencies ?? {};
const sharedDependencies = {
  react: { version: deps.react, singleton: true },
  "react-dom": {
    version: deps["react-dom"],
    singleton: true,
  },
  "react-router-dom": {
    version: deps["react-router-dom"],
    singleton: true,
  },
  "@mui/material": { version: deps["@mui/material"], singleton: true },
  "@mui/icons-material": {
    version: deps["@mui/icons-material"],
    singleton: true,
  },
  "@emotion/react": {
    version: deps["@emotion/react"],
    singleton: true,
  },
  "@emotion/styled": {
    version: deps["@emotion/styled"],
    singleton: true,
  },
} as unknown as NonNullable<Parameters<typeof federation>[0]["shared"]>;

export default defineConfig({
  server: {
    port: 5174,
    strictPort: true,
    cors: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  build: {
    target: "esnext",
    minify: false,
    sourcemap: true,
  },
  plugins: [
    react(),
    federation({
      name: "glove",
      filename: "remoteEntry.js",
      exposes: {
        "./GloveModule": "./src/app/remote/GloveModule.tsx",
      },
      shared: sharedDependencies,
    }),
  ],
});
