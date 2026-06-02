import { Request , Response , NextFunction} from "express";

export const upload = async(req : Request ,res : Response , next : NextFunction)=>{
  try{
    console.log(req.files);
    res.send("uploaded");
  }catch(err){
    next(err);
  }
}