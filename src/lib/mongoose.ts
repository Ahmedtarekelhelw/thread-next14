import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MOGOBD_URL) return console.log("mongo url not found");

  if (isConnected) return console.log("Already connected to Mongobd");

  try {
    await mongoose.connect(process.env.MOGOBD_URL);
    isConnected = true;

    console.log("Connected ");
  } catch (error) {
    console.log(error);
  }
};
