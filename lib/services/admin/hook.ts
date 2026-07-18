import { useMutation, useQuery } from "@tanstack/react-query";
import {
  EArtistRequestStatus,
  IAboutUsResponse,
  IAdminFaqUpdateItem,
  IArtistListResponse,
  IArtistRetriveResponse,
  IArtistStatusUpdateRequest,
  IBannerListResponse,
  IBannerRetrieveResponse,
  IBannerUpsertRequest,
  ICategoryRetriveResponse,
  ICatrgotyListResponse,
  ICreateCategoryRequest,
  ICreateFormFieldRequest,
  ICreateFormStepRequest,
  IFaqItem,
  IFaqListResponse,
  IFormSchemaRetrieveResponse,
  IProvinceListResponse,
  IRetriveResponse,
  ISiteContent,
  ISiteContentResponse,
  ISupportListResponse,
  ISupportRetriveResponse,
  ITutorialListResponse,
  ITutorialRetrieveResponse,
  ITutorialUpsertRequest,
  IUpdateCategoryRequest,
  IUpdateFormFieldRequest,
  IUpdateFormStepRequest,
  IUserRetrive,
  IUsersListResponse,
  LoginRequest,
  LoginResponse,
  ParamsArtistList,
  ParamsBannerList,
  ParamsCategoryList,
  ParamsTutorialList,
  ParamsUsersList,
} from "./type";
import {
  adminAboutUs,
  adminAboutUsUpdate,
  adminArtistList,
  adminArtistRetrieve,
  adminArtistStatusUpdate,
  adminBannerCreate,
  adminBannerDelete,
  adminBannerList,
  adminBannerRetrieve,
  adminBannerUpdate,
  adminCategoryCreate,
  adminCategoryDelete,
  adminCategoryList,
  adminCategoryRetrieve,
  adminCategoryUpdate,
  adminCreateFaq,
  adminCreateFormField,
  adminCreateFormStep,
  adminDeleteFormField,
  adminDeleteFormStep,
  adminFaqDelete,
  adminFaqList,
  adminFaqUpdate,
  adminGetFormSchema,
  adminLogin,
  adminProvinceList,
  adminSiteContent,
  adminSiteContentUpdate,
  adminSupportList,
  adminSupportRetrieve,
  adminSupportUpdate,
  adminTutorialCreate,
  adminTutorialDelete,
  adminTutorialList,
  adminTutorialRetrieve,
  adminTutorialUpdate,
  adminUpdateFormField,
  adminUpdateFormStep,
  adminUploadBannerImage,
  adminUploadTutorialThumbnail,
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

export const useAdminFormSchema = (categoryId?: number) => {
  const { accessToken } = useAdminAuthStore();

  return useQuery<IFormSchemaRetrieveResponse>({
    queryKey: ["adminFormSchema", categoryId],
    queryFn: () => adminGetFormSchema(categoryId!, accessToken),
    enabled: Boolean(categoryId),
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
  });
};

export const useAdminCreateFormStep = () => {
  const { accessToken } = useAdminAuthStore();

  return useMutation({
    mutationFn: (data: { categoryId: number; payload: ICreateFormStepRequest }) =>
      adminCreateFormStep(data.categoryId, data.payload, accessToken),
  });
};

export const useAdminUpdateFormStep = () => {
  const { accessToken } = useAdminAuthStore();

  return useMutation({
    mutationFn: (data: { stepId: number; payload: IUpdateFormStepRequest }) =>
      adminUpdateFormStep(data.stepId, data.payload, accessToken),
  });
};

export const useAdminDeleteFormStep = () => {
  const { accessToken } = useAdminAuthStore();

  return useMutation({
    mutationFn: (stepId: number) => adminDeleteFormStep(stepId, accessToken),
  });
};

export const useAdminCreateFormField = () => {
  const { accessToken } = useAdminAuthStore();

  return useMutation({
    mutationFn: (data: { stepId: number; payload: ICreateFormFieldRequest }) =>
      adminCreateFormField(data.stepId, data.payload, accessToken),
  });
};

export const useAdminUpdateFormField = () => {
  const { accessToken } = useAdminAuthStore();

  return useMutation({
    mutationFn: (data: { fieldId: number; payload: IUpdateFormFieldRequest }) =>
      adminUpdateFormField(data.fieldId, data.payload, accessToken),
  });
};

export const useAdminDeleteFormField = () => {
  const { accessToken } = useAdminAuthStore();

  return useMutation({
    mutationFn: (fieldId: number) => adminDeleteFormField(fieldId, accessToken),
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

export const useAdminCategoryCreate = () => {
  const { accessToken } = useAdminAuthStore();

  return useMutation({
    mutationFn: (payload: ICreateCategoryRequest) =>
      adminCategoryCreate(payload, accessToken),
  });
};

export const useAdminCategoryDelete = () => {
  const { accessToken } = useAdminAuthStore();

  return useMutation({
    mutationFn: (id: number) => adminCategoryDelete(id, accessToken),
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

export const useAdminFaqDelete = () => {
  const { accessToken } = useAdminAuthStore();

  return useMutation({
    mutationFn: (id: number) => adminFaqDelete(id, accessToken),
  });
};

export const useAdminSiteContent = () => {
  const { accessToken } = useAdminAuthStore();

  return useQuery<ISiteContentResponse>({
    queryKey: ["adminSiteContent"],
    queryFn: () => adminSiteContent(accessToken),
    refetchInterval: 30 * 1000,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
  });
};

export const useAdminSiteContentUpdate = () => {
  const { accessToken } = useAdminAuthStore();

  return useMutation({
    mutationFn: (payload: Partial<Omit<ISiteContent, "id">>) =>
      adminSiteContentUpdate(payload, accessToken),
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

export const useAdminBannerList = (
  params?: Partial<ParamsBannerList> | undefined,
) => {
  const { accessToken } = useAdminAuthStore();

  return useQuery<IBannerListResponse>({
    queryKey: ["bannerList", params],
    queryFn: () => adminBannerList(params, accessToken),
    refetchInterval: 30 * 1000,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
  });
};

export const useAdminBannerRetrieve = (id?: number) => {
  const { accessToken } = useAdminAuthStore();

  return useQuery<IBannerRetrieveResponse>({
    queryKey: ["bannerRetrieve", id],
    queryFn: () => adminBannerRetrieve(id!, accessToken),
    enabled: Boolean(id),
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
  });
};

export const useAdminBannerCreate = () => {
  const { accessToken } = useAdminAuthStore();

  return useMutation({
    mutationFn: (payload: IBannerUpsertRequest) =>
      adminBannerCreate(payload, accessToken),
  });
};

export const useAdminBannerUpdate = () => {
  const { accessToken } = useAdminAuthStore();

  return useMutation({
    mutationFn: (data: { id: number; payload: IBannerUpsertRequest }) =>
      adminBannerUpdate(data.id, data.payload, accessToken),
  });
};

export const useAdminBannerDelete = () => {
  const { accessToken } = useAdminAuthStore();

  return useMutation({
    mutationFn: (id: number) => adminBannerDelete(id, accessToken),
  });
};

export const useAdminUploadBannerImage = () => {
  const { accessToken } = useAdminAuthStore();

  return useMutation({
    mutationFn: (file: File) => adminUploadBannerImage(file, accessToken),
  });
};

export const useAdminTutorialList = (
  params?: Partial<ParamsTutorialList> | undefined,
) => {
  const { accessToken } = useAdminAuthStore();

  return useQuery<ITutorialListResponse>({
    queryKey: ["tutorialList", params],
    queryFn: () => adminTutorialList(params, accessToken),
    refetchInterval: 30 * 1000,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
  });
};

export const useAdminTutorialRetrieve = (id?: number) => {
  const { accessToken } = useAdminAuthStore();

  return useQuery<ITutorialRetrieveResponse>({
    queryKey: ["tutorialRetrieve", id],
    queryFn: () => adminTutorialRetrieve(id!, accessToken),
    enabled: Boolean(id),
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
  });
};

export const useAdminTutorialCreate = () => {
  const { accessToken } = useAdminAuthStore();

  return useMutation({
    mutationFn: (payload: ITutorialUpsertRequest) =>
      adminTutorialCreate(payload, accessToken),
  });
};

export const useAdminTutorialUpdate = () => {
  const { accessToken } = useAdminAuthStore();

  return useMutation({
    mutationFn: (data: { id: number; payload: ITutorialUpsertRequest }) =>
      adminTutorialUpdate(data.id, data.payload, accessToken),
  });
};

export const useAdminTutorialDelete = () => {
  const { accessToken } = useAdminAuthStore();

  return useMutation({
    mutationFn: (id: number) => adminTutorialDelete(id, accessToken),
  });
};

export const useAdminUploadTutorialThumbnail = () => {
  const { accessToken } = useAdminAuthStore();

  return useMutation({
    mutationFn: (file: File) => adminUploadTutorialThumbnail(file, accessToken),
  });
};
