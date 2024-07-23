import axios from "axios";

const instance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL
    // baseURL: "http://localhost:3001"
});
console.log(process.env.REACT_APP_BASE_URL);
instance.interceptors.request.use((config) => {
    config.headers.Authorization = localStorage.getItem('token');
    return config
})

export default instance;