import express from "express";
import healthRoute from "./routes/health.route.js";
import textRoute from "./routes/text.route.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import scoreRoutes from "./routes/score.route.js";
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
app.use("/api/auth", authRoutes);
app.use("/api/score", scoreRoutes);
app.use("/api/user", userRoutes);
app.use("/api/text", textRoute);

export default app;
