import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";

export function bootstrap() {
  createRoot(document.getElementById("root") as HTMLElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

bootstrap();
