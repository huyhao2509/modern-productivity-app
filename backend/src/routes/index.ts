import { Router } from "express";
import projectRoutes from "./projectRoutes";
import taskRoutes from "./taskRoutes";

const apiRouter = Router();

apiRouter.use("/projects", projectRoutes);
apiRouter.use("/tasks", taskRoutes);

export default apiRouter;
