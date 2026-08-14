import { Routes } from "react-router-dom";
import { routes } from "./routes";
import renderRoutes from "./renderRoutes";

export default function AppRoutes() {
    return (
        <Routes>
            {renderRoutes(routes)}
        </Routes>
    );
}