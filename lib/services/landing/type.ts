import {
  IArtistItem,
  IBasePaginateResponse,
  ICategoryConfig,
  ISupportItem,
} from "../admin/type";

export type UserLoginRequest = {
  phone_number: string;
  code?: string;
};

export interface IPagination {
  page: number;
  count: number;
}

export type UserUpdateProfile = {
  firstName: string;
  lastName: string;
  email: string;
  phone_number: string;
};

export type UserCreateSupport = {
  first_name: string;
  last_name: string;
  email: string;
  category_id: number | null;
  subject: string;
  message: string;
  phone_number: string;
};

export interface IBaseResponse<T> {
  errors: string | null;
  message: string | null;
  success: boolean;
  result: T[];
}

export interface IUserProfile {
  avatar: string | null;
  email: string | null;
  firstName: string | null;
  id: number;
  lastLogin: string | null;
  lastName: string | null;
  phone_number: string | null;
}

export interface IUserCaategoryItem {
  config: ICategoryConfig | null;
  createdAt: string | null;
  deletedAt: string | null;
  enName: string | null;
  faName: string;
  id: number;
  isActive: boolean;
  updatedAt: string | null;
}

export interface IUserCategoryResponse {
  children: IUserCaategoryItem[];
  config: ICategoryConfig | null;
  createdAt: string | null;
  deletedAt: string | null;
  enName: string | null;
  faName: string;
  id: number;
  isActive: boolean;
  updatedAt: string | null;
}

export type IUserArtistListResponse = IBasePaginateResponse<IArtistItem>;
export type IUserSupportListResponse = IBasePaginateResponse<ISupportItem>;
export type IUserCategoryListResponse =
  IBasePaginateResponse<IUserCategoryResponse>;

export interface ICityItem {
  id: number;
  name: string;
}
export type ICityListResponse = IBaseResponse<ICityItem>;

export type ArtistRequestStatus =
  | "PENDING_PAYMENT"
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

export type PortfolioType = "IMAGE" | "VIDEO";

export type UserCreateArtistRequest = {
  categoryIds: number[];
  firstName?: string;
  lastName?: string;
  height?: number;
  weight?: number;
  language?: string;
  dialect?: string;
  email?: string;
  address?: string;
  province?: string;
  city?: string;
  postalCode?: string;
  education?: string;
  major?: string;
  avatar?: string;
  birthDate?: string;
  gender?: "MAN" | "WOMAN";
  aboutMe?: string;
  portfolios?: { path: string; type: PortfolioType }[];
};

export type ArtistRequestResult = {
  artistRequestId: number;
  status: ArtistRequestStatus;
  portfolios: { id: number; filePath: string; type: PortfolioType }[];
};
