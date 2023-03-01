import Router from "koa-router";
import { post } from "../controllers/generateHTML";

const router = new Router({ prefix: "/generateHTML" });

export default router.post("/", post);
