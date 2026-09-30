import type { ISectionConfig } from "@/lib/utils/resolveSections";
import type { IPageBackground } from "@/lib/utils/pageBackground";
import type { IPageLayout } from "@/lib/utils/pageLayout";
import type { ITableColors } from "@/lib/utils/tableColors";
import type { IUploadLimits } from "@/lib/utils/prepareUpload";

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
  crmStage__in: ECrmStage[];
  assignedAdminId: number | null;
  followUpAt__lte: string | null;
  sort: string | null;
  order: "ASC" | "DESC" | null;
  /** true lists only the hidden (soft-deleted) requests — the admin's trash bin. */
  hidden: boolean | null;
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

/**
 * CRM pipeline stage. Independent of EArtistRequestStatus: that one drives payment and
 * publication, this one only tracks how far an admin has got with the applicant.
 */
export enum ECrmStage {
  NEW = "NEW",
  CONTACTED = "CONTACTED",
  AWAITING_DOCS = "AWAITING_DOCS",
  NEGOTIATING = "NEGOTIATING",
  WON = "WON",
  LOST = "LOST",
}

export const CrmStageLabel: Record<ECrmStage, string> = {
  [ECrmStage.NEW]: "جدید",
  [ECrmStage.CONTACTED]: "تماس گرفته شده",
  [ECrmStage.AWAITING_DOCS]: "در انتظار مدارک",
  [ECrmStage.NEGOTIATING]: "در حال مذاکره",
  [ECrmStage.WON]: "موفق",
  [ECrmStage.LOST]: "ناموفق",
};

export enum ECrmNoteChannel {
  INTERNAL = "INTERNAL",
  SMS = "SMS",
}

export interface IAdminListItem {
  id: number;
  username: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
}

export interface ICrmNote {
  id: number;
  body: string;
  channel: ECrmNoteChannel;
  /** null for internal notes; false when the SMS provider rejected the send. */
  smsDelivered: boolean | null;
  admin: IAdminListItem | null;
  createdAt: string;
}

/** What `PATCH /admin/artist-requests/:id/crm/` echoes back. */
export interface IArtistCrmFields {
  id: number;
  crmStage: ECrmStage;
  followUpAt: string | null;
  assignedAdmin: IAdminListItem | null;
}

export interface ICrmUpdateRequest {
  crmStage?: ECrmStage;
  assignedAdminId?: number | null;
  followUpAt?: string | null;
}

export interface ICrmNoteCreateRequest {
  body: string;
  channel: ECrmNoteChannel;
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
  nationalCode?: string | null;
  /** Values of admin-added profile fields, keyed by IProfileField.key. */
  profileData?: Record<string, unknown>;
  code: string;
}

/** Keys are IProfileField keys: builtin column names or custom profile keys. */
export type IAdminUserUpdateRequest = Record<string, unknown>;

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
  crmStage: ECrmStage;
  followUpAt: string | null;
  assignedAdmin: IAdminListItem | null;
  hiddenAt: string | null;
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

/**
 * An IProfileField key (builtin column or custom profile key), or the read-only
 * "phoneNumber" — prefilled into the form from the account, never written back.
 */
export type SyncToUserField = string;

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
  /** Paid content: hidden publicly, served only after a contact purchase. */
  isPrivate?: boolean;
}

/**
 * An admin-managed account profile field. `builtin` rows are backed by a `users` column
 * (key = column); custom rows live in the user's `profileData`.
 */
export interface IProfileField extends Omit<IFormField, "syncToUserField" | "isPrivate"> {
  builtin: boolean;
  /** Left out of the user's profile and its required checks; admins still see it. */
  hidden: boolean;
}

export type IProfileFieldRequest = Partial<
  Pick<
    IProfileField,
    "key" | "label" | "type" | "placeholder" | "helpText" | "required" | "options" | "validation" | "multiple" | "hidden"
  >
>;

export interface IFormStep {
  id: number;
  title: string;
  description?: string | null;
  order: number;
  icon: string | null;
  fields: IFormField[];
}

export interface IFormSchema {
  steps: IFormStep[];
  /** Yearly subscription price in Toman for this caller, resolved server-side. 0 = subscribed (submit directly). */
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
  /** `null` clears an existing link; `undefined` leaves it untouched. */
  syncToUserField?: SyncToUserField | null;
  multiple?: boolean;
  /** Paid content: hidden publicly, served only after a contact purchase. */
  isPrivate?: boolean;
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
  [key: string]: unknown;
}

