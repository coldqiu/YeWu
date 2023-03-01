import Router from "koa-router";

import { post } from "../controllers/batchGeneratePDF";

const router = new Router({ prefix: "/generatePDF" });

export default router.post("/", post);
