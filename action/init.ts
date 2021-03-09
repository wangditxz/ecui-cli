import * as path from 'path';
import * as shell from 'shelljs';
import * as inquirer from 'inquirer';
import { isRootDir } from '../tool'


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
            const envPath = process.cwd();
            if (!isRootDir(envPath)) {
                throw new Error("请在ECUI同级目录执行此命令");
            }
            console.log('请稍等...');
            const targetPath = path.resolve(envPath, `./${answers.name}`);
            const origtinPath = path.resolve(__dirname, `../template-${answers.type}`);
            shell.exec(`cp -R ${origtinPath} ${targetPath}`, (error) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    return;
                }
                console.log('初始化成功');
            });
        });
};
