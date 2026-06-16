import express  , {Request , Response} from "express";
import { multerRouter } from "./routes/multer.routes";
import authRouter from "./routes/auth.routes";
import { FRONTEND } from "./configs/env.config";
import userRouter from "./routes/user.routes";
import cors from "cors";

const app = express();
app.use(express.json());

app.use(cors({
  origin: FRONTEND , 
  methods: ["GET", "POST" , "DELETE" , "PUT"],
  credentials: true
}));


app.get("/"  , (req : Request, res : Response)=>{
  res.send("Hi, Jexts here!")
})

app.use("/multer", multerRouter);
app.use("/api/v1/auth" , authRouter);
app.use("/api/v1/users" , userRouter);

export default app;
