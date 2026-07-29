import express  , {Request , Response} from "express";
import authRouter from "./routes/auth.routes";
import { FRONTEND } from "./configs/env.config";
import userRouter from "./routes/user.routes";
import folderRouter from "./routes/folder.routes";
import fileRouter from "./routes/file.routes";
import cors from "cors";
import trashRouter from "./routes/trash.routes";

const app = express();
app.use(express.json());

app.use(cors({
  origin: FRONTEND , 
  methods: ["GET", "POST" , "DELETE" , "PUT" , "PATCH"],
  credentials: true
}));


app.get("/"  , (req : Request, res : Response)=>{
  res.send("Hi, Jexts here!")
})

app.use("/api/v1/auth" , authRouter);
app.use("/api/v1/users" , userRouter);
app.use("/api/v1/folder" , folderRouter);
app.use("/api/v1/file" , fileRouter);
app.use("/api/v1/trash" , trashRouter);

export default app;

/**
 * I have to find out understanding about all the apis and also add the proper docs to it 
 * add UI and pages 
 * change in layout and made New stylish pages 
 */