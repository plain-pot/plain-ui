const path = require('path')
const fs = require('fs')

const resolve = (filePath: string) => path.join(__dirname, '../', filePath)

function scan(config: {
    input: string,
    outputDir: string,
}): void {

    const content = Buffer.from(fs.readFileSync(config.input)).toString()
    const icons = [] as {
        id: string,
        path: string,
    }[]
    const reg = /<symbol id="(.*?)".*?>(.*?)<\/symbol>/g
    let match = reg.exec(content)
    while (match) {
        icons.push({
            id: match[1],
            path: match[2],
        })
        match = reg.exec(content)
    }

    icons.forEach(icon => {
        fs.writeFileSync(path.join(config.outputDir, `${icon.id}.js`), `export default '${icon.path}'`)
    })
    fs.writeFileSync(path.join(config.outputDir, 'index.js'), `export default ${JSON.stringify(icons.map(i => i.id))}`)
}


scan({
    input: resolve('iconfont/iconfont.js'),
    outputDir: resolve('src/packages/icon/icons')
})

