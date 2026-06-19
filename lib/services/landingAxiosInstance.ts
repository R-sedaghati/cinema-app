import axios, { AxiosError } from "axios";
import qs from "qs";
import { toast } from "react-toastify";

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
    return config;
  },
  (error) => Promise.reject(error),
);

function handleError(error: AxiosError) {
  const data = error.response?.data as ErrorResponse | undefined;

  const message =
    data?.error || data?.message || "خطایی در ارتباط با سرور رخ داده است.";

  toast.error(message, { toastId: message });

  return Promise.reject(error);
}

landingApi.interceptors.response.use((response) => response, handleError);

export default landingApi;
