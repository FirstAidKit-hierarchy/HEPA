import { createRoot } from "react-dom/client";
import App from "@/app/App";
import "@/app/styles/index.css";
import { syncThemePreference } from "@/lib/theme";

if (typeof window !== "undefined") {
  syncThemePreference();
}

createRoot(document.getElementById("root")!).render(<App />);
