import axios from "axios";

const instance = axios.create({
    baseURL: "https://appartmentsback-production-18a0.up.railway.app"
    // baseURL: "http://localhost:3001"
});

instance.interceptors.request.use((config) => {
    config.headers.Authorization = localStorage.getItem('token');
    return config
})

export default instance;