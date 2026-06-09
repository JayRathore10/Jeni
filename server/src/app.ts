import express  , {Request , Response} from "express";
import { multerRouter } from "./routes/multer.routes";
import authRouter from "./routes/auth.routes";
import cors from "cors";

const app = express();
app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173" , 
  methods: ["GET", "POST" , "DELETE" , "PUT"],
  credentials: true
}));


app.get("/"  , (req : Request, res : Response)=>{
  res.send("Hi, Jexts here!")
})

app.use("/multer", multerRouter);
app.use("/api/v1/auth" , authRouter);

export default app;
