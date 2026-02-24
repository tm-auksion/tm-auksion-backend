import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./src/routes/auth.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("TM Auksion Backend işleýär!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server işledi:", PORT));
