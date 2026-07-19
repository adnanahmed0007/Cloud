import dotenv from "dotenv";
dotenv.config();

import redisClient from "./config/redis.js";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Route from "./routes/SignupRoute.js";
import cookieParser from "cookie-parser";
const app = express();

const PORT = process.env.PORT || 9090;
const DB_URL = process.env.DB_URL;
app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "https://cloud-sooty-psi.vercel.app",
        ],
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser());
app.use("/auth/api", Route);


async function connection() {
    try {
        await mongoose.connect(DB_URL);
        console.log("✅ MongoDB Connected");

        try {
            await redisClient.connect();
            console.log("✅ Redis Connected");
        } catch (err) {
            console.log("❌ Redis Connection Failed:", err.message);
        }


        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error.message);
        process.exit(1);
    }
}

connection();
