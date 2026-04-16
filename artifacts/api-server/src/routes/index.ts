import { Router, type IRouter } from "express";
import healthRouter from "./health";
import shamRouter from "./sham";
import tameeniRouter from "./tameeni";
import wiqayaRouter from "./wiqaya";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/sham", shamRouter);
router.use("/tameeni", tameeniRouter);
router.use("/wiqaya", wiqayaRouter);

export default router;
