import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import { authRoute, categoryRoute, userRoute } from "./routes/index.routes.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
    origin: "http://localhost:5000",
    credentials: true
}
app.use(cors(corsOptions));

app.use('/api/v1/auth', authRoute)
app.use('/api/v1/category', categoryRoute)
app.use('/api/v1/user', userRoute)

app.listen(PORT, (err) => {
    if (err) {
        console.log(err);
    }
    console.log(`Server running on port ${PORT}`);
    connectDB();
})