import axios from "axios";

const backEndUrl = import.meta.env.VITE_BACKEND_URL

const api = axios.create({
    baseURL: backEndUrl,
    withCredentials: true
})

export default api