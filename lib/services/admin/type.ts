import { ESampleType } from "../landing/type";

export interface IRetriveResponse<T> {
  errors: string | null;
  message: string | null;
  success: boolean;
  result: T;
}

export interface IBasePaginateResponse<T> {
  count: number;
  previous: string | null;
  next: string | null;
  result: T[];
}

export type LoginRequest = {
  username: string;
  password: string;
};

export interface IPermissionItem {
  endpoint: string;
  method: string;
}

export type LoginResponse = {
  accessToken: string;
  email: string;
  id: number;
  role: string;
  type: string;
  username: string;
  permissions: IPermissionItem[];
};

export interface ParamsArtistList {
  count: number;
  page: number;
  search: string | null;
  status__in: string[];
  categoryId__in: number[];
  province__in: number[] | null;
  createdAt__gte: Date | null;
  createdAt__lte: Date | null;
  updateAt__gte: Date | null;
  updateAt__lte: Date | null;
}

interface IArtistCategory {
  enName: string;
  faName: string;
  id: number;
}

interface IArtistPortfolios {
  filePath: string;
  id: number;
  type: "IMAGE" | "VIDEO";
  url: string | null;
}

export enum EArtistRequestStatus {
  PENDING = "PENDING",
  PENDING_PAYMENT = "PENDING_PAYMENT",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  NEED_TO_REVISION = "NEED_TO_REVISION",
}

export enum EArtistGender {
  MAN = "MAN",
  WOMAN = "WOMAN",
}

interface IArtistUser {
  aboutMe: string | null;
  address: string | null;
  avatar: string | null;
  city: string | null;
  email: string | null;
  dialect: string | null;
  education: string | null;
  firstName: string | null;
  height: number | null;
  id: number;
  language: string | null;
  lastName: string | null;
  major: string | null;
  phoneNumber: string | null;
  postalCode: string | null;
  province: string | null;
  weight: number | null;
  gender: EArtistGender;
  code: string;
}

export interface IArtistItem {
  categories: IArtistCategory[];
  createdAt: string | null;
  updatedAt: string | null;
  trackingCode: string | null;
  id: number;
  portfolios: IArtistPortfolios[];
  status: EArtistRequestStatus;
  user: IArtistUser;
  sampleType: ESampleType;
  [key: string]: unknown;
}

export interface ICategoryConfig {
  aboutMe: boolean;
  address: boolean;
  city: boolean;
  education: boolean;
  educationField: boolean;
  email: boolean;
  fullName: boolean;
  portfolioImage: boolean;
  portfolioVideo: boolean;
  postalCode: boolean;
  profileImage: boolean;
  province: boolean;
}

export interface ICategoryItem {
  artistRequestsCount: number;
  config: ICategoryConfig | null;
  createdAt: string | null;
  deletedAt: string | null;
  enName: string;
  faName: string;
  id: number;
  isActive: boolean;
  updatedAt: string | null;
  priority: number | null;
  parent: number | null;
  [key: string]: unknown;
}

export enum ESupportStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

export interface ParamsSupportList {
  count: number;
  page: number;
  search: string | null;
  status__in: string[];
  categoryId__in: number[];
  province__in: number[] | null;
  createdAt__gte: Date | null;
  createdAt__lte: Date | null;
  updateAt__gte: Date | null;
  updateAt__lte: Date | null;
}

export interface ISupportItem {
  status: ESupportStatus;
  createdAt: string | null;
  deletedAt: string | null;
  email: string | null;
  firstName: string | null;
  id: number;
  isActive: boolean;
  lastName: string | null;
  message: string | null;
  phoneNumber: string | null;
  subject: string | null;
  updatedAt: string | null;
  [key: string]: unknown;
}

export interface ParamsCategoryList {
  count: number;
  page: number;
  search: string | null;
  isActive?: boolean | null;
  categoryId__in: number[];
  gender: string;
  city__in: number[];
}

interface IProvinceItem {
  id: number;
  name: string;
  slug: string;
}

export interface IUpdateCategoryRequest {
  faName: string;
  isActive: boolean;
  config: ICategoryConfig;
  priority: number | null;
}

export interface IFaqItem {
  answer: string;
  createdAt: string | null;
  deletedAt: string | null;
  id: number;
  isActive: boolean;
  question: string;
  updatedAt: string | null;
}

export interface IAdminAboutUs {
  createdAt: string | null;
  deletedAt: string | null;
  id: number;
  isActive: boolean;
  text: string;
  updatedAt: string;
}

export interface IAboutUsResponse {
  message: string | null;
  result: IAdminAboutUs[];
}

export interface IUserRetrive {
  message: string | null;
  result: IArtistItem[];
}

export interface IAdminFaqUpdateItem {
  id: number;
  question: string;
  answer: string;
}

export interface IUsersItem {
  aboutMe: string | null;
  address: string | null;
  avatar: string | null;
  birthDate: string | null;
  city: string | null;
  code: string | null;
  createdAt: string | null;
  deletedAt: string | null;
  dialect: string | null;
  education: string | null;
  email: string | null;
  firstName: string | null;
  gender: string | null;
  height: number | null;
  id: number;
  isActive: boolean;
  language: string | null;
  lastLogin: string | null;
  lastName: string | null;
  major: string | null;
  phone_number: string | null;
  postalCode: string | null;
  province: string | null;
  skinColor: string | null;
  updatedAt: string | null;
  weight: number | null;
  [key: string]: unknown;
}

export interface ParamsUsersList {
  count: number;
  page: number;
  search: string | null;
  categoryId__in: number[];
  province__in: number[] | null;
  createdAt__gte: Date | null;
  createdAt__lte: Date | null;
  updateAt__gte: Date | null;
  updateAt__lte: Date | null;
}

export interface IArtistStatusUpdateRequest {
  status: EArtistRequestStatus;
  rejected_reason?: string;
}

export type IArtistListResponse = IBasePaginateResponse<IArtistItem>;
export type IArtistRetriveResponse = IRetriveResponse<IArtistItem>;

export type ICatrgotyListResponse = IBasePaginateResponse<ICategoryItem>;
export type ICategoryRetriveResponse = IRetriveResponse<ICategoryItem>;

export type ISupportListResponse = IBasePaginateResponse<ISupportItem>;
export type ISupportRetriveResponse = IRetriveResponse<ISupportItem>;

export type IProvinceListResponse = IBasePaginateResponse<IProvinceItem>;

export type IFaqListResponse = IBasePaginateResponse<IFaqItem>;

export type IUsersListResponse = IBasePaginateResponse<IUsersItem>;
