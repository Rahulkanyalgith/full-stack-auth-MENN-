import express from "express";
const router = express.Router();

import UserController from "../controllers/userController.js";
import passport from "passport";
import setAuthHeader from "../middlewares/setAuthHeaders.js";

router.post("/register", UserController.userRegistration);
router.post("/verifyemail", UserController.verifyEmail);
router.post("/login", UserController.userLogin);
router.post("/refresh-token", UserController.getNewAccessToken);

router.get(
  "/profile",
  setAuthHeader,
  passport.authenticate("jwt", { session: false }),
  UserController.logggedInUser
);

export default router;
