import { Router } from "express";
import aiRoutes from "./aiRoutes";
import projectRoutes from "./projectRoutes";
import taskRoutes from "./taskRoutes";

const apiRouter = Router();

apiRouter.use((_req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  next();
});

apiRouter.use("/ai", aiRoutes);
apiRouter.use("/projects", projectRoutes);
apiRouter.use("/tasks", taskRoutes);

export default apiRouter;
