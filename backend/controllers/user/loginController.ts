import { Request, Response } from 'express';
import { createToken } from '../../utils/jwt.js';
import { userRepository } from '../../models/index.js';
import { CustomRequest } from '../../types/controllers.types.js';
import { configs } from '../../config/configs.js';
import { verifyLookup } from '../../services/kavenegar.js';
import { apiResponse } from '../../utils/customResponse.js';
import redisClient from '../../config/redis.js';
import { generateOtp } from '../../utils/otp.js';
import { MinioService } from '../../services/minio.js';
import { User } from '../../entities/User.js';
import { sendMelliPatternSMS } from '../../services/melliPayamak.js';
import { rateLimitValidation } from '../../services/rateLimit.js';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await userRepository().find();
    const formattedUsers = users.map(user => ({
      id: user.id,
      phone_number: user.phone_number,
      avatar: user.avatar ? MinioService.getPresignedLinkByPath(user.avatar) : null,
      lastLogin: user.lastLogin,
    }));
    return res.json(formattedUsers);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export const getUserProfile = async (req: CustomRequest<{user : User}>, res: Response) => {
  try {
    const user = await userRepository().findOne({ where: { id: req.payload?.user.id } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const formattedUser = {
      id: user.id,
      phone_number: user.phone_number,
      avatar: await user.getAvatarUrl(),
      lastLogin: user.lastLogin,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };
    return res.json(formattedUser);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch user' });
  }
};

export const userLogin = async (req: Request, res: Response) => {
  const { phone_number, code = undefined } = req.body
  const notLimited = await rateLimitValidation(`otp-attempts-${phone_number}`, configs.otpRateLimitAttempts)
  if (!notLimited) {
    return apiResponse(res, {
      statusCode: 400,
      message: "کد ورود قبلا ارسال شده است",
      success: false
    })
  }
  if (!code) {
    const otp = generateOtp();
    const sendCode = await sendMelliPatternSMS(phone_number, '377250', `${otp}`);
    await redisClient.set(phone_number, otp, { EX: 300 })
    if (sendCode.success) {
      return apiResponse(res, {
        statusCode: 200,
        message: "کد ورود ارسال شد",
        success: true
      });
    } else {
      return apiResponse(res, {
        statusCode: 500,
        message: "خطا در ارسال کد ورود",
        success: false
      });
    }
  } else {
    const storedCode = await redisClient.get(phone_number);
    if (storedCode !== code) {
      return apiResponse(res, {
        statusCode: 400,
        message: "کد ورود اشتباه است",
        success: false
      });
    }
    let user = await userRepository().findOneBy({ phone_number });
    if (!user) {
      user = await userRepository().save({ phone_number });
    }
    const accessToken = createToken({ id: user.id, phone_number: user.phone_number }, configs.jwtExpireTime, "user")
    await userRepository().update({ id: user.id }, { lastLogin: new Date() })
    return apiResponse(res, {
      statusCode: 200,
      message: "ورود موفقیت آمیز بود",
      success: true,
      data: {
        type: "user",
        id: user.id,
        phone_number: user.phone_number,
        accessToken
      }
    });
  }
}

export const userProfileUpdateController = async (req: CustomRequest<{user:User}>, res: Response) => {
  const { firstName, lastName, email } = req.body;
  const user = await userRepository().findOne({
    where: { phone_number: req.payload?.user.phone_number }
  })

  if (!user) {
    return apiResponse(res, {
      message: 'no User Found!',
      statusCode: 400 
    })
  }

  if (firstName) {
    user.firstName = firstName
  }
  if (lastName) {
    user.lastName = lastName
  }
  if (email) {
    user.email = email
  }

  const data = userRepository().save(user)
  return apiResponse(res, {
    data
  })
}

export default {
  getUsers,
  getUserProfile,
  userLogin,
};

