import Koa from "koa";
import koaStatic from "koa-static";
import koaBody from "koa-body";
import routing from "./routes";

const app = new Koa();
app.use(koaBody());
app.use(koaStatic("./static"));

// 处理报错待实现
// 注入路由
routing(app);
app.use(async (ctx) => {
  ctx.body = "未定义的请求!";
});

app.listen(3001, () => console.log("程序启动在3001端口"));
