import dotenv from "dotenv";

dotenv.config();
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import connectDB from "./config/connectdb.js";
import "./config/passport-jwt.js";
import passport from "passport";
import userRoutes from './routes/userRoutes.js'

const app = express();
const port = process.env.PORT;
const DATBASE_URL = process.env.DATBASE_URL
// cors policy error solved
const corsOptions = {
  
  origin: process.env.FRONTEND_HOST,
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions))


connectDB(DATBASE_URL);

app.use(express.json());

app.use(passport.initialize());

app.use(cookieParser());

app.use("/api/user" , userRoutes)

app.listen(port, () => {
  console.log(`server is here at http://localhost:${port}`);
});
