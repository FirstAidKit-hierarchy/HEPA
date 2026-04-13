import { BrowserRouter, Route, Routes } from "react-router-dom";
import RouteScrollManager from "./RouteScrollManager";
import { appRoutes } from "./routes";

const routerBasename = import.meta.env.BASE_URL.replace(/\/+$/, "") || "/";

const AppRouter = () => (
  <BrowserRouter basename={routerBasename}>
    <RouteScrollManager />
    <Routes>
      {appRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
