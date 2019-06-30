class OvService {
    Vue
    dataMap = {}
    queryMap = {}
    delayTimer = null

    constructor(Vue) {
        this.Vue = Vue
    }

    get $plain() {
        return this.Vue.prototype.$plain
    }

    async getByType(type) {
        if (!type) {
            console.warn('选项值类型不能为空！')
            return []
        }
        return this.dataMap[type] || await this.queryByType(type)
    }

    async getByTypes(types) {
        return await Promise.all(types.map(type => this.getByType(type)))
    }

    async getByParentTypeAndCode(type, parentType, parentCode) {
        const ret = await this.getByType(type)
        return ret.filter(item => (item.parentType === parentType && item.parentCode === parentCode))
    }

    async queryByType(type) {
        if (!!this.queryMap[type]) {
            /*当前正在查询，等待查询完毕*/
            while (!!this.queryMap[type]) {
                await this.$plain.$utils.delay(500)
            }
            return this.dataMap[type]
        } else {
            this.queryMap[type] = true
            this.startQuery()
            return this.queryByType(type)
        }
    }

    /**
     * 开始查询选项值
     * @author  韦胜健
     * @date    2019/6/30 19:23
     */
    async startQuery() {
        if (!!this.delayTimer) clearTimeout(this.delayTimer)

        this.delayTimer = setTimeout(async () => {
            await this.$plain.nextTick()

            const url = 'lov/queryAll'
            const types = Object.keys(this.queryMap)
            const param = {query: {filters: [{field: 'type', operator: 'in', value: types.join(',')}]}}

            try {
                const {ret} = await this.Vue.prototype.$http.post(url, param)
                const dataMap = ret.reduce((ret, item) => {
                    !ret[item.type] && (ret[item.type] = [])
                    ret[item.type].push(item)
                    return ret
                }, {})
                Object.assign(this.dataMap, dataMap)
            } catch (e) {
                console.error(e)
            } finally {
                types.forEach(type => delete this.queryMap[type])
            }
        }, 500)
    }
}

export {OvService}
