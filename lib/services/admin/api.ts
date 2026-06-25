import api from "../axiosInstance";
import {
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
    params: params,
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

export const adminArtistList = async (
  params: Partial<ParamsArtistList> | undefined,
  accessToken: string,
) => {
  const { data } = await api.get<IArtistListResponse>(
    "/admin/artist-requests",
    {
      params: params,
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
    params: params,
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
    params: params,
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
    params: params,
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
