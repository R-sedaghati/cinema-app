import axios, { AxiosError } from "axios";
import qs from "qs";
import { toast } from "react-toastify";
import { apiErrorFa } from "../utils/apiErrorFa";
import useAuthStore from "../stores/useAuthStore";
import useLoginDrawerStore from "../stores/useLoginDrawerStore";

type ErrorResponse = {
  data: null;
  error: string;
  error_type: string;
  message: string | null;
};

const landingApi = axios.create({
  // Same-origin: nginx routes /api on the main domain to the backend. In dev the
  // next.config.ts rewrite forwards it to API_ORIGIN.
  baseURL: "/api",
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

    // No full-page redirect: drop the dead session and surface the login drawer in place,
    // so the user keeps the page they were on.
    useLoginDrawerStore.getState().open();

    return Promise.reject(error);
  }

  const data = error.response?.data as ErrorResponse | undefined;

  const message = apiErrorFa(data?.error || data?.message);

  toast.error(message, {
    toastId: message,
  });

  return Promise.reject(error);
}

landingApi.interceptors.response.use((response) => response, handleError);

export default landingApi;
