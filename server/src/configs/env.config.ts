import dotenv from "dotenv";

dotenv.config({path : `.env.${process.env.NODE_ENV || 'development'}.local`});

export const {
  MONGODB_URI , 
  COOKIE_SECRET ,   
  SALT_ROUND , 
  JWT_SECRET,  
  FRONTEND , 
  TEST
} = process.env;