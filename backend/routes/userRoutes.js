import express from "express";
const router = express.Router();

import UserController from "../controllers/userController.js";
import passport from "passport";
import accessTokenAutoRefresh from "../middlewares/accessTokenautorefresh.js";


router.post("/register", UserController.userRegistration);
router.post("/verifyemail", UserController.verifyEmail);
router.post("/login", UserController.userLogin);
router.post("/refresh-token", UserController.getNewAccessToken);
router.post('/reset-password/:id/:token', UserController.userPasswordReset)

router.get(
  "/profile",
  accessTokenAutoRefresh,
  passport.authenticate("jwt", { session: false }),
  UserController.logggedInUser
);

router.get(
  "/logout",
  accessTokenAutoRefresh,
  passport.authenticate("jwt", { session: false }),
  UserController.userLogout
);

export default router;
