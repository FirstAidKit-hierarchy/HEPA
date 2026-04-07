import { BrowserRouter, Route, Routes } from "react-router-dom";
import { appRoutes } from "./routes";

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      {appRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
