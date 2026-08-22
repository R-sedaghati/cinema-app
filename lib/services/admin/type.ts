
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
  fieldKey: string | null;
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
  avatar: string | null;
  email: string | null;
  firstName: string | null;
  id: number;
  lastName: string | null;
  phoneNumber: string | null;
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
  answers: Record<string, unknown>;
  [key: string]: unknown;
}

export enum EFormFieldType {
  TEXT = "TEXT",
  TEXTAREA = "TEXTAREA",
  NUMBER = "NUMBER",
  SELECT = "SELECT",
  SELECT_PROVINCE = "SELECT_PROVINCE",
  SELECT_CITY = "SELECT_CITY",
  RADIO = "RADIO",
  CHECKBOX = "CHECKBOX",
  BOOLEAN = "BOOLEAN",
  DATE = "DATE",
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
}

export type SyncToUserField = "firstName" | "lastName" | "avatar" | "email";

export interface IFormFieldOption {
  label: string;
  value: string;
}

import type { FieldValidationPreset } from "@/lib/utils/fieldValidationPresets";

export interface IFormFieldValidation {
  preset?: FieldValidationPreset;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}

export interface IFormField {
  id: number;
  key: string;
  label: string;
  type: EFormFieldType;
  placeholder: string | null;
  helpText?: string | null;
  required: boolean;
  order: number;
  options: IFormFieldOption[] | null;
  validation: IFormFieldValidation | null;
  syncToUserField?: SyncToUserField | null;
  multiple?: boolean;
}

export interface IFormStep {
  id: number;
  title: string;
  description?: string | null;
  order: number;
  icon: string | null;
  fields: IFormField[];
}

/**
 * Admin-editable copy of a category's registration form: the post-payment
 * result pages plus the per-key overrides for the fixed flow copy (see
 * `lib/constants/formCopy.ts`).
 */
export interface IFormResultPages {
  successTitle: string | null;
  successDescription: string | null;
  failTitle: string | null;
  failDescription: string | null;
  formCopy?: Record<string, string> | null;
}

export interface IFormSchema extends IFormResultPages {
  steps: IFormStep[];
  /** Registration fee in Toman, already resolved server-side. 0 means free. */
  registrationAmount: number;
}

export interface ICreateFormStepRequest {
  title: string;
  description?: string | null;
  order?: number;
  icon?: string;
}

export interface IUpdateFormStepRequest {
  title?: string;
  description?: string | null;
  order?: number;
  icon?: string;
}

export interface ICreateFormFieldRequest {
  key: string;
  label: string;
  type: EFormFieldType;
  placeholder?: string;
  helpText?: string | null;
  required?: boolean;
  order?: number;
  options?: IFormFieldOption[];
  validation?: IFormFieldValidation;
  syncToUserField?: SyncToUserField;
  multiple?: boolean;
}

export type IUpdateFormFieldRequest = Partial<ICreateFormFieldRequest> & {
  stepId?: number;
};

export type IFormSchemaRetrieveResponse = IRetriveResponse<IFormSchema>;
export type IFormStepRetrieveResponse = IRetriveResponse<IFormStep>;
export type IFormFieldRetrieveResponse = IRetriveResponse<IFormField>;

export interface ICategoryItem {
  artistRequestsCount: number;
  createdAt: string | null;
  deletedAt: string | null;
  description: string | null;
  enName: string;
  faName: string;
  id: number;
  image: string | null;
  isActive: boolean;
  updatedAt: string | null;
  priority: number | null;
  parent: number | null;
  /** Price in Toman a viewer pays to unlock contact details in this category. 0 means free. */
  contactAmount: number | null;
  /** One-off fee in Toman an artist pays to register in this category. 0 means free. */
  registrationAmount: number | null;
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
  description: string;
  priority: number | null;
  image?: string | null;
  /** Price in Toman a viewer pays to unlock contact details in this category. 0 means free. */
  contactAmount?: number | null;
  /** One-off fee in Toman an artist pays to register in this category. 0 means free. */
  registrationAmount?: number | null;
}

