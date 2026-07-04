import { Router } from 'express';
import {
    adminLogin,
    artistsRequestsController,
    artistRequestUpdate,
    adminCategoryController,
    updateCategoryController,
    getSupportController,
    updateSupportConstoller,
    artistRequestRetrieveController,
    categoryRetrieveController,
    userListController,
    faqListController,
    faqRetrieveController,
    faqCreateController,
    faqUpdateController,
    aboutUsAdminController,
    updateAboutUsAdminController,
    userArtistRequestsController,
    updateAdminFAQsController,
    adminBannerListController,
    adminBannerRetrieveController,
    bannerCreateController,
    bannerUpdateController,
    bannerDeleteController,
    AdminMinioController,
    adminTutorialListController,
    adminTutorialRetrieveController,
    tutorialCreateController,
    tutorialUpdateController,
    tutorialDeleteController,
} from '../controllers/init.js';
import adminAuth from '../middleware/adminAuthentication.js';
import { upload } from '../middleware/upload.js';

const router = Router();
router.post('/login', adminLogin);
router.get("/artist-requests", [adminAuth], artistsRequestsController);
router.patch("/artist-requests/:id/", [adminAuth], artistRequestUpdate);
router.get('/categories/', [adminAuth], adminCategoryController);
router.get('/supports/', [adminAuth], getSupportController);
router.get('/supports/:id/', [adminAuth], getSupportController);
router.patch('/categories/:id/', [adminAuth], updateCategoryController);
router.patch('/supports/:id/', [adminAuth], updateSupportConstoller);
router.get('/artist-requests/:id/', [adminAuth], artistRequestRetrieveController)
router.get('/categories/:id/', [adminAuth], categoryRetrieveController)
router.get('/users/', [adminAuth], userListController)
router.get('/users/:id/artist-requests/', [adminAuth], userArtistRequestsController)
router.get('/faqs/', [adminAuth], faqListController)
router.post('/faqs/', [adminAuth], faqCreateController)
router.patch('/faqs/', [adminAuth], updateAdminFAQsController)
router.get('/faqs/:id/', [adminAuth], faqRetrieveController)
router.patch('/faqs/:id/', [adminAuth], faqUpdateController)
router.get('/about-us/', [adminAuth], aboutUsAdminController)
router.patch('/about-us/:id/', [adminAuth], updateAboutUsAdminController)
router.get('/banners/', [adminAuth], adminBannerListController)
router.post('/banners/', [adminAuth], bannerCreateController)
router.get('/banners/:id/', [adminAuth], adminBannerRetrieveController)
router.patch('/banners/:id/', [adminAuth], bannerUpdateController)
router.delete('/banners/:id/', [adminAuth], bannerDeleteController)
router.get('/tutorials/', [adminAuth], adminTutorialListController)
router.post('/tutorials/', [adminAuth], tutorialCreateController)
router.get('/tutorials/:id/', [adminAuth], adminTutorialRetrieveController)
router.patch('/tutorials/:id/', [adminAuth], tutorialUpdateController)
router.delete('/tutorials/:id/', [adminAuth], tutorialDeleteController)
router.post(
    '/upload/image',
    [adminAuth, upload.single('file')],
    AdminMinioController.uploadImage,
)

export default router;
