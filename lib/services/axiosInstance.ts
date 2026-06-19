import axios, { AxiosError } from "axios";
import qs from "qs";
import { toast } from "react-toastify";
import useAdminAuthStore from "../stores/useAdminAuthStore";

type ErrorResponse = {
  data: null;
  error: string;
  error_type: string;
  message: string | null;
};

const EXCLUDED_TOAST_ENDPOINTS = ["/login"];

const api = axios.create({
  baseURL: "http://api.archivehonar.ir/api",
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

  const message =
    data?.error || data?.message || "خطایی در ارتباط با سرور رخ داده است.";

  const requestUrl = error.config?.url || "";

  const shouldShowToast = !EXCLUDED_TOAST_ENDPOINTS.some((endpoint) =>
    requestUrl.includes(endpoint),
  );

  if (shouldShowToast) {
    toast.error(message, { toastId: message });
  }

  if (error.response?.status === 401) {
    useAdminAuthStore.getState().logout();
    window.location.href = "/admin/login";
  }

  return Promise.reject(error);
}

api.interceptors.response.use((response) => response, handleAxiosError);

export default api;
