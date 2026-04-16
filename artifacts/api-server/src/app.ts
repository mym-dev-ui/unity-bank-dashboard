import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import router from "./routes";
import { logger } from "./lib/logger";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROD = process.env.NODE_ENV === "production";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) { return { id: req.id, method: req.method, url: req.url?.split("?")[0] }; },
      res(res) { return { statusCode: res.statusCode }; },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

/* ─── Unity Bank + Unity Admin ───────────────────────────── */
if (PROD) {
  // Production: serve pre-built static files
  const bankDist  = path.resolve(__dirname, "../../unity-bank/dist/public");
  const adminDist = path.resolve(__dirname, "../../unity-admin/dist/public");

  app.use("/unity-bank",  express.static(bankDist));
  app.use("/unity-admin", express.static(adminDist));

  // SPA fallback — all sub-paths serve index.html
  app.get("/unity-bank/*path",  (_req, res) => res.sendFile(path.join(bankDist,  "index.html")));
  app.get("/unity-admin/*path", (_req, res) => res.sendFile(path.join(adminDist, "index.html")));
} else {
  // Development: proxy to Vite dev servers
  function proxyFull(req: Request, res: Response, targetPort: number) {
    const opts: http.RequestOptions = {
      hostname: "localhost",
      port: targetPort,
      path: req.url,
      method: req.method,
      headers: { ...req.headers, host: `localhost:${targetPort}` },
    };
    const pr = http.request(opts, (pres) => {
      res.writeHead(pres.statusCode ?? 502, pres.headers as Record<string, string>);
      pres.pipe(res, { end: true });
    });
    pr.on("error", () => res.status(502).end("Gateway Error"));
    req.pipe(pr, { end: true });
  }

  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.url?.startsWith("/unity-bank")) {
      proxyFull(req, res, 26000);
    } else if (req.url?.startsWith("/unity-admin")) {
      proxyFull(req, res, 26001);
    } else {
      next();
    }
  });
}

export default app;
