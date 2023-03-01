import Router from "koa-router";
import { post } from "../controllers/generateWORDNext";

const router = new Router({ prefix: "/generateWORDNext" });

export default router.post("/", post);
