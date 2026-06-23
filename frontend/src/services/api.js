import axios from "axios";

const authRoutes = ["/auth/refresh", "/auth/login", "/auth/register", "/auth/forgot-password"];
const authPages = ["/login", "/register", "/forgot-password"];

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Never intercept auth routes
    if (authRoutes.some(route => originalRequest.url.includes(route))) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await api.post("/auth/refresh");
        return api(originalRequest);
      } catch (refreshError) {
        const isAuthPage = authPages.some(page =>
          window.location.pathname.startsWith(page)
        );

        if (!isAuthPage) {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;