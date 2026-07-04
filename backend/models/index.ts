import { AppDataSource } from '../config/database.js';
import { Admin } from '../entities/Admin.js';
import { Permission } from '../entities/Permission.js';
import { RolePermission } from '../entities/RolePermission.js';
import { User } from '../entities/User.js';
import { ArtistRequest, ArtistRequestRejectedReason } from '../entities/ArtistRequest.js';
import { ArtistPortfolio } from '../entities/ArtistPortfolio.js';
import { Category } from '../entities/Category.js';
import { Payment } from '../entities/Payment.js';
import { Support } from '../entities/Support.js';
import { FAQ } from '../entities/FAQ.js';
import { AboutUs } from '../entities/AboutUs.js';
import { Banner } from '../entities/Banner.js';
import { Tutorial } from '../entities/Tutorial.js';

const userRepository = () => AppDataSource.getRepository(User);
const adminRepository = () => AppDataSource.getRepository(Admin);
const permissionRepository = () => AppDataSource.getRepository(Permission);
const rolePermissionRepository = () => AppDataSource.getRepository(RolePermission);
const artistRequestRepository = () => AppDataSource.getRepository(ArtistRequest);
const artistPortfolioRepository = () => AppDataSource.getRepository(ArtistPortfolio);
const categoryRepository = () => AppDataSource.getRepository(Category);
const paymentRepository = () => AppDataSource.getRepository(Payment);
const supportRepository = () => AppDataSource.getRepository(Support);
const faqRepository = () => AppDataSource.getRepository(FAQ);
const aboutUsRepository = () => AppDataSource.getRepository(AboutUs);
const artistRequestRejectedReasonRepository = () => AppDataSource.getRepository(ArtistRequestRejectedReason);
const bannerRepository = () => AppDataSource.getRepository(Banner);
const tutorialRepository = () => AppDataSource.getRepository(Tutorial);

export {
    userRepository,
    adminRepository,
    permissionRepository,
    rolePermissionRepository,
    artistRequestRepository,
    artistPortfolioRepository,
    categoryRepository,
    paymentRepository,
    supportRepository,
    faqRepository,
    aboutUsRepository,
    artistRequestRejectedReasonRepository,
    bannerRepository,
    tutorialRepository
};

