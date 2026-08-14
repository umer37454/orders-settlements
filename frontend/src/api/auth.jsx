import api from "./axios";

export const register = async (payload) => {
    const response = await api.post("/register", payload);

    return response.data;
};

export const login = async (payload) => {
    const response = await api.post("/login", payload);

    return response.data;
};

export const logout = async () => {
    const response = await api.post("/logout");
    return response.data;
};