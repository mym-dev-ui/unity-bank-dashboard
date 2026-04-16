import { Router, type IRouter } from "express";
import healthRouter from "./health";
import shamRouter from "./sham";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/sham", shamRouter);

export default router;
