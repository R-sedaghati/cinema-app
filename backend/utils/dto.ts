import { ArtistRequestStatus } from "./enum.js";

export interface UpdateArtistRequestDTO {
  status?: ArtistRequestStatus;
  rejectedReason?: string;
}