import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

import Desktop from "./containers/Desktop";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <Desktop />
  </StrictMode>
);
