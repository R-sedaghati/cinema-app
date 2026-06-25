import { useMutation, useQuery } from "@tanstack/react-query";
import {
  IAboutUsResponse,
  IArtistRetriveResponse,
  IFaqListResponse,
  IProvinceListResponse,
  IRetriveResponse,
  ISupportItem,
  LoginResponse,
  ParamsArtistList,
  ParamsCategoryList,
} from "../admin/type";
import { AxiosError } from "axios";
import {
  ArtistRequestResult,
  ICityListResponse,
  IPagination,
  IUserArtistListResponse,
  IUserCategoryListResponse,
  IUserProfile,
  IUserSupportListResponse,
  UserCreateArtistRequest,
  UserCreateSupport,
  UserLoginRequest,
  UserUpdateProfile,
} from "./type";
import {
  getUserArtistDetail,
  updateUserArtistRequest,
  userAboutUs,
  userArtistRequests,
  userArtsitList,
  userCategoryList,
  userCityList,
  userCreateArtistRequest,
  userCreateSupport,
  userFaqList,
  userLogin,
  userProfile,
  userProvinceList,
  userSupport,
  userUpdatePofile,
  userUploadAvatar,
  userUploadVideo,
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
    queryKey: ["userArtsitList", params],
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

export const useUserSupport = (params: IPagination) => {
  const { accessToken } = useAuthStore();

  return useQuery<IUserSupportListResponse>({
    queryKey: ["userSupport", params],
    queryFn: () => userSupport(params, accessToken),
    refetchInterval: 30 * 1000,
    enabled: Boolean(accessToken),
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
  });
};

export const useUserAtristRequests = (params: IPagination) => {
  const { accessToken } = useAuthStore();

  return useQuery<IUserArtistListResponse>({
    queryKey: ["userSuserArtistRequestsupport", params],
    queryFn: () => userArtistRequests(params, accessToken),
    refetchInterval: 30 * 1000,
    enabled: Boolean(accessToken),
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
  });
};

export const useUpdateUserProfile = () =>
  useMutation<IUserProfile, AxiosError, Partial<UserUpdateProfile>>({
    mutationFn: userUpdatePofile,
  });

export const useCreateUserSupport = () =>
  useMutation<ISupportItem, AxiosError, UserCreateSupport>({
    mutationFn: userCreateSupport,
  });

export const useUserCategoryList = (params: IPagination) => {
  return useQuery<IUserCategoryListResponse>({
    queryKey: ["userCategoryList", params],
    queryFn: () => userCategoryList(params),
    refetchInterval: 30 * 1000,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
  });
};

export const useUserFaqList = () => {
  return useQuery<IFaqListResponse>({
    queryKey: ["userFaqList"],
    queryFn: () => userFaqList(),
    refetchInterval: 30 * 1000,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
  });
};

export const useUserAboutUs = () => {
  return useQuery<IAboutUsResponse>({
    queryKey: ["userAboutUs"],
    queryFn: () => userAboutUs(),
    refetchInterval: 30 * 1000,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
  });
};

export const useUserCityList = (provinceId: number) => {
  return useQuery<ICityListResponse>({
    queryKey: ["userCityList", provinceId],
    queryFn: () => userCityList(provinceId),
    refetchInterval: 30 * 1000,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
    enabled: provinceId > 0,
  });
};

export const useUserUploadAvatar = () =>
  useMutation<{ path: string }, AxiosError, File>({
    mutationFn: userUploadAvatar,
  });

export const useUserUploadVideo = () =>
  useMutation<{ path: string; filename: string }, AxiosError, File>({
    mutationFn: userUploadVideo,
  });

export const useUserCreateArtistRequest = () =>
  useMutation<{ result: ArtistRequestResult }, AxiosError, UserCreateArtistRequest>({
    mutationFn: userCreateArtistRequest,
  });

export const useUserArtistDetail = (id?: number) =>
  useQuery<IArtistRetriveResponse>({
    queryKey: ["userArtistDetail", id],
    queryFn: () => getUserArtistDetail(id!),
    enabled: !!id,
    refetchInterval: 30 * 1000,
    refetchOnWindowFocus: false,
  });

export const useUpdateUserArtistRequest = () => {
  const { accessToken } = useAuthStore();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: number } & Partial<UserCreateArtistRequest>) =>
      updateUserArtistRequest(id, payload, accessToken),
  });
};
