const inquirer = require('inquirer');
const shell = require('shelljs');
import * as path from 'path';

export default () => {
    inquirer
        .prompt([
            {
                type: 'input',
                message: '请输入项目名称',
                name: 'name'
            },
            {
                type: 'list',
                message: '请选择项目类型',
                name: 'type',
                choices: ['pc', 'h5']
            }
        ])
        .then((answers: {
            name: string,
            type: string
        }) => {
            console.log(answers.name);
            console.log(answers.type);
            console.log('请稍等...');
            const envPath = process.cwd();
            const targetPath = path.resolve(envPath, `./${answers.name}`);
            const origtinPath = path.resolve(__dirname, `../template-${answers.type}`);
            shell.exec(`cp -R ${origtinPath} ${targetPath}`, (error?: string) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    return;
                }
                console.log('初始化成功');
            });
        });
};
