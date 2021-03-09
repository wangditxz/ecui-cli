import * as path from 'path'
import * as fs from 'fs'
import * as fse from 'fs-extra'
import * as shell from 'shelljs'



export function delDir(path: string) {
    let files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach((file: string) => {
            let curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) {
                delDir(curPath); //递归删除文件夹
            } else {
                fs.unlinkSync(curPath); //删除文件
            }
        });
        fs.rmdirSync(path);
    }
}
const templateProjectPath = path.resolve(__dirname, `../temps/project`);
/**
*从远程仓库下载模板
* @param {string} repo 远程仓库地址
* @param {string} path 路径
*/
export const downloadTempFromRep = async (repo: string, srcPath: string): Promise<void> => {
    if (fs.existsSync(srcPath)) fs.rmdirSync(`${srcPath}`);

    shell.exec(`git clone ${repo} ${srcPath}`, (err) => {
        if (err) console.log(`下载模板出错：errorCode:${err},请联系@一凨`);
    })
    if (fs.existsSync(path.resolve(srcPath, './.git'))) {
        fs.rmSync(path.resolve(srcPath, './.git'));
    }
};

/**
 * 纠正当前路径到项目路径下，主要是为了防止用户在当前页面新建模块
 */
 export const modifiedCurrPathAndValidatePro = (proPath: string): string => {
    let tempPath = path.resolve(proPath, './_include');
    if (fs.existsSync(tempPath)) {
        return proPath;
    } else {
        tempPath = path.resolve(proPath, './_define_.js');
        if (fs.existsSync(tempPath)) {
            return modifiedCurrPathAndValidatePro(path.resolve(proPath, '..'));
        }
    }
    return proPath;
};
export function isRootDir(currentPath: string): boolean {
    if (fs.existsSync(path.resolve(currentPath, './ECUI'))) {
        return true;
    }
    return false;
}
