import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
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
  IWalletBalanceResponse,
  IWalletTransactionListResponse,
  IContactRequestListResponse,
  ICreateContactRequestResponse,
  IFormSchemaResponse,
  IPagination,
  ParamsPublicArtistList,
  IUserArtistListResponse,
  IUserCategoryListResponse,
  IUserProfile,
  IUserMessageListResponse,
  IUserSupportListResponse,
  UserCreateArtistRequest,
  UserCreateSupport,
  UserLoginRequest,
  UserUpdateProfile,
} from "./type";
import {
  getUserArtistDetail,
  getOwnArtistRequest,
  updateUserArtistRequest,
  userMessages,
  userMessageRead,
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
  userWalletBalance,
  userWalletTransactions,
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

  // No polling: nothing outside this app edits the profile, and a background refetch
  // landing mid-edit would reset the form the user is typing into.
  return useQuery<IUserProfile>({
    queryKey: ["userProfile"],
    queryFn: () => userProfile(accessToken),
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

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<IUserProfile, AxiosError, Partial<UserUpdateProfile>>({
    mutationFn: userUpdatePofile,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["userProfile"] }),
  });
};

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
    // A form schema is not live data, and polling it swapped fields out from under a
    // user who was mid-way through filling them in.
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });

export const useUserCreateArtistRequest = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { result: ArtistRequestResult },
    AxiosError,
    UserCreateArtistRequest
  >({
    mutationFn: userCreateArtistRequest,
    // The API copies answers of `syncToUserField` fields into the account on submit.
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["userProfile"] }),
  });
};

export const useUserArtistDetail = (id?: number) =>
  useQuery<IArtistRetriveResponse>({
    queryKey: ["userArtistDetail", id],
    queryFn: () => getUserArtistDetail(id!),
    enabled: !!id,
    refetchInterval: 30 * 1000,
    refetchOnWindowFocus: false,
  });

/**
 * Edit-mode source of truth. No polling and no staleness: the hydration effect wipes the
 * form store when a new response lands, so a background refetch would eat what the user
 * just typed.
 */
export const useOwnArtistRequest = (id?: number) => {
  const { accessToken } = useAuthStore();

  return useQuery<IArtistRetriveResponse>({
    queryKey: ["ownArtistRequest", id],
    queryFn: () => getOwnArtistRequest(id!, accessToken),
    enabled: Boolean(id && accessToken),
    refetchInterval: false,
    staleTime: Infinity,
    // `staleTime: Infinity` alone would leave a failed save serving the pre-edit answers
    // with no path back to the server; remounting the page is the user's retry.
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
  });
};

export const useUpdateUserArtistRequest = () => {
  const { accessToken } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      ...payload
    }: { id: number } & Partial<UserCreateArtistRequest>) =>
      updateUserArtistRequest(id, payload, accessToken),
    // The API copies answers of `syncToUserField` fields into the account on submit.
    onSuccess: (_res, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      queryClient.invalidateQueries({ queryKey: ["ownArtistRequest", id] });
      // The approved request also backs the public artist page, which otherwise serves
      // the pre-edit answers until its next poll.
      queryClient.invalidateQueries({ queryKey: ["userArtistDetail", id] });
      // the profile forms list, so its status/date are fresh on the way back
      queryClient.invalidateQueries({
        queryKey: ["userSuserArtistRequestsupport"],
      });
    },
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

export const useUserWalletBalance = () => {
  const { accessToken } = useAuthStore();

  return useQuery<IWalletBalanceResponse>({
    queryKey: ["userWalletBalance"],
    queryFn: userWalletBalance,
    enabled: Boolean(accessToken),
    refetchOnWindowFocus: false,
  });
};

export const useUserWalletTransactions = (params: IPagination) => {
  const { accessToken } = useAuthStore();

  return useQuery<IWalletTransactionListResponse>({
    queryKey: ["userWalletTransactions", params],
    queryFn: () => userWalletTransactions(params),
    enabled: Boolean(accessToken),
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

export const useUserMessages = (params: IPagination) => {
  const { accessToken } = useAuthStore();

  return useQuery<IUserMessageListResponse>({
    queryKey: ["userMessages", params],
    queryFn: () => userMessages(params, accessToken),
    enabled: Boolean(accessToken),
    refetchInterval: 30 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useUserMessageRead = () => {
  const { accessToken } = useAuthStore();

  return useMutation({
    mutationFn: (id: number) => userMessageRead(id, accessToken),
  });
};
