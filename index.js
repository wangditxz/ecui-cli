#!/usr/bin/env node

const commander = require('commander');
const ecuiinfo = require('./package.json');
const shell = require('shelljs');

// 事件
const initAction = require('./action/init');
const createPage = require('./action/createPage');
const frd = require('./action/frd');

commander.version(ecuiinfo.version);

commander.usage(
    `
  ecui是一个用于前端开发的面向事件的框架，支持前后端分离及SPA单页应用，支持PC和移动端的开发；该前端框架特别适合于交互繁多复杂的2b场景，对事件进行统一的管理，ecui兼容IE7以上浏览器，且不需要npm包引入大量不稳定的插件，多数场景功能都有内置的控件实现。
  
  具体文档:https://github.com/yxUED/ecui-guide
`
);

commander.command('init').description('创建项目').action(initAction);

commander
    .command('build <projectname>')
    .description('编译')
    .action((projectname) => {
        console.log('开始编译');
        if (!projectname) {
            console.log('请输入要编译的项目');
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
                console.log('初始化成功');
            }
        );
    });
commander
    .command('page <moudule> <router>')
    .option('-p', 'pc路由(不会生成layer文件)')
    .description('创建页面 moudule 模块名称 router 页面名称')
    .action(createPage);

commander
    .command('frd')
    .description('引入frd控件库')
    .action(frd);

commander.parse(process.argv);