export enum ESupportStatus {
  OPEN = "OPEN",
  ANSWERED = "ANSWERED",
  CLOSED = "CLOSED",
}

/** A reply on a support ticket. `admin` null = the ticket's user wrote it. */
export interface ISupportMessage {
  id: number;
  body: string;
  createdAt: string;
  admin: { id: number; firstName: string | null; lastName: string | null } | null;
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
  /** Only on the detail endpoints. */
  messages?: ISupportMessage[];
  userId?: number | null;
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
  faName?: string;
  enName?: string;
  isActive?: boolean;
  description?: string;
  priority?: number | null;
  /** null promotes to a main category. */
  parentId?: number | null;
  image?: string | null;
}

/** One whole sibling list's new order: `priority` becomes each id's 1-based position. */
export interface IReorderCategoriesRequest {
  /** null reorders the main categories; an id reorders that parent's subcategories. */
  parentId: number | null;
  ids: number[];
}

export interface ICreateCategoryRequest {
  faName: string;
  enName: string;
  parentId?: number | null;
  description?: string;
  priority?: number | null;
  isActive?: boolean;
  image?: string | null;
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
  color?: string | null;
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

export interface IUserDetailResponse {
  message: string | null;
  result: IArtistUser;
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
  titleColor?: string | null;
  subtitleColor?: string | null;
  ctaLabelColor?: string | null;
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
  titleColor: string | null;
  subtitleColor: string | null;
  ctaLabelColor: string | null;
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
  /** Resume-request form only: remembered in a guest's browser for the next request. */
  persist?: boolean;
}

export interface ISiteContentContactForm {
  title: string;
  submitLabel: string;
  fields: IContactFormField[];
  /** Resume-request form only: visitors may request without logging in (no OTP). */
  guestMode?: boolean;
}

export interface ISiteContentFooter {
  phone: string;
  instagramUrl: string;
  copyright: string;
  /** Enamad trust seal; rendered only when both are set. */
  enamadId?: string;
  enamadCode?: string;
}

export interface ISiteContent {
  id: number;
  benefits: {
    items: ISiteContentBenefitItem[];
    fontSize?: number | null;
    color?: string | null;
  };
  support: {
    title: string;
    description: string;
    items: ISiteContentSupportItem[];
    fontSize?: number | null;
    color?: string | null;
  };
  terms: {
    title: string;
    content: string;
    fontSize?: number | null;
    color?: string | null;
  };
  footer?: ISiteContentFooter | null;
  /** Overrides for the public-site copy, keyed by `lib/constants/landingCopy.ts`. */
  landing?: Record<string, string> | null;
  /** Overrides for the registration-form copy, keyed by `lib/constants/formCopy.ts`. */
  form?: Record<string, string> | null;
  /** Field definition of the support contact form (see `lib/constants/contactForm.ts`). */
  contactForm?: ISiteContentContactForm | null;
  /** Form a viewer fills to request an artist's resume (see `lib/constants/resumeRequestForm.ts`). */
  resumeRequestForm?: ISiteContentContactForm | null;
  /**
   * Home-page section order and visibility, keyed by `lib/constants/homeSections.ts`.
   * Empty/absent means "use the shipped catalog order" — see
   * `lib/utils/resolveHomeSections.ts`.
   */
  homeSections?: ISectionConfig[] | null;
  /**
   * Artist-registration page section order and visibility, keyed by
   * `lib/constants/registrationSections.ts`. Empty/absent means "use the
   * shipped catalog order" — see `lib/utils/resolveRegistrationSections.ts`.
   */
  registrationSections?: ISectionConfig[] | null;
  /**
   * Per-page backgrounds, keyed by `lib/constants/pageBackgrounds.ts`; `default`
   * covers pages without their own entry. Empty/absent = the stock gradient.
   */
  pageBackgrounds?: Record<string, IPageBackground> | null;
  /**
   * Per-page width/padding, same keys as `pageBackgrounds`; `default` is the base
   * each page merges over. See `lib/utils/pageLayout.ts`.
   */
  pageLayouts?: Record<string, IPageLayout> | null;
  /** Site-wide table colors, `#rrggbb` each; absent = theme default. */
  tableColors?: ITableColors | null;
  /** Per-file upload caps in MB; the API always returns both, defaults filled in. */
  uploadLimits?: IUploadLimits | null;
  /** Public URLs on read, storage paths on write; absent = shipped logo/favicon. */
  branding?: { logo?: string; favicon?: string } | null;
}

export type ISiteContentResponse = IRetriveResponse<ISiteContent>;

/**
 * SEP gateway credentials. `terminalId` always arrives masked — the real terminal never
 * leaves the server — so sending the mask back on save means "leave it unchanged".
 */
export interface ISepEndpoints {
  tokenUrl: string;
  verifyUrl: string;
  paymentUrl: string;
}

export interface IPaymentSetting extends ISepEndpoints {
  terminalId: string | null;
  hasTerminalId: boolean;
  /** The shipped endpoints, so the page can show which ones are overridden. */
  defaults: ISepEndpoints;
  /** True while the gateway is still running off the server's env var. */
  usingEnvFallback: boolean;
  /** Yearly subscription price in Toman; null = `defaultSubscriptionPrice` applies. */
  subscriptionPrice: number | null;
  defaultSubscriptionPrice: number;
}

export type IPaymentSettingResponse = IRetriveResponse<IPaymentSetting>;

/** An endpoint sent as `""` clears the override and falls back to the shipped default. */
export interface IUpdatePaymentSettingRequest extends Partial<ISepEndpoints> {
  terminalId?: string;
  /** null clears it back to the default; 0 makes the subscription free. */
  subscriptionPrice?: number | null;
}

export type IPaymentSettingTestResponse = IRetriveResponse<{
  ok: boolean;
  message: string;
}>;

/** `warning` = the bank refused one buyer; says nothing about the gateway itself. */
export type GatewayLogLevel = "ok" | "warning" | "error";

export interface IGatewayLogItem {
  id: number;
  action: "check" | "token" | "verify" | "reverse";
  level: GatewayLogLevel;
  /** Plain Persian, written for a non-technical admin. */
  message: string;
  /** Raw error text, for whoever debugs it. */
  detail: string | null;
  createdAt: string;
  /** The ui-kit Table constrains its row type to an index-signature record. */
  [key: string]: unknown;
}

export interface IGatewayLogResponse {
  count: number;
  next: string | null;
  previous: string | null;
  result: {
    status: GatewayLogLevel | "unknown";
    statusMessage: string | null;
    checkedAt: string | null;
    lastOkAt: string | null;
    items: IGatewayLogItem[];
  };
}

export type SmsLogLevel = "ok" | "error";

export interface ISmsLogItem {
  id: number;
  /** `send` plain text, `pattern` OTP login (code never stored), `check` hourly operator check. */
  action: "send" | "pattern" | "check";
  level: SmsLogLevel;
  receptor: string | null;
  message: string;
  detail: string | null;
  createdAt: string;
  [key: string]: unknown;
}

export interface ISmsLogResponse {
  count: number;
  next: string | null;
  previous: string | null;
  result: {
    status: SmsLogLevel | "unknown";
    statusMessage: string | null;
    checkedAt: string | null;
    lastOkAt: string | null;
    sentToday: number;
    failedToday: number;
    items: ISmsLogItem[];
  };
}

/** Events that fan out an SMS to the admin numbers below. */
export type NotificationEvent = "REGISTRATION" | "TRANSACTION" | "SUPPORT_TICKET" | "RESUME_REQUEST";

export interface INotificationSetting {
  phones: string[];
  events: NotificationEvent[];
}

export type INotificationSettingResponse = IRetriveResponse<INotificationSetting>;

export interface IAdminNotification {
  id: number;
  event: NotificationEvent;
  message: string;
  link: string | null;
  readAt: string | null;
  createdAt: string;
}

export type IAdminNotificationListResponse = IRetriveResponse<{
  unread: number;
  items: IAdminNotification[];
}>;

export type IAdminBadgeCountsResponse = IRetriveResponse<{
  supports: number;
  contactRequests: number;
  registrations: number;
  notifications: number;
}>;

export interface IUpdateNotificationSettingRequest {
  phones?: string[];
  events?: NotificationEvent[];
}

/** Resume-request review state (the admin "transactions" page lists resume requests). */
export type ITransactionStatus = "PENDING" | "APPROVED" | "REJECTED";

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
  createdAt: string | null;
  reviewedAt: string | null;
  requesterName: string;
  /** No-OTP request: `buyer.phoneNumber` is what the guest typed, unverified. */
  isGuest: boolean;
  buyer: { id: number | null; phoneNumber: string | null };
  artist: {
    id: number | null;
    code: string | null;
    name: string | null;
    categories: { id: number; faName: string }[];
  };
  [key: string]: unknown;
}

