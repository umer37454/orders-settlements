import { Route } from "react-router-dom";

const renderRoutes = (routes) => {
    return routes.map((route, index) => {
        const Component = route.component;

        return (
            <Route
                key={route.path || index}
                path={route.path}
                element={Component ? <Component /> : route.element}
            >
                {route.children && renderRoutes(route.children)}
            </Route>
        );
    });
};

export default renderRoutes;