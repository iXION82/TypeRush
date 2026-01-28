import express from "express";
import healthRoute from "./routes/health.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());
app.use("/api", healthRoute);
export default app;
