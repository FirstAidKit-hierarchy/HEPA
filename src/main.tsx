import { createRoot } from "react-dom/client";
import "@/app/styles/index.css";
import { syncThemePreference } from "@/lib/theme";

const bootstrap = async () => {
  if (typeof window !== "undefined") {
    syncThemePreference();
  }

  const { default: App } = await import("@/app/App");

  createRoot(document.getElementById("root")!).render(<App />);
};

void bootstrap();
