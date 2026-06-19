import api from "../axiosInstance";
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
