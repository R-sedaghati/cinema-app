import { Router } from 'express';
import userAuth from '../middleware/userAuthentication.js';
import { upload } from '../middleware/upload.js';
import { callbackController, createArtistRequest, getArtistRequests, getUserSupportListController, purchaseController, supportCreateController, updateArtistRequestController, UserController, UserMinioController, userProfileUpdateController } from '../controllers/init.js';


const router = Router();

router.get('/', UserController.getUsers);
router.get('/profile/', [userAuth], UserController.getUserProfile);
router.post('/login/', UserController.userLogin);
router.post(
  "/avatar",
  [userAuth, upload.single("file")],
  UserMinioController.uploadAvatar,
);
router.post(
  "/upload/video",
  [userAuth, upload.single("file")],
  UserMinioController.uploadVideo,
);
router.post(
  "/upload/image",
  [userAuth, upload.single("file")],
  UserMinioController.uploadImage,
);
router.post(
  "/artist-requests",
  [userAuth, upload.array("portfolios")],
  createArtistRequest,
)

router.get(
  '/artist-requests',
  [userAuth],
  getArtistRequests
)
router.patch(
  '/artist-requests/:id/',
  [userAuth],
  updateArtistRequestController
)

router.post(
  '/supports/',
  supportCreateController
)
router.get(
  '/supports/',
  [userAuth],
  getUserSupportListController
)

router.get(
  '/purchase/',
  [userAuth],
  purchaseController
)
router.patch(
  '/profile/',
  [userAuth],
  userProfileUpdateController
)

router.all('/purchase/callback/', callbackController)

export default router;

