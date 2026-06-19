import { IArtistItem } from "../admin/type";

export type UserLoginRequest = {
  phone_number: string;
  code?: string;
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

export type IUserArtistListResponse = IBaseResponse<IArtistItem>;
