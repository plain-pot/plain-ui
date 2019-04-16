const path = require('path')
const resolve = (dir) => path.join(__dirname, '../', dir)

module.exports = {
    resolve,
    decodeArgv() {
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
    }
}