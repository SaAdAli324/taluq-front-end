import axios from "axios";

const backEndUrl = import.meta.env.VITE_BACKEND_URL

const api = axios.create({
    baseURL: backEndUrl,
    withCredentials: true
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api