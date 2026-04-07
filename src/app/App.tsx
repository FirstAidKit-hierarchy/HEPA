import { ThemeProvider } from "@/components/providers";
import FaviconSync from "./metadata/FaviconSync";
import AppProviders from "./providers/AppProviders";
import AppRouter from "./router/AppRouter";

const AppShell = () => {
  return (
    <AppProviders>
      <FaviconSync />
      <AppRouter />
    </AppProviders>
  );
};

const App = () => (
  <ThemeProvider>
    <AppShell />
  </ThemeProvider>
);

export default App;
