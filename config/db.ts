import mongoose from "mongoose";
import config from "config";

const connectDB = async () => {
  const db = config.get("mongoURI");

  try {
    // @ts-ignore
    mongoose.connect(db, {
      useNewUrlParser: true,
    });

    console.log("MongoDB Connected...");
  } catch (err) {
    console.log(err);
    // Exit proces
    process.exit(1);
  }
};

export default connectDB;
