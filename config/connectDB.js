import mongoose from "mongoose";
import colors from "colors";

const { MONGODB_URI } = process.env;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`:::`.green, `MongoDB connected: ${conn.connection.host}`.yellow);
  } catch (error) {
    console.error(`Could not connect to MongoDB: ${error.message}`);
    process.exit(1); // exit the process with failure
  }
};

export default connectDB;