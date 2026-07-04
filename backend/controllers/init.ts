import { adminLogin } from './admin/loginController.js';
import { artistsRequestsController, artistRequestUpdate, artistRequestRetrieveController, userArtistRequestsController } from './admin/artistsRequestsController.js';
import { categoryController } from './common/categoryController.js';
import UserController, { userProfileUpdateController } from './user/loginController.js';
import { UserMinioController } from './user/minioController.js';
import { createArtistRequest, getArtistRequests, getAllArtistsRequests, getRetrieveArtistsRequests, updateArtistRequestController } from './user/artistRequestController.js';
import { purchaseController, callbackController } from './user/gatewayController.js';
import { categoryController as adminCategoryController, updateCategoryController, categoryRetrieveController } from './admin/categoryController.js';
import { supportCreateController } from './user/supportController.js';
import { getSupportController, updateSupportConstoller } from './admin/supportController.js';
import { getUserSupportListController } from './user/supportController.js';
import { userListController } from './admin/userController.js';
import { faqListController, faqRetrieveController, faqUpdateController, faqCreateController, updateAdminFAQsController } from './admin/faqController.js'
import { faqListCommonController } from './common/faqController.js';
import { aboutUsAdminController, updateAboutUsAdminController } from './admin/aboutUsController.js';
import { aboutUsController } from './common/aboutUsController.js';
import {
    bannerListController as adminBannerListController,
    bannerRetrieveController as adminBannerRetrieveController,
    bannerCreateController,
    bannerUpdateController,
    bannerDeleteController,
} from './admin/bannerController.js';
import { bannerListCommonController } from './common/bannerController.js';
import { AdminMinioController } from './admin/minioController.js';
import {
    tutorialListController as adminTutorialListController,
    tutorialRetrieveController as adminTutorialRetrieveController,
    tutorialCreateController,
    tutorialUpdateController,
    tutorialDeleteController,
} from './admin/tutorialController.js';
import { tutorialListCommonController } from './common/tutorialController.js';

export {
    adminLogin, artistsRequestsController, supportCreateController, getUserSupportListController,
    categoryController, UserController, UserMinioController, createArtistRequest,
    getArtistRequests, purchaseController, callbackController, artistRequestUpdate, faqCreateController,
    getAllArtistsRequests, adminCategoryController, updateCategoryController, getSupportController,
    updateSupportConstoller, artistRequestRetrieveController, categoryRetrieveController, getRetrieveArtistsRequests,
    userProfileUpdateController, userListController, faqListController, faqRetrieveController, faqUpdateController,
    faqListCommonController, aboutUsAdminController, updateAboutUsAdminController, aboutUsController,
    userArtistRequestsController, updateArtistRequestController, updateAdminFAQsController,
    adminBannerListController, adminBannerRetrieveController, bannerCreateController, bannerUpdateController,
    bannerDeleteController, bannerListCommonController, AdminMinioController,
    adminTutorialListController, adminTutorialRetrieveController, tutorialCreateController, tutorialUpdateController,
    tutorialDeleteController, tutorialListCommonController
}