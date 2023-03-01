import fs from "fs";

export default (app: any) => {
  fs.readdirSync(__dirname).forEach((file) => {
    if (file === "index.ts") {
      return;
    }
    const route = require(`./${file}`).default;
    app.use(route.routes()).use(route.allowedMethods());
  });
};
