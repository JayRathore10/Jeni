import { Request , Response , NextFunction } from "express";

export const test = async(req  : Request , res : Response , next : NextFunction)=>{
  try{
    return res.json({
      message : "Test" 
    });
  }catch(err){
    next(err);
  }
}