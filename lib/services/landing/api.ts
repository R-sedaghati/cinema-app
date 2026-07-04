import {
  IAboutUsResponse,
  IArtistRetriveResponse,
  IBannerListResponse,
  IFaqListResponse,
  IProvinceListResponse,
  IRetriveResponse,
  ISupportItem,
  ITutorialListResponse,
  LoginResponse,
  ParamsArtistList,
  ParamsCategoryList,
} from "../admin/type";
import landingApi from "../landingAxiosInstance";
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

export const userLogin = async (
  payload: UserLoginRequest,
): Promise<IRetriveResponse<LoginResponse>> => {
  const res = await landingApi.post<IRetriveResponse<LoginResponse>>(
    "/user/login/",
    payload,
  );
  return res.data;
};

export const userArtsitList = async (
  params: Partial<ParamsCategoryList> | undefined,
) => {
  const { data } = await landingApi.get<IUserArtistListResponse>(
    "/artists-requests",
    {
      params: params,
    },
  );

  return data;
};

export const userProvinceList = async (
  params: Partial<ParamsArtistList> | undefined,
) => {
  const { data } = await landingApi.get<IProvinceListResponse>("/provinces", {
    params: params,
  });

  return data;
};

export const userProfile = async (accessToken: string) => {
  const { data } = await landingApi.get<IUserProfile>("/user/profile", {
    headers: {
      Authorization: accessToken,
    },
  });

  return data;
};

export const userSupport = async (params: IPagination, accessToken: string) => {
  const { data } = await landingApi.get<IUserSupportListResponse>(
    "/user/supports",
    {
      params: params,
      headers: {
        Authorization: accessToken,
      },
    },
  );

  return data;
};

export const userArtistRequests = async (
  params: IPagination,
  accessToken: string,
) => {
  const { data } = await landingApi.get<IUserArtistListResponse>(
    "/user/artist-requests",
    {
      params: params,
      headers: {
        Authorization: accessToken,
      },
    },
  );

  return data;
};

export const userUpdatePofile = async (
  payload: Partial<UserUpdateProfile>,
): Promise<IUserProfile> => {
  const res = await landingApi.patch<IUserProfile>("/user/profile/", payload);
  return res.data;
};

export const userCreateSupport = async (
  payload: UserCreateSupport,
): Promise<ISupportItem> => {
  const res = await landingApi.post<ISupportItem>("/user/supports/", payload);
  return res.data;
};

export const userCategoryList = async (params: IPagination) => {
  const { data } = await landingApi.get<IUserCategoryListResponse>(
    "/categories",
    {
      params: params,
    },
  );

  return data;
};

export const userFaqList = async () => {
  const { data } = await landingApi.get<IFaqListResponse>("/faqs");

  return data;
};

export const userBannerList = async () => {
  const { data } = await landingApi.get<IBannerListResponse>("/banners");

  return data;
};

export const userTutorialList = async () => {
  const { data } = await landingApi.get<ITutorialListResponse>("/tutorials");

  return data;
};

export const userAboutUs = async () => {
  const { data } = await landingApi.get<IAboutUsResponse>("/about-us");

  return data;
};

export const userCityList = async (provinceId: number) => {
  const { data } = await landingApi.get<ICityListResponse>(
    `/provinces/${provinceId}/cities`,
  );
  return data;
};

export const userUploadAvatar = async (file: File) => {
  const form = new FormData();
  form.append("file", file);
  const { data } = await landingApi.post<{ path: string }>(
    "/user/avatar",
    form,
  );
  return data;
};

export const userUploadVideo = async (file: File) => {
  const form = new FormData();
  form.append("file", file);
  const { data } = await landingApi.post<{ path: string; filename: string }>(
    "/user/upload/video",
    form,
  );
  return data;
};

export const userUploadImage = async (file: File) => {
  const form = new FormData();
  form.append("file", file);
  const { data } = await landingApi.post<{ path: string; filename: string }>(
    "/user/upload/image",
    form,
  );
  return data;
};

export const userCreateArtistRequest = async (
  payload: UserCreateArtistRequest,
) => {
  const { data } = await landingApi.post<{ result: ArtistRequestResult }>(
    "/user/artist-requests",
    payload,
  );
  return data;
};

export const getUserArtistDetail = async (id: number) => {
  const { data } = await landingApi.get<IArtistRetriveResponse>(
    `/artists-requests/${id}/`,
  );
  return data;
};

export const updateUserArtistRequest = async (
  id: number,
  payload: Partial<UserCreateArtistRequest>,
  accessToken: string,
) => {
  const { data } = await landingApi.patch<{ result: ArtistRequestResult }>(
    `/user/artist-requests/${id}/`,
    payload,
    { headers: { Authorization: accessToken } },
  );
  return data;
};
