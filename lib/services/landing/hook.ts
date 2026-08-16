import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import {
  IAboutUsResponse,
  IArtistRetriveResponse,
  IBannerListResponse,
  IFaqListResponse,
  IProvinceListResponse,
  IRetriveResponse,
  ISiteContentResponse,
  ISupportItem,
  ITutorialListResponse,
  LoginResponse,
  ParamsArtistList,
} from "../admin/type";
import { AxiosError } from "axios";
import {
  ArtistRequestResult,
  ICityListResponse,
  IArtistContactResponse,
  IArtistFiltersResponse,
  IContactPriceResponse,
  IContactRequestListResponse,
  ICreateContactRequestResponse,
  IFormSchemaResponse,
  IPagination,
  ParamsPublicArtistList,
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
  userBannerList,
  userCategoryList,
  userCityList,
  userCreateArtistRequest,
  userCreateSupport,
  userFaqList,
  userLogin,
  userSiteContent,
  userTutorialList,
  userProfile,
  userProvinceList,
  userSupport,
  userUpdatePofile,
  userUploadAvatar,
  userUploadImage,
  userUploadVideo,
  userGetCategoryFormSchema,
  userCategoryFilters,
  userContactPrice,
  userCreateContactRequest,
  userArtistContact,
  userContactRequests,
} from "./api";
import useAuthStore from "@/lib/stores/useAuthStore";

export const useUserLogin = () =>
  useMutation<IRetriveResponse<LoginResponse>, AxiosError, UserLoginRequest>({
    mutationFn: userLogin,
  });

export const useUserArtsitList = (
  params?: ParamsPublicArtistList | undefined,
) => {
  return useQuery<IUserArtistListResponse>({
    queryKey: ["userArtsitList", params],
    queryFn: () => userArtsitList(params),
    refetchInterval: 30 * 1000,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
  });
};

/** Paginated variant backing the "نمایش بیشتر" button on the artist search page. */
export const useUserArtistListInfinite = (
  params?: ParamsPublicArtistList | undefined,
  pageSize = 12,
  enabled = true,
) => {
  return useInfiniteQuery<IUserArtistListResponse>({
    enabled,
    queryKey: ["userArtistListInfinite", params, pageSize],
    queryFn: ({ pageParam }) =>
      userArtsitList({ ...params, page: pageParam as number, count: pageSize }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.next ? allPages.length + 1 : undefined,
    // Filter changes shouldn't blank the grid while the new page loads.
    placeholderData: (previous) => previous,
    refetchOnWindowFocus: false,
  });
};

export const useUserCategoryFilters = (categoryId?: number | null) =>
  useQuery<IArtistFiltersResponse>({
    queryKey: ["userCategoryFilters", categoryId],
    queryFn: () => userCategoryFilters(categoryId!),
    enabled: !!categoryId,
    refetchOnWindowFocus: false,
  });

export const useUserProvinceList = (
  params?: Partial<ParamsArtistList> | undefined,
  enabled = true,
) => {
  return useQuery<IProvinceListResponse>({
    queryKey: ["userProvinceList", params],
    queryFn: () => userProvinceList(params),
    refetchInterval: 30 * 1000,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
    enabled,
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

export const useUserBannerList = () => {
  return useQuery<IBannerListResponse>({
    queryKey: ["userBannerList"],
    queryFn: () => userBannerList(),
    refetchInterval: 30 * 1000,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
  });
};

export const useUserTutorialList = () => {
  return useQuery<ITutorialListResponse>({
    queryKey: ["userTutorialList"],
    queryFn: () => userTutorialList(),
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

export const useUserSiteContent = () => {
  return useQuery<ISiteContentResponse>({
    queryKey: ["userSiteContent"],
    queryFn: () => userSiteContent(),
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

export const useUserUploadImage = () =>
  useMutation<{ path: string; filename: string }, AxiosError, File>({
    mutationFn: userUploadImage,
  });

export const useUserCategoryFormSchema = (categoryId?: number | null) =>
  useQuery<IFormSchemaResponse>({
    queryKey: ["userCategoryFormSchema", categoryId],
    queryFn: () => userGetCategoryFormSchema(categoryId!),
    enabled: !!categoryId,
    refetchInterval: 30 * 1000,
    refetchOnWindowFocus: false,
  });

export const useUserCreateArtistRequest = () =>
  useMutation<
    { result: ArtistRequestResult },
    AxiosError,
    UserCreateArtistRequest
  >({
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
    mutationFn: ({
      id,
      ...payload
    }: { id: number } & Partial<UserCreateArtistRequest>) =>
      updateUserArtistRequest(id, payload, accessToken),
  });
};

export const useUserContactPrice = (artistId?: number | null) =>
  useQuery<IContactPriceResponse>({
    queryKey: ["userContactPrice", artistId],
    queryFn: () => userContactPrice(artistId!),
    enabled: Boolean(artistId),
    refetchOnWindowFocus: false,
  });

export const useUserContactRequests = (params: IPagination) => {
  const { accessToken } = useAuthStore();

  return useQuery<IContactRequestListResponse>({
    queryKey: ["userContactRequests", params],
    queryFn: () => userContactRequests(params),
    enabled: Boolean(accessToken),
    refetchOnWindowFocus: false,
  });
};

/**
 * Only enable once the caller knows the artist is unlocked — the endpoint answers 403
 * otherwise, which the axios interceptor would surface as an error toast.
 */
export const useUserArtistContact = (artistId?: number | null, enabled = false) => {
  const { accessToken } = useAuthStore();

  return useQuery<IArtistContactResponse>({
    queryKey: ["userArtistContact", artistId],
    queryFn: () => userArtistContact(artistId!),
    enabled: Boolean(accessToken) && Boolean(artistId) && enabled,
    refetchOnWindowFocus: false,
  });
};

export const useUserCreateContactRequest = () =>
  useMutation<
    ICreateContactRequestResponse,
    AxiosError,
    { artistId: number; requesterName: string }
  >({
    mutationFn: userCreateContactRequest,
  });
