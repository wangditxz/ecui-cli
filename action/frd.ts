const inquirer = require('inquirer');
const shell = require('shelljs');
const path = require('path');

export default () => {
    inquirer
        .prompt([
            {
                type: 'input',
                message: '请输入导入的文件名(默认frd-lib)',
                name: 'name'
            }
        ])
        .then((answers: {
            name: string
        }) => {
            var name = answers.name || 'frd-lib';
            console.log('导入的名称为: ', name);
            console.log('重新打包控件库');
            const envPath = process.cwd();
            const libPath = path.resolve(envPath, `../lib-controls`);
            const targetJSPath = path.resolve(envPath, `./${name}.js`);
            const targetCSSPath = path.resolve(envPath, `./${name}.css`);
            shell.cd(libPath);
            shell.exec('./build.sh', (error?: string) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    return;
                }
                shell.cp('-R', 'frd.min.js', targetJSPath);
                shell.cp('-R', 'frd.min.css', targetCSSPath);
                console.log('导入成功');
            });
        });
};