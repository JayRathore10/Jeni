import mongoose from "mongoose";

export const connectDB = async()=>{
  try{
    await mongoose.connect("mongodb://localhost:27017/Jeni");
    console.log("DB Connected Successfully");
  }catch(err){
    console.log(err);
  }
}