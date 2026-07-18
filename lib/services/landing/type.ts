import {
  IArtistItem,
  IBasePaginateResponse,
  IFormStep,
  IRetriveResponse,
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
  createdAt: string | null;
  deletedAt: string | null;
  description: string | null;
  enName: string | null;
  faName: string;
  id: number;
  image: string | null;
  isActive: boolean;
  priority: number;
  updatedAt: string | null;
}

export interface IUserCategoryResponse {
  children: IUserCaategoryItem[];
  createdAt: string | null;
  deletedAt: string | null;
  description: string | null;
  enName: string | null;
  faName: string;
  id: number;
  image: string | null;
  isActive: boolean;
  priority: number;
  updatedAt: string | null;
}

export type IFormSchemaResponse = IRetriveResponse<{ steps: IFormStep[] }>;

export type IUserArtistListResponse = IBasePaginateResponse<IArtistItem>;
export type IUserSupportListResponse = IBasePaginateResponse<ISupportItem>;
export type IUserCategoryListResponse =
  IBasePaginateResponse<IUserCategoryResponse>;

export interface ICityItem {
  id: number;
  name: string;
}

export type FileTyp = {
  file?: File;
  src?: string;
  loading?: boolean | number;
  status?: "warning" | "error" | "default";
  title?: string;
  errorMessage?: string;
  hintMessage?: string;
  className?: string;
};

export type ICityListResponse = IBaseResponse<ICityItem>;

export type ArtistRequestStatus =
  | "PENDING_PAYMENT"
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

export type PortfolioType = "IMAGE" | "VIDEO";

export type UserCreateArtistRequest = {
  categoryIds: number[];
  answers: Record<string, unknown>;
  sampleType: ESampleType;
  portfolios?: { path: string; type: PortfolioType }[];
};

export type ArtistRequestResult = {
  artistRequestId: number;
  status: ArtistRequestStatus;
  portfolios: { id: number; filePath: string; type: PortfolioType }[];
};

export enum ESampleType {
  HAS_SAMPLE = "HAS_SAMPLE",
  NO_SAMPLE = "NO_SAMPLE",
  WANTS_RECORDING = "WANTS_RECORDING",
}
