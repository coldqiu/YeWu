module.exports = {
  apps: [
    {
      name: "robin-nodejs",
      script: "./app.ts",
      interpreter: "./node_modules/.bin/ts-node",
      interpreter_args: "-P ./ -r tsconfig-paths/register",
      cwd: "./",
    },
  ],
};
