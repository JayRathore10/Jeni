import express  , {Request , Response} from "express";
import authRouter from "./routes/auth.routes";
import { FRONTEND } from "./configs/env.config";
import userRouter from "./routes/user.routes";
import folderRouter from "./routes/folder.routes";
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

app.use("/api/v1/auth" , authRouter);
app.use("/api/v1/users" , userRouter);
app.use("/api/v1/folder" , folderRouter);

export default app;
