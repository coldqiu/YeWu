## ejs模板渲染,可以生成html、word、pdf格式文件

> 项目技术栈 node.js koa2 typeScript puppeteer html-to-js html-to-docx ejs


## node服务启动流程

#### 1. 安装`nodejs`

```
yum install epel-release

yum install nodejs
```

#### 2. 安装`n`并切换`node`版本

```
npm i -g n

n lts
```

#### 3. 安装`pm2`和`ts-node`

```
npm i -g ts-node ts-node-dev

npm i -g pm2

pm2 list
```


#### 4. 安装依赖

```
yum install -y alsa-lib.x86_64 atk.x86_64 cups-libs.x86_64 gtk3.x86_64 ipa-gothic-fonts libXcomposite.x86_64 libXcursor.x86_64 libXdamage.x86_64 libXext.x86_64 libXi.x86_64 libXrandr.x86_64 libXScrnSaver.x86_64 libXtst.x86_64 pango.x86_64 xorg-x11-fonts-100dpi xorg-x11-fonts-75dpi xorg-x11-fonts-cyrillic xorg-x11-fonts-misc xorg-x11-fonts-Type1 xorg-x11-utils GConf2.x86_64 wqy-unibit-fonts.noarch wqy-zenhei-fonts.noarch

// 依赖安装完毕后执行下面这条命令
yum update nss -y
```

#### 5. 安装字体

```
yum groupinstall "fonts" -y
```

#### 6.安装项目依赖

```js
npm install
```

#### 7. 启动项目

```
cd /data/nodejs

pm2 start --interpreter ts-node-dev app.ts

```

#### 8. 重启项目(拉取代码后重启服务)

```
cd /data/nodejs

pm2 reload app

```
[pm2 常用命令](https://chrunlee.cn/article/nodejs-pm2-cmd.html)

> ps:记录部分启动服务失败，处理方法


> 以下是服务与`puppeteer`相关的启动失败处理方法

### puppeteer依赖的chrome安装失败
```js
 Error: Could not find expected browser (chrome) locally. Run `npm install` to download the correct Chromium revision (901912).
2|node3    |     at ChromeLauncher.launch (/app/robin/robin-nodejs/node_modules/puppeteer/src/node/Launcher.ts:138:32)
```

报错原因是因为 `/node_modules/puppeteer/`下的`install.js` 没执行，要进入该目录手动`node install.js`


### 如果服务因为chrome启动失败，安装puppeteer 依赖

[puppeteer unix环境下 安装依赖 chrome](https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#chrome-headless-doesnt-launch-on-unix)


