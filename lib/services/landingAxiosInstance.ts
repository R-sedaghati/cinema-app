import axios, { AxiosError } from "axios";
import qs from "qs";
import { toast } from "react-toastify";
import useAuthStore from "../stores/useAuthStore";

type ErrorResponse = {
  data: null;
  error: string;
  error_type: string;
  message: string | null;
};

const landingApi = axios.create({
  baseURL: "http://api.archivehonar.ir/api",
  paramsSerializer: {
    serialize: (params) =>
      qs.stringify(params, {
        skipNulls: true,
        arrayFormat: "comma",
      }),
  },
});

landingApi.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();

    if (accessToken) {
      config.headers.Authorization = accessToken;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

function handleError(error: AxiosError) {
  const { logout } = useAuthStore.getState();
  const status = error.response?.status;

  if (status === 401) {
    logout();

    window.location.href = "/";

    return Promise.reject(error);
  }

  const data = error.response?.data as ErrorResponse | undefined;

  const message =
    data?.error || data?.message || "خطایی در ارتباط با سرور رخ داده است.";

  toast.error(message, {
    toastId: message,
  });

  return Promise.reject(error);
}

landingApi.interceptors.response.use((response) => response, handleError);

export default landingApi;