export interface ICreateCategoryRequest {
  faName: string;
  enName: string;
  parentId?: number | null;
  description?: string;
  priority?: number | null;
  isActive?: boolean;
  image?: string | null;
  contactAmount?: number | null;
  registrationAmount?: number | null;
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
  fontSize: number | null;
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

export interface IBannerItem {
  createdAt: string | null;
  ctaLabel: string;
  ctaLink: string;
  deletedAt: string | null;
  id: number;
  image: string;
  isActive: boolean;
  priority: number;
  subtitle: string;
  titleFontSize: number | null;
  subtitleFontSize: number | null;
  ctaLabelFontSize: number | null;
  title: string;
  updatedAt: string | null;
  [key: string]: unknown;
}

export interface IBannerUpsertRequest {
  title: string;
  subtitle: string;
  image: string;
  ctaLabel: string;
  ctaLink: string;
  priority: number;
  isActive: boolean;
  titleFontSize: number | null;
  subtitleFontSize: number | null;
  ctaLabelFontSize: number | null;
}

export interface ParamsBannerList {
  count: number;
  page: number;
  search: string | null;
  isActive?: boolean | null;
}

export type IBannerListResponse = IBasePaginateResponse<IBannerItem>;
export type IBannerRetrieveResponse = IRetriveResponse<IBannerItem>;

export interface ITutorialItem {
  createdAt: string | null;
  content: string;
  deletedAt: string | null;
  id: number;
  thumbnail: string | null;
  isActive: boolean;
  isMain: boolean;
  priority: number;
  title: string;
  videoUrl: string;
  updatedAt: string | null;
  [key: string]: unknown;
}

export interface ITutorialUpsertRequest {
  title: string;
  content: string;
  videoUrl: string;
  thumbnail?: string | null;
  priority: number;
  isActive: boolean;
  isMain: boolean;
}

export interface ParamsTutorialList {
  count: number;
  page: number;
  search: string | null;
  isActive?: boolean | null;
}

export type ITutorialListResponse = IBasePaginateResponse<ITutorialItem>;
export type ITutorialRetrieveResponse = IRetriveResponse<ITutorialItem>;

export interface ISiteContentBenefitItem {
  title: string;
  desc: string;
}

export interface ISiteContentSupportItem {
  title: string;
  detail: string;
  footerText: string;
  buttonValue: string;
}

/** One field of the admin-editable support contact form. */
export interface IContactFormField {
  key: string;
  label: string;
  type: EFormFieldType;
  placeholder?: string | null;
  helpText?: string | null;
  required: boolean;
  options?: IFormFieldOption[] | null;
  validation?: IFormFieldValidation | null;
}

export interface ISiteContentContactForm {
  title: string;
  submitLabel: string;
  fields: IContactFormField[];
}

export interface ISiteContentFooter {
  phone: string;
  instagramUrl: string;
  copyright: string;
}

export interface ISiteContent {
  id: number;
  benefits: {
    items: ISiteContentBenefitItem[];
    fontSize?: number | null;
  };
  support: {
    title: string;
    description: string;
    items: ISiteContentSupportItem[];
    fontSize?: number | null;
  };
  terms: {
    title: string;
    content: string;
    fontSize?: number | null;
  };
  footer?: ISiteContentFooter | null;
  /** Overrides for the public-site copy, keyed by `lib/constants/landingCopy.ts`. */
  landing?: Record<string, string> | null;
  /** Field definition of the support contact form (see `lib/constants/contactForm.ts`). */
  contactForm?: ISiteContentContactForm | null;
}

export type ISiteContentResponse = IRetriveResponse<ISiteContent>;

/**
 * Gateway credentials. `merchantId` always arrives masked — the real key never leaves
 * the server — so sending the mask back on save means "leave it unchanged".
 */
export interface IPaymentSetting {
  merchantId: string | null;
  hasMerchantId: boolean;
  sandbox: boolean;
  /** True while the gateway is still running off the server's env var. */
  usingEnvFallback: boolean;
}

export type IPaymentSettingResponse = IRetriveResponse<IPaymentSetting>;

export interface IUpdatePaymentSettingRequest {
  merchantId?: string;
  sandbox?: boolean;
}

/** Events that fan out an SMS to the admin numbers below. */
export type NotificationEvent = "REGISTRATION" | "TRANSACTION" | "SUPPORT_TICKET";

export interface INotificationSetting {
  phones: string[];
  events: NotificationEvent[];
}

export type INotificationSettingResponse = IRetriveResponse<INotificationSetting>;

export interface IUpdateNotificationSettingRequest {
  phones?: string[];
  events?: NotificationEvent[];
}

export type ITransactionStatus = "PENDING" | "COMPLETED" | "FAILED" | "CANCELED";

export interface ParamsTransactionList {
  count: number;
  page: number;
  search: string | null;
  status: ITransactionStatus | null;
}

export interface ITransactionItem {
  id: number;
  trackingCode: string;
  status: ITransactionStatus;
  amount: number;
  paymentGateway: string;
  createdAt: string | null;
  requesterName: string;
  buyer: { id: number | null; phoneNumber: string | null };
  artist: {
    id: number | null;
    code: string | null;
    categories: { id: number; faName: string }[];
  };
  [key: string]: unknown;
}

export type IWalletTransactionType =
  | "REFUND_REJECTED"
  | "REFUND_REVISION"
  | "REFUND_FAILED_PAYMENT"
  | "ADMIN_ADJUST"
  | "SPEND_REGISTRATION"
  | "SPEND_CONTACT";

export interface IAdminWalletTransaction {
  id: number;
  /** Toman, signed: positive credits the user, negative debits them. */
  amount: number;
  type: IWalletTransactionType;
  typeLabel: string;
  description: string | null;
  /** Set only for manual adjustments. */
  adminUsername: string | null;
  createdAt: string | null;
}

export type IAdminWalletResponse = IRetriveResponse<{
  balance: number;
  transactions: IAdminWalletTransaction[];
}>;

export interface IAdjustWalletRequest {
  /** Signed: positive adds balance, negative removes it. Never zero. */
  amount: number;
  description: string;
}
