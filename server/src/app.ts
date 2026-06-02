import express  , {Request , Response} from "express";
import { multerRouter } from "./routes/multer.routes";
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

export default app;
