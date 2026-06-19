import { useMutation, useQuery } from "@tanstack/react-query";
import {
  IProvinceListResponse,
  IRetriveResponse,
  LoginResponse,
  ParamsArtistList,
  ParamsCategoryList,
} from "../admin/type";
import { AxiosError } from "axios";
import {
  IUserArtistListResponse,
  IUserProfile,
  UserLoginRequest,
} from "./type";
import {
  userArtsitList,
  userLogin,
  userProfile,
  userProvinceList,
} from "./api";
import useAuthStore from "@/lib/stores/useAuthStore";

export const useUserLogin = () =>
  useMutation<IRetriveResponse<LoginResponse>, AxiosError, UserLoginRequest>({
    mutationFn: userLogin,
  });

export const useUserArtsitList = (
  params?: Partial<ParamsCategoryList> | undefined,
) => {
  const hasSearch = Boolean(params?.search);
  const hasCategory = Boolean(params?.categoryId__in);

  return useQuery<IUserArtistListResponse>({
    queryKey: ["categoryList", params],
    queryFn: () => userArtsitList(params),
    refetchInterval: 30 * 1000,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
    enabled: hasSearch || hasCategory,
  });
};

export const useUserProvinceList = (
  params?: Partial<ParamsArtistList> | undefined,
) => {
  return useQuery<IProvinceListResponse>({
    queryKey: ["userProvinceList", params],
    queryFn: () => userProvinceList(params),
    refetchInterval: 30 * 1000,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
  });
};

export const useUserProfile = () => {
  const { accessToken } = useAuthStore();

  return useQuery<IUserProfile>({
    queryKey: ["userProfile"],
    queryFn: () => userProfile(accessToken),
    refetchInterval: 30 * 1000,
    enabled: Boolean(accessToken),
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
  });
};
