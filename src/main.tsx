import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import Primitives from "./Primitives.tsx";
import Galaxy from "./Galaxy.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Galaxy />
  </StrictMode>,
);
