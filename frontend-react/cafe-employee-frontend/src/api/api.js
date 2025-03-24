import axios from 'axios';

const API_BASE_URL = "http://localhost:3000/api";

export const getCafes = async (location) => {
    try {
        const url = location ? `${API_BASE_URL}/cafes?location=${location}` : `${API_BASE_URL}/cafes`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching cafés:", error);
        return [];
    }
};

export const getEmployees = async (cafeId) => {
    try {
        const url = cafeId ? `${API_BASE_URL}/employees?cafe=${cafeId}` : `${API_BASE_URL}/employees`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching employees:", error);
        return [];
    }
};

export const addCafe = async (cafeData) => {
    try {
        return await axios.post(`${API_BASE_URL}/cafes`, cafeData);
    } catch (error) {
        console.error("Error adding café:", error);
        throw error;
    }
};

export const updateCafe = async (id, cafeData) => {
    try {
        return await axios.put(`${API_BASE_URL}/cafes/${id}`, cafeData);
    } catch (error) {
        console.error("Error updating café:", error);
        throw error;
    }
};

export const deleteCafe = async (id) => {
    try {
        return await axios.delete(`${API_BASE_URL}/cafes/${id}`);
    } catch (error) {
        console.error("Error deleting café:", error);
        throw error;
    }
};

export const addEmployee = async (employeeData) => {
    try {
        return await axios.post(`${API_BASE_URL}/employees`, employeeData);
    } catch (error) {
        console.error("Error adding employee:", error);
        throw error;
    }
};

export const updateEmployee = async (id, employeeData) => {
    try {
        return await axios.put(`${API_BASE_URL}/employees/${id}`, employeeData);
    } catch (error) {
        console.error("Error updating employee:", error);
        throw error;
    }
};

export const deleteEmployee = async (id) => {
    try {
        return await axios.delete(`${API_BASE_URL}/employees/${id}`);
    } catch (error) {
        console.error("Error deleting employee:", error);
        throw error;
    }
};
