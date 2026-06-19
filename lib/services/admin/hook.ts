import { useMutation, useQuery } from "@tanstack/react-query";
import {
  IArtistListResponse,
  IArtistRetriveResponse,
  ICategoryRetriveResponse,
  ICatrgotyListResponse,
  IProvinceListResponse,
  IRetriveResponse,
  ISupportListResponse,
  ISupportRetriveResponse,
  IUpdateCategoryRequest,
  LoginRequest,
  LoginResponse,
  ParamsArtistList,
  ParamsCategoryList,
} from "./type";
import {
  adminArtistList,
  adminArtistRetrieve,
  adminCategoryList,
  adminCategoryRetrieve,
  adminCategoryUpdate,
  adminLogin,
  adminProvinceList,
  adminSupportList,
  adminSupportRetrieve,
} from "./api";
import { AxiosError } from "axios";
import useAdminAuthStore from "@/lib/stores/useAdminAuthStore";

export const useAdminLogin = () =>
  useMutation<IRetriveResponse<LoginResponse>, AxiosError, LoginRequest>({
    mutationFn: adminLogin,
  });

export const useAdminCategoryList = (
  params?: Partial<ParamsCategoryList> | undefined,
) => {
  const { accessToken } = useAdminAuthStore();

  return useQuery<ICatrgotyListResponse>({
    queryKey: ["categoryList", params],
    queryFn: () => adminCategoryList(params, accessToken),
    refetchInterval: 30 * 1000,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
  });
};

export const useAdminCategoryRetrieve = (id?: number) => {
  const { accessToken } = useAdminAuthStore();

  return useQuery<ICategoryRetriveResponse>({
    queryKey: ["categoryRetrive", id],
    queryFn: () => adminCategoryRetrieve(id!, accessToken),
    enabled: Boolean(id),
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
  });
};

export const useAdminArtistList = (
  params?: Partial<ParamsArtistList> | undefined,
) => {
  const { accessToken } = useAdminAuthStore();

  return useQuery<IArtistListResponse>({
    queryKey: ["artistList", params],
    queryFn: () => adminArtistList(params, accessToken),
    refetchInterval: 30 * 1000,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
  });
};

export const useAdminArtistRetrieve = (id?: number) => {
  const { accessToken } = useAdminAuthStore();

  return useQuery<IArtistRetriveResponse>({
    queryKey: ["artistRetrieve", id],
    queryFn: () => adminArtistRetrieve(id!, accessToken),
    enabled: Boolean(id),
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
  });
};

export const useAdminSupportList = (
  params?: Partial<ParamsArtistList> | undefined,
) => {
  const { accessToken } = useAdminAuthStore();

  return useQuery<ISupportListResponse>({
    queryKey: ["supportList", params],
    queryFn: () => adminSupportList(params, accessToken),
    refetchInterval: 30 * 1000,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
  });
};

export const useAdminSupportRetrieve = (id?: number) => {
  const { accessToken } = useAdminAuthStore();

  return useQuery<ISupportRetriveResponse>({
    queryKey: ["supportRetirive", id],
    queryFn: () => adminSupportRetrieve(id!, accessToken),
    enabled: Boolean(id),
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
  });
};

export const useAdminProvinceList = (
  params?: Partial<ParamsArtistList> | undefined,
) => {
  const { accessToken } = useAdminAuthStore();

  return useQuery<IProvinceListResponse>({
    queryKey: ["provinceList", params],
    queryFn: () => adminProvinceList(params, accessToken),
    refetchInterval: 30 * 1000,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
  });
};

export const useAdminCategoryUpdate = () => {
  const { accessToken } = useAdminAuthStore();

  return useMutation({
    mutationFn: (data: { id: number; payload: IUpdateCategoryRequest }) =>
      adminCategoryUpdate(data.id, data.payload, accessToken),
  });
};
