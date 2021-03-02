const path = require('path');
const fs = require('fs');

export default (moudule: string, router: string, options: {
    P: boolean
}) => {
    const envPath = process.cwd();

    // 判断是否有当前模块
    const modulePath = path.resolve(envPath, `./${moudule}`);
    const isMoudule = fs.existsSync(modulePath);
    if (!isMoudule) {
        fs.mkdirSync(modulePath);
        fs.writeFileSync(`${moudule}/_define_.css`, '');
        fs.writeFileSync(`${moudule}/_define_.js`, '');
    }

    // 判断是否是重名页面
    const res = fs
        .readdirSync(modulePath)
        .filter((item: string) => !item.startsWith('.') && !item.startsWith('..'));

    const isExist = res.some((item: string) => item.startsWith(`route.${router}`));
    if (isExist) {
        console.error(`已经存在 ${router} 路由`);
        return;
    }
    const viewStr = moudule + router.charAt(0).toUpperCase() + router.slice(1) + 'View';
    const classStr = `${moudule}-${router}-container`;

    if (!options.P) {
        fs.writeFileSync(
            `${moudule}/layer.${router}.html`,
            `<header></header>
        <container></container>`
        );
        fs.writeFileSync(
            `${moudule}/route.${router}.js`,
            `ecui.esr.addRoute('${router}', {
        model: [],
        view: '${viewStr}',
        onbeforerequest: function (context) {
        },
        onbeforerender: function (context) {
        },
        onafterrender: function (context) {
        }
    });`
        );
    } else {
        fs.writeFileSync(
            `${moudule}/route.${router}.js`,
            `ecui.esr.addRoute('${router}', {
        model: [],
        main: 'container',
        view: '${viewStr}',
        onbeforerequest: function (context) {
        },
        onbeforerender: function (context) {
        },
        onafterrender: function (context) {
        }
    });`
        );
    }

    fs.writeFileSync(
        `${moudule}/route.${router}.css`,
        `.${classStr} {
}`
    );
    fs.writeFileSync(
        `${moudule}/route.${router}.html`,
        `<!-- target:${viewStr} -->
<div class="${classStr}">
</div>`
    );

    const jsStr = fs.readFileSync(`${moudule}/_define_.js`, {
        encoding: 'utf8'
    });

    const regexp = new RegExp(`ecui.esr.loadRoute\\(["']${router}["']\\)`, 'ig');
    if (!regexp.test(jsStr)) {
        fs.writeFileSync(
            `./${moudule}/_define_.js`,
            jsStr + '\n' + `ecui.esr.loadRoute("${router}");`
        );
    }
    console.log('创建完毕');
};
