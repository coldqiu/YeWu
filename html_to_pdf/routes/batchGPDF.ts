import Router from "koa-router";
import { post } from "../controllers/batchGPDF";

const router = new Router({ prefix: "/batchGPDF" });

export default router.post("/", post);
