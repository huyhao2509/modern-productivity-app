import express from "express";
import cors from "cors";
import apiRouter from "./routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "Backend is running" });
});

app.use("/api", apiRouter);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});
