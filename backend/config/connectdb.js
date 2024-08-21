import mongoose from "mongoose";

const connectDB = async (DATBASE_URL) => {
  try {
    const DB_OPTIONS = {
      dbname: "Fullauth-app",
    };
    await mongoose.connect(DATBASE_URL, DB_OPTIONS);
    console.log("connect succesfully....");
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
