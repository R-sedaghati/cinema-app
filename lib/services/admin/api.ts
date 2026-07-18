import api from "../axiosInstance";
import {
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
  IFormFieldRetrieveResponse,
  IFormSchemaRetrieveResponse,
  IFormStepRetrieveResponse,
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

export const adminLogin = async (
  payload: LoginRequest,
): Promise<IRetriveResponse<LoginResponse>> => {
  const res = await api.post<IRetriveResponse<LoginResponse>>(
    "/admin/login/",
    payload,
  );
  return res.data;
};

export const adminCategoryList = async (
  params: Partial<ParamsCategoryList> | undefined,
  accessToken: string,
) => {
  const { data } = await api.get<ICatrgotyListResponse>("/admin/categories", {
    params: { count: 30, ...params },
    headers: {
      Authorization: accessToken,
    },
  });

  return data;
};

export const adminCategoryUpdate = async (
  id: number,
  payload: IUpdateCategoryRequest,
  accessToken: string,
) => {
  const { data } = await api.patch(`/admin/categories/${id}`, payload, {
    headers: {
      Authorization: accessToken,
    },
  });

  return data;
};

export const adminCategoryCreate = async (
  payload: ICreateCategoryRequest,
  accessToken: string,
) => {
  const { data } = await api.post<ICategoryRetriveResponse>(
    "/admin/categories",
    payload,
    { headers: { Authorization: accessToken } },
  );

  return data;
};

export const adminCategoryDelete = async (id: number, accessToken: string) => {
  const { data } = await api.delete<IRetriveResponse<null>>(
    `/admin/categories/${id}`,
    { headers: { Authorization: accessToken } },
  );

  return data;
};

export const adminCategoryRetrieve = async (
  id: number,
  accessToken: string,
) => {
  const { data } = await api.get<ICategoryRetriveResponse>(
    `/admin/categories/${id}`,
    {
      headers: {
        Authorization: accessToken,
      },
    },
  );

  return data;
};

export const adminGetFormSchema = async (categoryId: number, accessToken: string) => {
  const { data } = await api.get<IFormSchemaRetrieveResponse>(
    `/admin/categories/${categoryId}/form-schema/`,
    { headers: { Authorization: accessToken } },
  );
  return data;
};

export const adminCreateFormStep = async (
  categoryId: number,
  payload: ICreateFormStepRequest,
  accessToken: string,
) => {
  const { data } = await api.post<IFormStepRetrieveResponse>(
    `/admin/categories/${categoryId}/form-steps/`,
    payload,
    { headers: { Authorization: accessToken } },
  );
  return data;
};

export const adminUpdateFormStep = async (
  stepId: number,
  payload: IUpdateFormStepRequest,
  accessToken: string,
) => {
  const { data } = await api.patch<IFormStepRetrieveResponse>(
    `/admin/form-steps/${stepId}/`,
    payload,
    { headers: { Authorization: accessToken } },
  );
  return data;
};

export const adminDeleteFormStep = async (stepId: number, accessToken: string) => {
  const { data } = await api.delete<IRetriveResponse<{ id: number }>>(
    `/admin/form-steps/${stepId}/`,
    { headers: { Authorization: accessToken } },
  );
  return data;
};

export const adminCreateFormField = async (
  stepId: number,
  payload: ICreateFormFieldRequest,
  accessToken: string,
) => {
  const { data } = await api.post<IFormFieldRetrieveResponse>(
    `/admin/form-steps/${stepId}/fields/`,
    payload,
    { headers: { Authorization: accessToken } },
  );
  return data;
};

export const adminUpdateFormField = async (
  fieldId: number,
  payload: IUpdateFormFieldRequest,
  accessToken: string,
) => {
  const { data } = await api.patch<IFormFieldRetrieveResponse>(
    `/admin/form-fields/${fieldId}/`,
    payload,
    { headers: { Authorization: accessToken } },
  );
  return data;
};

export const adminDeleteFormField = async (fieldId: number, accessToken: string) => {
  const { data } = await api.delete<IRetriveResponse<{ id: number }>>(
    `/admin/form-fields/${fieldId}/`,
    { headers: { Authorization: accessToken } },
  );
  return data;
};

export const adminArtistList = async (
  params: Partial<ParamsArtistList> | undefined,
  accessToken: string,
) => {
  const { data } = await api.get<IArtistListResponse>(
    "/admin/artist-requests",
    {
      params: { count: 30, ...params },
      headers: {
        Authorization: accessToken,
      },
    },
  );

  return data;
};

export const adminArtistRetrieve = async (id: number, accessToken: string) => {
  const { data } = await api.get<IArtistRetriveResponse>(
    `/admin/artist-requests/${id}`,
    {
      headers: {
        Authorization: accessToken,
      },
    },
  );

  return data;
};

export const adminSupportList = async (
  params: Partial<ParamsArtistList> | undefined,
  accessToken: string,
) => {
  const { data } = await api.get<ISupportListResponse>("/admin/supports", {
    params: { count: 30, ...params },
    headers: {
      Authorization: accessToken,
    },
  });

  return data;
};

export const adminSupportRetrieve = async (id: number, accessToken: string) => {
  const { data } = await api.get<ISupportRetriveResponse>(
    `/admin/supports/${id}`,
    {
      headers: {
        Authorization: accessToken,
      },
    },
  );

  return data;
};

export const adminProvinceList = async (
  params: Partial<ParamsArtistList> | undefined,
  accessToken: string,
) => {
  const { data } = await api.get<IProvinceListResponse>("/provinces", {
    params: { count: 30, ...params },
    headers: {
      Authorization: accessToken,
    },
  });

  return data;
};

export const adminFaqList = async (accessToken: string) => {
  const { data } = await api.get<IFaqListResponse>("/admin/faqs", {
    headers: {
      Authorization: accessToken,
    },
  });

  return data;
};

export const adminAboutUs = async (accessToken: string) => {
  const { data } = await api.get<IAboutUsResponse>("/admin/about-us", {
    headers: {
      Authorization: accessToken,
    },
  });

  return data;
};

export const adminAboutUsUpdate = async (text: string, accessToken: string) => {
  const { data } = await api.patch(
    `/admin/about-us/1`,
    { text },
    {
      headers: {
        Authorization: accessToken,
      },
    },
  );

  return data;
};

export const adminFaqUpdate = async (
  faqs: IAdminFaqUpdateItem[],
  accessToken: string,
) => {
  const { data } = await api.patch("/admin/faqs", faqs, {
    headers: {
      Authorization: accessToken,
    },
  });

  return data;
};

export const adminFaqDelete = async (id: number, accessToken: string) => {
  const { data } = await api.delete<IRetriveResponse<null>>(
    `/admin/faqs/${id}`,
    { headers: { Authorization: accessToken } },
  );

  return data;
};

export const adminSiteContent = async (accessToken: string) => {
  const { data } = await api.get<ISiteContentResponse>("/admin/site-content", {
    headers: {
      Authorization: accessToken,
    },
  });

  return data;
};

export const adminSiteContentUpdate = async (
  payload: Partial<Omit<ISiteContent, "id">>,
  accessToken: string,
) => {
  const { data } = await api.patch<ISiteContentResponse>(
    "/admin/site-content/1",
    payload,
    { headers: { Authorization: accessToken } },
  );

  return data;
};

export const adminUserRequest = async (
  id: number | undefined,
  accessToken: string,
) => {
  const { data } = await api.get<IUserRetrive>(
    `/admin/users/${id}/artist-requests/`,
    {
      headers: {
        Authorization: accessToken,
      },
    },
  );

  return data;
};

export const adminUsersList = async (
  params: Partial<ParamsUsersList> | undefined,
  accessToken: string,
) => {
  const { data } = await api.get<IUsersListResponse>("/admin/users", {
    params: { count: 30, ...params },
    headers: {
      Authorization: accessToken,
    },
  });

  return data;
};

export const adminArtistStatusUpdate = async (
  id: number,
  payload: IArtistStatusUpdateRequest,
  accessToken: string,
) => {
  const { data } = await api.patch(`/admin/artist-requests/${id}`, payload, {
    headers: {
      Authorization: accessToken,
    },
  });

  return data;
};

export const adminSupportUpdate = async (
  id: number,
  status: string,
  accessToken: string,
) => {
  const { data } = await api.patch<ISupportRetriveResponse>(
    `/admin/supports/${id}/`,
    { status },
    { headers: { Authorization: accessToken } },
  );
  return data;
};

export const adminCreateFaq = async (
  payload: { question: string; answer: string },
  accessToken: string,
) => {
  const { data } = await api.post<IRetriveResponse<IFaqItem>>(
    "/admin/faqs/",
    payload,
    { headers: { Authorization: accessToken } },
  );
  return data;
};

export const adminBannerList = async (
  params: Partial<ParamsBannerList> | undefined,
  accessToken: string,
) => {
  const { data } = await api.get<IBannerListResponse>("/admin/banners", {
    params: { count: 30, ...params },
    headers: {
      Authorization: accessToken,
    },
  });

  return data;
};

export const adminBannerRetrieve = async (id: number, accessToken: string) => {
  const { data } = await api.get<IBannerRetrieveResponse>(
    `/admin/banners/${id}`,
    {
      headers: {
        Authorization: accessToken,
      },
    },
  );

  return data;
};

export const adminBannerCreate = async (
  payload: IBannerUpsertRequest,
  accessToken: string,
) => {
  const { data } = await api.post<IBannerRetrieveResponse>(
    "/admin/banners",
    payload,
    { headers: { Authorization: accessToken } },
  );

  return data;
};

export const adminBannerUpdate = async (
  id: number,
  payload: IBannerUpsertRequest,
  accessToken: string,
) => {
  const { data } = await api.patch<IBannerRetrieveResponse>(
    `/admin/banners/${id}`,
    payload,
    { headers: { Authorization: accessToken } },
  );

  return data;
};

export const adminBannerDelete = async (id: number, accessToken: string) => {
  const { data } = await api.delete<IRetriveResponse<null>>(
    `/admin/banners/${id}`,
    { headers: { Authorization: accessToken } },
  );

  return data;
};

export const adminUploadBannerImage = async (
  file: File,
  accessToken: string,
) => {
  const form = new FormData();
  form.append("file", file);
  const { data } = await api.post<{ path: string }>(
    "/admin/upload/image",
    form,
    { headers: { Authorization: accessToken } },
  );

  return data;
};

export const adminTutorialList = async (
  params: Partial<ParamsTutorialList> | undefined,
  accessToken: string,
) => {
  const { data } = await api.get<ITutorialListResponse>("/admin/tutorials", {
    params: { count: 30, ...params },
    headers: {
      Authorization: accessToken,
    },
  });

  return data;
};

export const adminTutorialRetrieve = async (id: number, accessToken: string) => {
  const { data } = await api.get<ITutorialRetrieveResponse>(
    `/admin/tutorials/${id}`,
    {
      headers: {
        Authorization: accessToken,
      },
    },
  );

  return data;
};

export const adminTutorialCreate = async (
  payload: ITutorialUpsertRequest,
  accessToken: string,
) => {
  const { data } = await api.post<ITutorialRetrieveResponse>(
    "/admin/tutorials",
    payload,
    { headers: { Authorization: accessToken } },
  );

  return data;
};

export const adminTutorialUpdate = async (
  id: number,
  payload: ITutorialUpsertRequest,
  accessToken: string,
) => {
  const { data } = await api.patch<ITutorialRetrieveResponse>(
    `/admin/tutorials/${id}`,
    payload,
    { headers: { Authorization: accessToken } },
  );

  return data;
};

export const adminTutorialDelete = async (id: number, accessToken: string) => {
  const { data } = await api.delete<IRetriveResponse<null>>(
    `/admin/tutorials/${id}`,
    { headers: { Authorization: accessToken } },
  );

  return data;
};

export const adminUploadTutorialThumbnail = async (
  file: File,
  accessToken: string,
) => {
  const form = new FormData();
  form.append("file", file);
  const { data } = await api.post<{ path: string }>(
    "/admin/upload/image",
    form,
    { headers: { Authorization: accessToken } },
  );

  return data;
};
