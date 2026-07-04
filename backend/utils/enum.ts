export enum AdminRole {
    SUPER_ADMIN = 'SUPER_ADMIN',
    ADMIN = 'ADMIN',
}

export enum Gender {
    MAN = "MAN",
    WOMAN = "WOMAN"
}

export enum PortfolioType {
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
}

export enum ArtistRequestStatus {
  PENDING = "PENDING",
  PENDING_PAYMENT = "PENDING_PAYMENT",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  NEED_TO_REVISION = "NEED_TO_REVISION"
}

export enum PaymentStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  CANCELED = "CANCELED",
}

export const ArtistRequestStatusFa: Record<ArtistRequestStatus, string> = {
  [ArtistRequestStatus.PENDING]: "در حال بررسی",
  [ArtistRequestStatus.PENDING_PAYMENT]: "در انتظار پرداخت",
  [ArtistRequestStatus.APPROVED]: "تایید شده",
  [ArtistRequestStatus.REJECTED]: "رد شده",
  [ArtistRequestStatus.NEED_TO_REVISION]: "نیاز به اصلاح"
};


export enum SupportStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED"
}

export enum SkinColor {
  FAIR = 'FAIR',
  WHEAT = 'WHEAT',
  OLIVE = 'OLIVE',
  DARKOLIVE = 'DARKOLIVE'
}

export const SkinColorFa: Record<SkinColor, string> = {
  [SkinColor.FAIR]: 'سفید',
  [SkinColor.WHEAT]: 'گندمی',
  [SkinColor.OLIVE]: 'سبزه',
  [SkinColor.DARKOLIVE]: 'سبزه تیره'
}