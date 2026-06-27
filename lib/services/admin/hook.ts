import { useMutation, useQuery } from "@tanstack/react-query";
import {
  EArtistRequestStatus,
  IAboutUsResponse,
  IAdminFaqUpdateItem,
  IArtistListResponse,
  IArtistRetriveResponse,
  IArtistStatusUpdateRequest,
  ICategoryRetriveResponse,
  ICatrgotyListResponse,
  IFaqItem,
  IFaqListResponse,
  IProvinceListResponse,
  IRetriveResponse,
  ISupportListResponse,
  ISupportRetriveResponse,
  IUpdateCategoryRequest,
  IUserRetrive,
  IUsersListResponse,
  LoginRequest,
  LoginResponse,
  ParamsArtistList,
  ParamsCategoryList,
  ParamsUsersList,
} from "./type";
import {
  adminAboutUs,
  adminAboutUsUpdate,
  adminArtistList,
  adminArtistRetrieve,
  adminArtistStatusUpdate,
  adminCategoryList,
  adminCategoryRetrieve,
  adminCategoryUpdate,
  adminCreateFaq,
  adminFaqList,
  adminFaqUpdate,
  adminLogin,
  adminProvinceList,
  adminSupportList,
  adminSupportRetrieve,
  adminSupportUpdate,
  adminUserRequest,
  adminUsersList,
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

export const useAdminFaqList = () => {
  const { accessToken } = useAdminAuthStore();

  return useQuery<IFaqListResponse>({
    queryKey: ["adminFaqList"],
    queryFn: () => adminFaqList(accessToken),
    refetchInterval: 30 * 1000,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
  });
};

export const useAdminAboutUs = () => {
  const { accessToken } = useAdminAuthStore();

  return useQuery<IAboutUsResponse>({
    queryKey: ["adminAboutUs"],
    queryFn: () => adminAboutUs(accessToken),
    refetchInterval: 30 * 1000,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
  });
};

export const useAdminAboutUsUpdate = () => {
  const { accessToken } = useAdminAuthStore();

  return useMutation({
    mutationFn: ({ text }: { text: string }) =>
      adminAboutUsUpdate(text, accessToken),
  });
};

export const useAdminFaqUpdate = () => {
  const { accessToken } = useAdminAuthStore();

  return useMutation({
    mutationFn: (faqs: IAdminFaqUpdateItem[]) =>
      adminFaqUpdate(faqs, accessToken),
  });
};

export const useAdminUserRequest = (id: number | undefined) => {
  const { accessToken } = useAdminAuthStore();

  return useQuery<IUserRetrive>({
    queryKey: ["adminUserRequest", id],
    queryFn: () => adminUserRequest(id, accessToken),
    refetchInterval: 30 * 1000,
    enabled: Boolean(id),
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
  });
};

export const useAdminUsersList = (
  params?: Partial<ParamsUsersList> | undefined,
) => {
  const { accessToken } = useAdminAuthStore();

  return useQuery<IUsersListResponse>({
    queryKey: ["adminUsersList", params],
    queryFn: () => adminUsersList(params, accessToken),
    refetchInterval: 30 * 1000,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
  });
};

export const useAdminArtistStatusUpdate = (id: number) => {
  const { accessToken } = useAdminAuthStore();

  return useMutation({
    mutationFn: (body: IArtistStatusUpdateRequest) =>
      adminArtistStatusUpdate(id, body, accessToken),
  });
};

export const useAdminSupportUpdate = () => {
  const { accessToken } = useAdminAuthStore();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      adminSupportUpdate(id, status, accessToken),
  });
};

export const useAdminCreateFaq = () => {
  const { accessToken } = useAdminAuthStore();

  return useMutation<IRetriveResponse<IFaqItem>, Error, { question: string; answer: string }>({
    mutationFn: (payload) => adminCreateFaq(payload, accessToken),
  });
};
