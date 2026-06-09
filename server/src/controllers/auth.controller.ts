import { Request , Response , NextFunction } from "express";
import { TEST } from "../configs/env.config";

export const test = async(req  : Request , res : Response , next : NextFunction)=>{
  try{
    return res.json({
      message : TEST 
    });
  }catch(err){
    next(err);
  }
}