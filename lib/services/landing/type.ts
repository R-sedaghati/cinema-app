import {
  IArtistItem,
  IFormField,
  IBasePaginateResponse,
  ESmsEvent,
  IFormSchema,
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
  nationalCode: string;
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
  nationalCode: string | null;
  phone_number: string | null;
  /** End of the paid registration year (ISO). Null = never paid; past = expired. */
  subscriptionExpiresAt: string | null;
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

export type IFormSchemaResponse = IRetriveResponse<IFormSchema>;

/**
 * Filters are derived per category from its form schema, so the client never hardcodes
 * field names — `param` / `paramMin` / `paramMax` are the exact query keys to send to
 * `GET /artists-requests`.
 */
export interface IArtistFilterOption {
  label: string;
  value: string;
  count: number;
}

export type IArtistFilterDescriptor =
  | {
      key: string;
      label: string;
      kind: "select";
      param: string;
      options: IArtistFilterOption[];
    }
  | {
      key: string;
      label: string;
      kind: "range";
      paramMin: string;
      paramMax: string;
      min: number;
      max: number;
    };

export type IArtistFiltersResponse = IRetriveResponse<IArtistFilterDescriptor[]>;

/**
 * Public artist search params. Dynamic `answers.*` keys come from filter descriptors,
 * hence the index signature.
 */
export type ParamsPublicArtistList = {
  page?: number;
  count?: number;
  search?: string;
  category__in?: number[];
} & Record<string, string | number | string[] | number[] | undefined>;

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
  | "REJECTED"
  | "NEED_TO_REVISION";

export type PortfolioType = "IMAGE" | "VIDEO";

export type UserCreateArtistRequest = {
  categoryIds: number[];
  answers: Record<string, unknown>;
  portfolios?: { path: string; type: PortfolioType; fieldKey?: string }[];
};

export type ArtistRequestResult = {
  artistRequestId: number;
  status: ArtistRequestStatus;
  portfolios: { id: number; filePath: string; type: PortfolioType; fieldKey: string | null }[];
};

/** Contact details are paid content — served only after a COMPLETED contact request. */
export interface IArtistContact {
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  email: string | null;
  address: string | null;
  postalCode: string | null;
  /** Every answer the admin marked private; file fields carry their URLs. */
  fields: (Pick<IFormField, "key" | "label" | "type" | "options"> & { value: unknown })[];
}

export type IArtistContactResponse = IRetriveResponse<IArtistContact>;

/** A resume request, reviewed by an admin. */
export type ContactRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface IContactRequestItem {
  id: number;
  trackingCode: string;
  status: ContactRequestStatus;
  createdAt: string | null;
  reviewedAt: string | null;
  artist: {
    id: number;
    code: string | null;
    avatar: string | null;
    categories: { id: number; faName: string }[];
  };
  // The ui-kit Table constrains rows to an indexable record.
  [key: string]: unknown;
}

export type IContactRequestListResponse = IBasePaginateResponse<IContactRequestItem>;

export type ICreateContactRequestResponse = IRetriveResponse<{
  id: number;
  trackingCode: string;
  status: ContactRequestStatus;
}>;

/** Guest create also returns the secret the browser must keep to reach the contact data. */
export type ICreateGuestContactRequestResponse = IRetriveResponse<{
  id: number;
  trackingCode: string;
  status: ContactRequestStatus;
  accessToken: string;
}>;

export type IGuestContactRequestStatusResponse = IRetriveResponse<
  { token: string; trackingCode: string; status: ContactRequestStatus; createdAt: string; artistId: number }[]
>;

export type WalletTransactionType =
  | "REFUND_REJECTED"
  | "REFUND_REVISION"
  | "REFUND_FAILED_PAYMENT"
  | "ADMIN_ADJUST"
  | "SPEND_REGISTRATION"
  | "SPEND_CONTACT";

export interface IWalletTransactionItem {
  id: number;
  /** Toman, signed: positive credits the user, negative debits them. */
  amount: number;
  type: WalletTransactionType;
  /** Persian label for `type`, resolved server-side. */
  typeLabel: string;
  description: string | null;
  /** The artist profile this row was for; null when it has none (e.g. manual adjustments). */
  artist: { id: number; code: string | null; name: string | null } | null;
  createdAt: string | null;
  [key: string]: unknown;
}

export type IWalletBalanceResponse = IRetriveResponse<{ balance: number }>;
export type IWalletTransactionListResponse =
  IBasePaginateResponse<IWalletTransactionItem>;

/**
 * `GET /user/purchase/` returns the gateway URL as JSON — a bare browser navigation
 * cannot carry the Authorization header the endpoint requires.
 * Null when there was nothing to pay (free category or already settled from the wallet).
 */
export type IPurchaseResponse = IRetriveResponse<{ redirectUrl: string | null }>;

/**
 * One message the system sent this user — an automated pipeline SMS or an admin's
 * note with `channel: SMS`. `body` arrives already rendered.
 */
export interface IUserMessage {
  id: number;
  body: string;
  /** null when an admin typed the message rather than a template firing. */
  event: ESmsEvent | null;
  artistRequestId: number | null;
  readAt: string | null;
  createdAt: string;
}

export type IUserMessageListResponse = IBasePaginateResponse<IUserMessage>;

export type IUserBadgeCountsResponse = IRetriveResponse<{
  messages: number;
  forms: number;
}>;
