import Router from "koa-router";
import { post } from "../controllers/generateWORD";

const router = new Router({ prefix: "/generateWORD" });

export default router.post("/", post);