/** One resume request as the admin review page shows it. */
export interface ITransactionDetail {
  id: number;
  trackingCode: string;
  status: ITransactionStatus;
  createdAt: string | null;
  reviewedAt: string | null;
  requesterName: string;
  /** Requested without an account (no-OTP mode); `requester` holds only the typed phone. */
  isGuest: boolean;
  /** The requester's form answers, labelled by the current form. */
  answers: (Pick<IFormField, "key" | "label" | "type" | "options"> & { value: unknown })[];
  requester: {
    id: number | null;
    code: string | null;
    firstName: string | null;
    lastName: string | null;
    phoneNumber: string | null;
    email: string | null;
    avatar: string | null;
    createdAt: string | null;
  };
  artist: {
    id: number | null;
    code: string | null;
    name: string | null;
    phoneNumber: string | null;
    email: string | null;
    avatar: string | null;
    categories: { id: number; faName: string }[];
    /** What an approval unlocks for the requester. */
    privateFields: (Pick<IFormField, "key" | "label" | "type" | "options"> & { value: unknown })[];
  };
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
  /** The artist profile this row was for; null when it has none (e.g. manual adjustments). */
  artist: { id: number; code: string | null; name: string | null } | null;
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

// --- SMS templates -----------------------------------------------------------

/**
 * Pipeline events that can fire an automated SMS. Closed set: the backend owns the
 * trigger points, the admin owns only each row's text and on/off switch.
 */
export enum ESmsEvent {
  FORM_SUBMITTED = "FORM_SUBMITTED",
  NEED_REVISION = "NEED_REVISION",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  PAYMENT_SUCCESS = "PAYMENT_SUCCESS",
  PAYMENT_FAILED = "PAYMENT_FAILED",
  SUPPORT_REPLY = "SUPPORT_REPLY",
  RESUME_REQUEST_APPROVED = "RESUME_REQUEST_APPROVED",
}

export interface ISmsTemplate {
  event: ESmsEvent;
  body: string;
  isActive: boolean;
  /** Placeholders the renderer substitutes for this event — served per event, never assumed. */
  variables: string[];
  updatedAt: string;
  updatedBy: IAdminListItem | null;
  /** The ui-kit Table constrains its row type to an index-signature record. */
  [key: string]: unknown;
}

export interface ISmsTemplateUpdateRequest {
  body?: string;
  isActive?: boolean;
}

export interface ISmsTemplateTestRequest {
  /** The unsaved draft to test; omitted tests the stored body. */
  body?: string;
}

export type ISmsTemplateTestResponse = IRetriveResponse<{
  ok: boolean;
  /** How many admin numbers were actually texted. */
  sentTo: number;
  message: string;
}>;

export interface IAdminProfile {
  id: number;
  username: string;
  email: string;
  role: string;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null; // public URL on read
}
export type IAdminProfileResponse = IRetriveResponse<IAdminProfile>;
export interface IUpdateAdminProfileRequest {
  firstName?: string;
  lastName?: string;
  avatar?: string | null; // storage path from POST /admin/upload/image; null clears
}

export type IAdminPaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "CANCELED";

/** One registration purchase. `amount` went through the gateway, `walletAmount` came from the wallet. */
export interface IAdminPayment {
  id: number;
  amount: number;
  walletAmount: number;
  gateway: "saman" | "wallet" | "free" | string;
  /** SEP's receipt number; set once the gateway leg settled. */
  refNum: string | null;
  status: IAdminPaymentStatus;
  artist: { id: number; code: string | null; name: string | null } | null;
  phone: string | null;
  createdAt: string;
  /** The ui-kit Table constrains its row type to an index-signature record. */
  [key: string]: unknown;
}
