import axios, { AxiosError } from "axios";
import qs from "qs";
import { toast } from "react-toastify";
import { apiErrorFa } from "../utils/apiErrorFa";
import useAdminAuthStore from "../stores/useAdminAuthStore";

type ErrorResponse = {
  data: null;
  error: string;
  error_type: string;
  message: string | null;
};

const EXCLUDED_TOAST_ENDPOINTS = ["/login"];

const api = axios.create({
  // See landingAxiosInstance: same-origin /api, proxied by nginx (prod) or the
  // next.config.ts rewrite (dev).
  baseURL: "/api",
  paramsSerializer: {
    serialize: (params) =>
      qs.stringify(params, {
        skipNulls: true,
        arrayFormat: "comma",
      }),
  },
});

api.interceptors.request.use(
  (config) => {
    const token = useAdminAuthStore.getState().accessToken;

    if (token) {
      config.headers.Authorization = token;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

function handleAxiosError(error: AxiosError) {
  const data = error.response?.data as ErrorResponse | undefined;

  const message = apiErrorFa(data?.error || data?.message);

  const requestUrl = error.config?.url || "";

  const shouldShowToast = !EXCLUDED_TOAST_ENDPOINTS.some((endpoint) =>
    requestUrl.includes(endpoint),
  );

  if (shouldShowToast) {
    toast.error(message, { toastId: message });
  }

  // Only an authenticated request that comes back 401 means the session died.
  // A 401 from /admin/login is a wrong password, and a 401 on a request that
  // carried no token at all says nothing about the stored one.
  const isLoginRequest = requestUrl.includes("/admin/login");
  const wasAuthenticated = Boolean(error.config?.headers?.Authorization);

  if (
    error.response?.status === 401 &&
    !isLoginRequest &&
    wasAuthenticated &&
    useAdminAuthStore.getState().isLoggedIn()
  ) {
    useAdminAuthStore.getState().logout();
    window.location.href = "/admin/login";
  }

  return Promise.reject(error);
}

api.interceptors.response.use((response) => response, handleAxiosError);

export default api;
