import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    login as loginApi,
    register as registerApi,
    logout as logoutApi,
} from "../api/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();

    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const [token, setToken] = useState(() => {
        return localStorage.getItem("token");
    });

    const saveAuth = (user, token) => {
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);

        setUser(user);
        setToken(token);
    };

    const clearAuth = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");

        setUser(null);
        setToken(null);
    };

    const login = async (credentials) => {
        try {
            const response = await loginApi(credentials);

            saveAuth(response.user, response.token);

            navigate("/");

            return response;
        } catch (error) {
            console.error("Login Error:", error);
            throw error;
        }
    };

    const register = async (data) => {
        try {
            const response = await registerApi(data);

            saveAuth(response.user, response.token);

            navigate("/");

            return response;
        } catch (error) {
            console.error("Registration Error:", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await logoutApi();
        } catch (error) {
            console.error("Logout Error:", error);
        } finally {
            clearAuth();
            navigate("/login");
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                register,
                logout,
                isAuthenticated: !!token,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }

    return context;
};