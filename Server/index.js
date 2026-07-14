import dotenv from "dotenv";
dotenv.config();

import "./config/redis.js";
import redisClient from "./config/redis.js";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Route from "./routes/SignupRoute.js";
import cookieParser from "cookie-parser";
const app = express();

const PORT = process.env.PORT || 9090;
const DB_URL = process.env.DB_URL;

app.use(express.json());
app.use(cookieParser());
app.use("/auth/api", Route);


async function connection() {
    try {
        await mongoose.connect(DB_URL);

        console.log("✅ MongoDB Connected");
        await redisClient.connect();
        console.log("✅ Redis Connected");

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error.message);
        process.exit(1);
    }
}

connection();