import api from "./axios";

export const getOrders = async (params = {}) => {
    const response = await api.get("/orders", {
        params,
    });

    return response.data;
};

export const getOrder = async (id) => {
    const response = await api.get(`/orders/${id}`);

    return response.data;
};

export const createOrder = async (payload) => {
    const response = await api.post("/orders", payload);

    return response.data;
};

export const updateOrder = async (id, payload) => {
    const response = await api.put(`/orders/${id}`, payload);

    return response.data;
};

export const deleteOrder = async (id) => {
    const response = await api.delete(`/orders/${id}`);

    return response.data;
};