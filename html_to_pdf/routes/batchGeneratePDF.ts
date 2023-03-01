import Router from "koa-router";
import { post } from "../controllers/batchGeneratePDF";

const router = new Router({ prefix: "/batchGeneratePDF" });

export default router.post("/", post);
