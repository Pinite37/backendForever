import mongoose from "mongoose";


const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Connected to MongoDB");
    });
    console.log(process.env.MONGODB_URL)
    const connection = await mongoose.connect(`${process.env.MONGODB_URL}/ecommerce`);
    if (connection) {
      console.log(`Connected to MongoDB: ${connection.connection.host}`);
    }
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
  }
};

export default connectDB;