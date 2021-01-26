const path = require("path")
const fs = require("fs").promises
// @ts-ignore
const resolve = (filePath: string) => path.join(__dirname, "../", filePath)
const utils = {path, fs, resolve, join: path.join}

interface ScanOption {
    path: string,
    handleFile?: (fileRelativePath: string) => void
    handleDirectory?: (directoryRelativePath: string) => void
    excludeFileRegexp?: RegExp | RegExp[],
    excludeDirectoryRegExp?: RegExp | RegExp[],
}

const ScanUtils = (() => {

    /*获取文件状态，文件不存在则返回null*/
    const getStat = async (filePath: string) => {
        try {
            return await fs.stat(filePath)
        } catch (e) {
            return null
        }
    }

    /*将路径中的符号转成系统支持的路径分隔符*/
    const formatPath = (filePath: string) => filePath.replace(/([\/\\])/g, path.sep)

    /*扫描路径*/
    async function scan({path, handleFile, handleDirectory, excludeFileRegexp, excludeDirectoryRegExp,}: ScanOption) {
        path = utils.path.normalize(path)
        const state = await getStat(path)
        if (!!state) {
            if (state.isFile()) {
                if (!!excludeFileRegexp && (Array.isArray(excludeFileRegexp) ? excludeFileRegexp.some(i => i.test(path)) : excludeFileRegexp.test(path))) {
                    return
                }
                !!handleFile && handleFile(path)
            } else {
                if (!!excludeDirectoryRegExp && (Array.isArray(excludeDirectoryRegExp) ? excludeDirectoryRegExp.some(i => i.test(path)) : excludeDirectoryRegExp.test(path))) {
                    return
                }
                !!handleDirectory && handleDirectory(path)
                const files = await utils.fs.readdir(path)
                await Promise.all(files.map((file: string) => scan({
                    path: utils.join(path, file),
                    handleFile,
                    handleDirectory,
                    excludeFileRegexp,
                    excludeDirectoryRegExp,
                })))
            }
        }
    }

    return {
        scan,
    }
})();

(async () => {
    const output = resolve("theme/scan.scss.json")
    const map: Record<string, string> = {}
    await ScanUtils.scan({
        path: resolve("src/packages"),
        handleFile: async (path) => {
            const name = path.replace(/[\\\/]/g, '/')
            if (!!map[name]) return
            const basename = utils.path.basename(path)
            const extname = utils.path.extname(basename)
            if (extname !== '.scss') return;
            map[name] = (await utils.fs.readFile(path)).toString("utf-8").replace(/([\r\n])/g, '')
        },
    })
    const data = Object.entries(map).map(([path, source]) => ({
        path,
        source,
        basename: utils.path.basename(path).replace('.scss', ''),
    }))
    await fs.writeFile(output, JSON.stringify(data, null, 2))
})();