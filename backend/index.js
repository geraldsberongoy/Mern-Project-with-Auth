import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";

const PORT = process.env.PORT || 8080;

const app = express();

//middleware json
app.use(express.json());
app.use(cookieParser());
const cors = require("cors");

const allowedOrigins = [
  "http://localhost:5173",
  "https://mern-project-with-auth.vercel.app/",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectDB();
});
