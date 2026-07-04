import { ArtistRequest } from "../entities/ArtistRequest.js";
import { UpdateArtistRequestDTO } from "../utils/dto.js";
import { artistRequestRejectedReasonRepository, artistRequestRepository, categoryRepository } from "../models/index.js";
import { AppDataSource } from "../config/database.js";
import { sendMelliPatternSMS } from "../services/melliPayamak.js";
import { artistChangeStatus, rejectedReasonMessage } from "../utils/messages.js";
import { ArtistRequestStatus, ArtistRequestStatusFa } from "../utils/enum.js";
import { configs } from "../config/configs.js";
import { User } from "../entities/User.js";

type UserField = keyof ReturnType<typeof buildUser>;

const buildUser = (ar: ArtistRequest, avatarMap: Record<string, string>) => ({
  id: ar.user.id,
  firstName: ar.user.firstName,
  lastName: ar.user.lastName,
  avatar: ar.user.avatar ? avatarMap[ar.user.avatar] : null,
  city: ar.user.city,
  phoneNumber: ar.user.phone_number,
  email: ar.user.email,
  height: ar.user.height,
  weight: ar.user.weight,
  language: ar.user.language,
  dialect: ar.user.dialect,
  province: ar.user.province,
  address: ar.user.address,
  postalCode: ar.user.postalCode,
  education: ar.user.education,
  major: ar.user.major,
  aboutMe: ar.user.aboutMe,
  gender: ar.user.gender,
  skinColor: ar.user.skinColor,
  code: ar.user.code,
});

export const artistRequestSerializer = (
  artistRequests: ArtistRequest[],
  avatarMap: Record<string, string>,
  portfoliosMap?: Record<string, string>,
  excludeUserFields?: UserField[],
  adminView = false
) =>
  artistRequests.map(ar => {
    const user = buildUser(ar, avatarMap);

    if (excludeUserFields?.length) {
      excludeUserFields.forEach(field => delete user[field]);
    }

    let result: Record<string, any> = {
      id: ar.id,
      status: ar.status,
      createdAt: ar.createdAt,
      updatedAt: ar.updatedAt,
      trackingCode: ar.trackingCode,

      categories: (ar.categories ?? []).map(c => ({
        id: c.id,
        faName: c.faName,
        enName: c.enName,
      })),
    
      user,
    
      portfolios: (ar.portfolios ?? []).map(portfolio => ({
        id: portfolio.id,
        type: portfolio.type,
        filePath: portfolio.filePath,
        url: portfoliosMap?.[portfolio.filePath] ?? null,
      })),
    };

    if (adminView) {
      result.rejectedReasons = (ar.rejectedReasons ?? []).map(r => ({
        id: r.id,
        reason: r.reason,
        createdAt: r.createdAt,
      }));
    }

    return result
  });

export const updateArtistRequestSerializer = async (
  id: number,
  data: UpdateArtistRequestDTO
) => {
    return await AppDataSource.transaction(async (manager) => {
      const artistRequestRepo = manager.getRepository(ArtistRequest);

      const request = await artistRequestRepo.findOne({
        where: { id },
        relations: ["categories", 'user'],
      });

      if (!request) {
        throw new Error("ArtistRequest not found");
      }

      if (data.status) {
        if (data.status !== request.status) {
          let message = `${ArtistRequestStatusFa[request.status]},${ArtistRequestStatusFa[data.status]}`
          let pattern = '480171'
          if (
            (data.status === ArtistRequestStatus.REJECTED) ||
            (data.status === ArtistRequestStatus.NEED_TO_REVISION)) 
          {
            const rejectedReasonRepo = artistRequestRejectedReasonRepository().create({
              artistRequest: request,
              reason: data.rejectedReason ?? ''
            })
            await manager.save(rejectedReasonRepo);
            message += `,${data.rejectedReason ?? ''}`;
            pattern = '480169'
          }
          console.log(message)
          const t = await sendMelliPatternSMS(
            request.user.phone_number,
            pattern,
            message
          )
          console.log(t)
          request.status = data.status;
        }
        
      }

      return await artistRequestRepo.save(request);
    })
};