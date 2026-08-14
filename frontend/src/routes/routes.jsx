import { Navigate } from "react-router-dom";

import Main from "../components/layouts/Main";
import Login from "../pages/Authentication/Login";
import Register from "../pages/Authentication/Register";
import Order from "../pages/Order/List";
import OrderForm from "../pages/Order/Form";
import ProtectedRoute from "./ProtectedRoute";

export const routes = [
    {
        path: "/login",
        component: Login,
    },
    {
        path: "/register",
        component: Register,
    },
    {
        component: ProtectedRoute,
        children: [
            {
                component: Main,
                children: [
                    {
                        path: "/",
                        component: Order,
                    },
                    {
                        path: "*",
                        element: <Navigate to="/" replace />,
                    },
                    {
                        path: "/orders/create",
                        element: <OrderForm mode="create" />,
                    },
                    {
                        path: "/orders/:id",
                        element: <OrderForm mode="view" />,
                    },
                    {
                        path: "/orders/:id/edit",
                        element: <OrderForm mode="edit" />,
                    },
                ],
            },
        ],
    },
];