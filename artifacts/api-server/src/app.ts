import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import http from "node:http";
import router from "./routes";
import { logger } from "./lib/logger";

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

// Proxy /unity-bank → port 26000, /unity-admin → port 26001
// Use full req.url (not stripped) to preserve base path expected by Vite
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

export default app;
