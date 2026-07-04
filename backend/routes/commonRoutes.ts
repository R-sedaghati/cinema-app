import { Router } from 'express';
import { aboutUsController, categoryController, faqListCommonController, getAllArtistsRequests, getRetrieveArtistsRequests, bannerListCommonController, tutorialListCommonController } from '../controllers/init.js';
import { getProvincesController, getProvinceCitiesController, searchCitiesController, getCityByIdController } from '../controllers/common/citiesAndProvincesController.js';


const router = Router();

router.get('/categories/', categoryController);
router.get('/artists-requests/', getAllArtistsRequests);
router.get('/artists-requests/:id/', getRetrieveArtistsRequests);
router.get("/provinces", getProvincesController);
router.get("/provinces/:id/cities", getProvinceCitiesController);
router.get("/cities/search", searchCitiesController);
router.get("/cities/:id", getCityByIdController);
router.get('/faqs/', faqListCommonController)
router.get('/about-us/', aboutUsController)
router.get('/banners/', bannerListCommonController)
router.get('/tutorials/', tutorialListCommonController)

export default router;

