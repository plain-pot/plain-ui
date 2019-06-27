import Vue from 'vue'
import deepmerge from 'deepmerge'
import {DEFAULT_URLS, DEFAULT_OPTION_PLAIN_TABLE_SERVICE, DEFAULT_OPTION_PUBLIC, DEFAULT_OPTION_PLAIN_TABLE, logOption} from "./plain-option-default";


const component = {
    data() {
        return {
            /*---------------------------------------baseTable属性-------------------------------------------*/
            showNum: null,                  //显示的行数
            bodyRowHeight: null,            //行高
            headRowHeight: null,            //表头行高
            noHeader: null,                 //是否不显示表头

            /*---------------------------------------业务属性-------------------------------------------*/
            context: null,                  //当前上下文
            module: null,                   //所属后台模块
            urls: null,                     //自定义请求地址
            loadOnStart: null,              //是否初始化的时候加载数据
            sortField: null,                //默认排序字段
            sortDesc: null,                 //默认排序方式
            pageSize: null,                 //页大小
            pageOption: null,               //页大小选项
            copyExcludeKey: null,           //复制行的时候，默认不复制的属性
            filters: null,                  //筛选参数
            parentOption: null,             //父表option
            map: null,                      //与父表联动的字段映射关系
            defaultNewRow: null,            //默认新行值
            defaultId: null,                //新建行时是否需要一个id
            forceLoadAfterParentChange: null,//默认情况下，option所属表格没有初始化的话，option是不查询数据的，即便option父表数据发生变化，如果父表变化，需要强制查询数据，请设置该属性为true

            list: [],                       //当前数据
            /*---------------------------------------不可配置属性-------------------------------------------*/
            page: null,                     //当前页
            total: null,                    //当前总数
            noMore: null,                   //数据是否已经加载完毕
            p_defaultOptionType: null,      //Option类型
            loading: null,                  //当前是否处于加载状态
            selectDataRow: null,            //当前选中的行数据
        }
    },
    computed: {
        p_urls() {
            return Object.keys(DEFAULT_URLS).reduce((ret, key) => {
                ret[key] = this.urls[key] || `${this.module}/${DEFAULT_URLS[key]}`
                return ret
            }, {})
        },
        totalPage() {
            if (!this.total || !this.noMore) return null
            return Math.ceil(this.total / this.pageSize)
        },
        showTotal() {
            if (this.noMore) return this.total
            return `${this.total - 1}+`
        },
    },
    methods: {

        /*---------------------------------------数据查询相关-------------------------------------------*/
        /**
         * 重新加载当前页数据
         * @author  韦胜健
         * @date    2019/6/20 14:53
         * @param   page            加载的页，没有的话就是当前页
         * @param   isReload        是否为重新加载数据
         */
        async load(page, isReload) {

            if (!!this.parentOption && !this.parentOption.selectDataRow) {
                this.page = 0
                this.list = []
                this.noMore = true
                this.$emit('load')
                return
            }

            page = page || this.page
            const param = this.getQueryParam()
            const pageSize = param.query.pageSize
            param.query.page = page
            const {ret} = await this.request(this.p_urls.queryPage, param)

            if (isReload || !this.noMore) {
                this.total = ret.length + ((page - 1) * pageSize)
                if (ret.length === pageSize + 1) {
                    ret.pop()
                    this.noMore = false
                } else {
                    this.noMore = true
                }
            } else {
                if (ret.length === pageSize + 1) {
                    ret.pop()
                }
            }

            this.list = ret
            this.page = param.query.page

            this.$emit('load')
        },
        /**
         * 回到第一页重新加载数据
         * @author  韦胜健
         * @date    2019/6/21 16:45
         */
        async reload() {
            return await this.load(1, true)
        },
        /**
         * 上一页
         * @author  韦胜健
         * @date    2019/6/21 17:26
         */
        async prevPage() {
            if (this.page === 1) return
            return await this.jumpPage(this.page - 1)
        },
        /**
         * 下一页
         * @author  韦胜健
         * @date    2019/6/21 17:26
         */
        async nextPage() {
            if (this.totalPage != null && this.page === this.totalPage) return
            return await this.jumpPage(this.page + 1)
        },
        /**
         * 跳转页
         * @author  韦胜健
         * @date    2019/6/21 17:26
         */
        async jumpPage(page) {
            if (page - 1 < 0) return
            if (this.totalPage != null && page > this.totalPage) {
                page = this.totalPage
            }
            page = page || this.page
            return await this.load(page)
        },
        /**
         * 修改页大小
         * @author  韦胜健
         * @date    2019/6/21 17:26
         */
        async changePageSize(size) {
            this.pageSize = size
            return await this.reload()
        },
        /**
         * 修改排序方式
         * @author  韦胜健
         * @date    2019/6/21 17:26
         */
        async changeSort({field, desc}) {
            this.sortField = field
            this.sortDesc = desc
            return await this.reload()
        },
        /**
         * 查询总数
         * @author  韦胜健
         * @date    2019/6/22 22:22
         */
        async queryCount() {
            if (this.noMore) return
            const param = this.getQueryParam()
            const {ret} = await this.request(this.p_urls.queryCount, param)
            this.total = ret
            this.noMore = true
        },
        /**
         * 获取分页查询参数
         * @author  韦胜健
         * @date    2019/6/21 16:45
         */
        getQueryParam() {
            /*option参数*/
            const ret = this.$plain.$utils.deepCopy(this.param) || {}
            const query = ret.query || {}
            /*页大小*/
            query.pageSize = this.pageSize
            /*排序*/
            if (!!this.sortField) {
                query.orders = query.orders || []
                query.orders.push({field: this.sortField, desc: this.sortDesc,})
            }
            /*筛选*/
            let filters = []
            //option筛选
            if (!!this.filters) filters = filters.concat(this.$plain.$utils.deepCopy(this.filters))
            //parent筛选
            if (!!this.parentOption) {
                const parentFilter = []
                Object.keys(this.map || {}).forEach(key => {
                    parentFilter.push({
                        field: key,
                        value: this.parentOption.selectDataRow.row[this.map[key]]
                    })
                })
                filters = filters.concat(parentFilter)
            }
            query.filters = filters

            ret.query = query
            return ret
        },
        /**
         * 获取新行数据，有时候在父子表关系下，开发者需要获取新行，可以通过这个函数获取
         * @author  韦胜健
         * @date    2019/6/27 19:16
         */
        async getNewRow() {
            const newRow = {}
            if (!!this.parentOption) {
                if (!this.parentOption.selectDataRow) return null
                Object.keys(this.map).forEach(key => newRow[key] = this.parentOption.selectDataRow.row[this.map[key]])
            }
            if (!!this.defaultNewRow) {
                switch (this.$plain.$utils.typeOf(this.defaultNewRow)) {
                    case 'object':
                        Object.assign(newRow, this.$plain.$utils.deepCopy(this.defaultNewRow))
                        break
                    case 'function':
                        const defaultNewRow = await this.defaultNewRow.apply(this.context, newRow)
                        if (!!defaultNewRow) Object.assign(newRow, defaultNewRow)
                        break
                }
            }
            if (!!this.defaultId) {
                const {ret} = await this.request(this.p_urls.defaultId)
                console.log(ret)
                newRow.id = ret
            }
            return newRow
        },

        /*---------------------------------------增删改-------------------------------------------*/
        async insert({row, editRow, index}) {
            if ((editRow.id + '').indexOf('uuid') > -1) delete editRow.id
            const {ret} = await this.request(this.p_urls.insert, editRow)
            return ret
        },
        async batchInsert(dataRows) {
            const rows = dataRows.map(({editRow}) => {
                const copyRow = this.$plain.$utils.deepCopy(editRow)
                if (copyRow.id.indexOf('uuid') > -1) delete copyRow.id
                return copyRow
            }).reverse()
            const {ret} = await this.request(this.p_urls.batchInsert, rows)
            return ret
        },
        async update({row, editRow, index}) {
            const {ret} = await this.request(this.p_urls.update, editRow)
            return ret
        },
        async batchUpdate(dataRows) {
            const rows = dataRows.map(({editRow}) => this.$plain.$utils.deepCopy(editRow))
            const {ret} = await this.request(this.p_urls.batchUpdate, rows)
            return ret
        },
        async delete({row, index}) {
            const {ret} = await this.request(this.p_urls.delete, row)
            return ret
        },

        /**
         * 打印option信息
         * @author  韦胜健
         * @date    2019/6/21 16:45
         */
        logOption() {
            logOption(this)
        },


        /**
         * 发送请求
         * @author  韦胜健
         * @date    2019/6/21 16:45
         */
        async request(url, param) {
            this.loading = true
            const data = await this.$http.post(url, param)
            this.loading = false
            return data
        },

        /*---------------------------------------不可使用函数-------------------------------------------*/
        /**
         * 加载默认的option
         * @author  韦胜健
         * @date    2019/6/20 14:30
         * @param   type            类型：plain，service
         */
        pl_loadDefaultOption(type = 'plain') {
            if (!!this.p_defaultOptionType) return
            this.p_defaultOptionType = type

            let defaultOption = deepmerge(this.$plain.$utils.deepCopy(DEFAULT_OPTION_PUBLIC), type === 'plain' ? DEFAULT_OPTION_PLAIN_TABLE : DEFAULT_OPTION_PLAIN_TABLE_SERVICE)
            // console.log(defaultOption)
            Object.keys(defaultOption).forEach(key => this[key] == null && (this[key] = defaultOption[key]))
        },
        /**
         * 处理选中行变化动作
         * @author  韦胜健
         * @date    2019/6/23 17:53
         */
        pl_changeSelectRow(dataRow) {
            this.selectDataRow = dataRow
            this.$emit('selectChange', dataRow)
        },
    },

}

class PlainOption extends Vue {
    constructor(sourceOption) {
        super(component);

        if (!sourceOption.context) {
            throw new Error('PlainOption：确实必输属性context')
        }

        this.sourceOption = sourceOption
        Object.assign(this, sourceOption)

        // this.$nextTick(() => this.logOption())

        if (!!this.parentOption) {
            this.parentOption.$on('selectChange', () => {
                console.log('parent selectChange')
                /*如果当前option所属表格没有并且没有强制查询数据，则直接返回*/
                if (!this.p_defaultOptionType && !this.forceLoadAfterParentChange) return
                this.reload()
            })
        }
    }
}

export default PlainOption
