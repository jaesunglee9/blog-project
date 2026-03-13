import axios from 'axios';

// Get CSRF Token from cookies
function getCookie(name: string) {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? decodeURIComponent(match[2]) : null;
}

// Create an Axios instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to attach CSRF token dynamically
api.interceptors.request.use((config) => {
    const csrfToken = getCookie("csrftoken");
    if (csrfToken) {
        config.headers["X-CSRFToken"] = csrfToken;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response interceptor to handle errors globally
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const message = error.response?.data?.detail || error.message || "An error occurred";
        return Promise.reject(new Error(message));
    }
);

export default api;
