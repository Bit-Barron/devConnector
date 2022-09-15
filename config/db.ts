import mongoose from "mongoose";
import config from "config";

const connectDB = async () => {
  const db: any = config.get("mongoURI");

  try {
    mongoose.connect(db, {
      useNewUrlParser: true,
    } as any) ;

    console.log("MongoDB Connected...");
  } catch (err) {
    console.log(err);
    // Exit proces
    process.exit(1);
  }
};

export default connectDB;
