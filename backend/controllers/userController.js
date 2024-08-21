import EmailVerificationModel from "../models/emailVerification.js";
import UserModel from "../models/User.js";
import bcrypt from "bcrypt";
import sendverificationotp from "../utils/sendverificationotp.js"

class UserController {
  //make a class to do a User registration

  static userRegistration = async (req, res) => {
    try {
      const { name, email, password, password_confirmation } = req.body;

      if (!name || !email || !password || !password_confirmation) {
        return res
          .status(500)
          .json({ status: "failed", message: "All fiels are requierd" });
      }

      if (password !== password_confirmation) {
        res.status(400).json({
          status: "failed",
          message: "password and confirm password don't match",
        });
      }

      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res
          .status(409)
          .json({ status: "failed", message: "Email already exists" });
      }

      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await new UserModel({
        name,
        email,
        password: hashedPassword,
      }).save();

      res.status(201).json({
        status: "success",
        message: "Registration success",
        user: { id: newUser._id, email: newUser.email },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: "failed",
        message: "Unable to Register, please try again later",
      });
    }
  };

  //make a user email verifaiation

  static verifyEmail = async (req, res) => {
    try {
      // Extract request body parameters
      const { email, otp } = req.body;

      // Check if all required fields are provided
      if (!email || !otp) {
        return res
          .status(400)
          .json({ status: "failed", message: "All fields are required" });
      }

      const existingUser = await UserModel.findOne({ email });

      // Check if email doesn't exists
      if (!existingUser) {
        return res
          .status(404)
          .json({ status: "failed", message: "Email doesn't exists" });
      }

      // Check if email is already verified
      if (existingUser.is_verified) {
        return res
          .status(400)
          .json({ status: "failed", message: "Email is already verified" });
      }

      // Check if there is a matching email verification OTP
      const emailVerification = await EmailVerificationModel.findOne({
        userId: existingUser._id,
        otp,
      });
      if (!emailVerification) {
        if (!existingUser.is_verified) {
          
          await sendverificationotp(req, existingUser);
          return res
            .status(400)
            .json({
              status: "failed",
              message: "Invalid OTP, new OTP sent to your email",
            });
        }
        return res
          .status(400)
          .json({ status: "failed", message: "Invalid OTP" });
      }

     
      const currentTime = new Date();
      // 15 * 60 * 1000 calculates the expiration period in milliseconds(15 minutes).
      const expirationTime = new Date(
        emailVerification.createdAt.getTime() + 15 * 60 * 1000
      );
      if (currentTime > expirationTime) {
        // OTP expired, send new OTP
        await sendverificationotp(req, existingUser);
        return res
          .status(400)
          .json({
            status: "failed",
            message: "OTP expired, new OTP sent to your email",
          });
      }

     
      existingUser.is_verified = true;
      await existingUser.save();

      // Delete email verification document
      await EmailVerificationModel.deleteMany({ userId: existingUser._id });
      return res
        .status(200)
        .json({ status: "success", message: "Email verified successfully" });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({
          status: "failed",
          message: "Unable to verify email, please try again later",
        });
    }
  };

  // user login 

  static userLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res
          .status(400)
          .json({
            status: "failed",
            message: "Email and password are required",
          });
      }
      // Find user by email
      const user = await UserModel.findOne({ email });

      // Check if user exists
      if (!user) {
        return res
          .status(404)
          .json({ status: "failed", message: "Invalid Email or Password" });
      }

      // Check if user verified
      if (!user.is_verified) {
        return res
          .status(401)
          .json({ status: "failed", message: "Your account is not verified" });
      }

      // Compare passwords / Check Password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(401)
          .json({ status: "failed", message: "Invalid email or password" });
      }

      // Generate tokens
      const { accessToken, refreshToken, accessTokenExp, refreshTokenExp } =
        await generateTokens(user);

      // Set Cookies
      setTokensCookies(
        res,
        accessToken,
        refreshToken,
        accessTokenExp,
        refreshTokenExp
      );

      // Send success response with tokens
      res.status(200).json({
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          roles: user.roles[0],
        },
        status: "success",
        message: "Login successful",
        access_token: accessToken,
        refresh_token: refreshToken,
        access_token_exp: accessTokenExp,
        is_auth: true,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({
          status: "failed",
          message: "Unable to login, please try again later",
        });
    }
  };

  // get new access token and refresh token

  static getNewAccessToken = async (req, res) => {
    
  }
  


}





export default UserController;
