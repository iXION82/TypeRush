import axios from "axios";
import { getAccessToken,setAccessToken } from "../auth/tokenService";

const api = axios.create({
    baseURL: "http://localhost:5000/api",
    headers:{
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
        const token = getAccessToken();

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {
                const res = await api.post("/auth/refresh");
                const { accessToken } = res.data;

                setAccessToken(accessToken);

                originalRequest.headers.Authorization =
                    `Bearer ${accessToken}`;

                return api(originalRequest);
            } catch {
                setAccessToken(null);
                localStorage.removeItem("userId");
                localStorage.removeItem("role");
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export default api;