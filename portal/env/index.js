export default async function getEnv() {
    const env = CONFIG.env
    try {
        const module = await import('./' + env + '.js')
        return module.default
    } catch (e) {
        console.error(`找不到环境配置文件：${env}`)
        console.error(e)
    }
}
