import {
  IProvinceListResponse,
  IRetriveResponse,
  LoginResponse,
  ParamsArtistList,
  ParamsCategoryList,
} from "../admin/type";
import landingApi from "../landingAxiosInstance";
import {
  IUserArtistListResponse,
  IUserProfile,
  UserLoginRequest,
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
