#!/usr/bin/env node

const commander = require("commander");
const ecuiinfo = require("./package.json");

const inquirer = require("inquirer");
const shell = require("shelljs");

const fs = require("fs");

const initAction = () => {
  inquirer
    .prompt([
      {
        type: "input",
        message: "请输入项目名称",
        name: "name"
      }
    ])
    .then(answers => {
      console.log(answers.name);
      console.log("请稍等...");
      shell.exec(
        `
        cp -R ${__dirname}/template ${answers.name}
        `,
        (error, stdout, stderr) => {
          if (error) {
            console.error(`exec error: ${error}`);
            return;
          }
          console.log("初始化成功");
        }
      );
    });
};

commander.version(ecuiinfo.version);

commander.usage(
  `
  ecui是一个用于前端开发的面向事件的框架，支持前后端分离及SPA单页应用，支持PC和移动端的开发；该前端框架特别适合于交互繁多复杂的2b场景，对事件进行统一的管理，ecui兼容IE7以上浏览器，且不需要npm包引入大量不稳定的插件，多数场景功能都有内置的控件实现。
  
  具体文档:https://github.com/yxUED/ecui-guide
`
);

commander
  .command("init")
  .description("创建项目")
  .action(initAction);

commander
  .command("build <projectname>")
  .description("编译")
  .action(projectname => {
    console.log("开始编译");
    if (!projectname) {
      console.log("请输入要编译的项目");
      return;
    }
    shell.exec(
      `
        ./ECUI/build.sh ${projectname}
    `,
      (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        console.log("初始化成功");
      }
    );
  });
commander
  .command("page <moudule> <router>")
  .description("创建页面 moudule 模块名称 router 页面名称")
  .action((moudule, router) => {
    const isMoudule = fs.existsSync(`./${moudule}`);
    if (!isMoudule) {
      fs.mkdirSync(`./${moudule}`);
      fs.writeFileSync(`./${moudule}/_define_.css`, "");
      fs.writeFileSync(`./${moudule}/_define_.js`, "");
    }
    const res = fs
      .readdirSync(`./${moudule}`)
      .filter(item => !item.startsWith(".") && !item.startsWith(".."));

    const isExist = res.some(item => item.startsWith(`route.${router}`));
    if (isExist) {
      console.error(`已经存在 ${router} 路由`);
      return;
    }
    const viewStr =
      moudule + router.charAt(0).toUpperCase() + router.slice(1) + "View";
    const classStr = `${moudule}-${router}-container`;

    fs.writeFileSync(`./${moudule}/router.${router}.html`, "");
    fs.writeFileSync(
      `./${moudule}/router.${router}.js`,
      `ecui.esr.addRoute('${router}', {
    model: [''],
    view: '${viewStr}',
    onbeforerequest: function (context) {
    },
    onbeforerender: function (context) {
    },
    onafterrender: function (context) {
    }
});`
    );
    fs.writeFileSync(
      `./${moudule}/router.${router}.css`,
      `.${classStr} {
}`
    );
    fs.writeFileSync(
      `./${moudule}/layer.${router}.html`,
      `<!-- target:${viewStr} -->
<div class="${classStr}">
    <div class="page-title">detail页面的内容区域</div>
</div>`
    );

    const jsStr = fs.readFileSync(`./${moudule}/_define_.js`, {
      encoding: "utf8"
    });

    const regexp = new RegExp(
      `ecui.esr.loadRoute\\(["']${router}["']\\)`,
      "ig"
    );
    if (!regexp.test(jsStr)) {
      fs.writeFileSync(
        `./${moudule}/_define_.js`,
        jsStr + "\n" + `ecui.esr.loadRoute("${router}");`
      );
    }
    console.log("创建完毕");
  });

commander.parse(process.argv);
