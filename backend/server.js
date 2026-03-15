import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "./config/dns.js"
import connectCloudinary from "./utils/imageupload/cloudinary.js";
import connectDB from "./config/db.js";


import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js"

dotenv.config();
connectCloudinary();
connectDB();


const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/issues", complaintRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
