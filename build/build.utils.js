const path = require('path')
const fs = require('fs')
const resolve = (dir) => path.join(__dirname, '../', dir)
const packageJson = require('../package')
const join = path.join
const webpack = require('webpack')
const WebpackMerge = require('webpack-merge')

/**
 * 转为驼峰命名
 * @author 韦胜健
 * @date 2018/11/19
 */
function camelCase(name) {
    const SPECIAL_CHARS_REGEXP = /([:\-_]+(.))/g;
    const MOZ_HACK_REGEXP = /^moz([A-Z])/;
    return name
        .replace(SPECIAL_CHARS_REGEXP, function (_, separator, letter, offset) {
            return offset ? letter.toUpperCase() : letter;
        })
        .replace(MOZ_HACK_REGEXP, 'Moz$1');
}

const entryName = (() => {
    let name = packageJson.name
    let separatorIndex = name.indexOf('/')
    if (separatorIndex > -1) {
        name = name.substring(separatorIndex + 1)
    }
    return name
})();

module.exports = {
    path,
    // 当前是否为生产模式
    isProduction: process.env.NODE_ENV === 'production',
    // 包名
    packageName: packageJson.name,
    // 打包主入口文件名
    entryName,
    // 打包暴露对象名称
    libraryName: (() => {
        let name = camelCase(entryName)
        name = name.charAt(0).toUpperCase() + name.substring(1)
        return name
    })(),
    // 版本
    version: packageJson.version,
    webpack,
    WebpackMerge,
    resolve,
    join,
    camelCase,
    argv: (() => {
        const args = process.argv.slice(2)
        return args.reduce((ret, item) => {
            if (item.indexOf('=') > -1) {
                const [key, value] = item.split('=')
                ret[key] = value
            } else if (item.indexOf('--') > -1) {
                const key = item.replace('--', '')
                ret[key] = true
            }
            return ret
        }, {})
    })(),
    isExist(path) {
        try {
            return fs.statSync(path)
        } catch (e) {
            return null
        }
    },
    getEntries(path) {
        let files = fs.readdirSync(resolve(path));
        const componentEntries = files.reduce((ret, item) => {
            let itemPath = join(path, item)
            let isDir = fs.statSync(itemPath).isDirectory();
            if (isDir) {
                let p;
                p = resolve(join(itemPath, 'index.js'))
                if (!!this.isExist(p)) {
                    ret[item] = p
                }
                p = resolve(join(itemPath, 'index.ts'))
                if (!!this.isExist(p)) {
                    ret[item] = p
                }
                p = resolve(join(itemPath, 'index.tsx'))
                if (!!this.isExist(p)) {
                    ret[item] = p
                }
            } else {
                const [name] = item.split('.')
                ret[name] = resolve(`${itemPath}`)
            }
            return ret
        }, {})
        console.dir(componentEntries)
        return componentEntries
    },
}
