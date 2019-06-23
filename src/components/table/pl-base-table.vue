<template>
    <div class="pl-base-table" :class="classes" @mouseleave="pl_mouseleave">
        <pl-base-table-column-controller @collect="pl_collect">
            <pl-tc-index :page="page" :pageSize="pageSize" v-if="index"/>
            <pl-tc-pick ref="pick" :data="p_data" v-if="p_selected"/>
            <slot></slot>
        </pl-base-table-column-controller>
        <pl-base-table-head
                v-if="!noHeader"
                ref="head"
                :fixed-exist="p_fixedExist"
                :head-columns="p_headCols"
                :body-columns="p_bodyCols"
                :sort-field="p_sortField"
                :sort-desc="p_sortDesc"
                :head-row-height="headRowHeight"
                @mouseenter.native="p_hover = 'head'"
                @scroll="e=>p_hover === 'head' && $refs.body.$refs.center[0].$refs.scroll.setScroll({x: e.target.scrollLeft})"
        />
        <pl-base-table-body
                ref="body"
                :data="p_data"
                :body-columns="p_bodyCols"
                :fixed-exist="p_fixedExist"
                :body-row-height="bodyRowHeight"
                :show-num="showNum"
                :hover-index="p_hoverIndex"
                @mouseenter.native="p_hover = 'body'"
                @scroll="e=>p_hover !== 'head' && !!$refs.head && $refs.head.$refs.scroll.setScroll({x: e.target.scrollLeft})"
                @scrollLeft="val=>p_scrollLeft = val"
                @scrollRight="val=>p_scrollRight = val"

                @click="pl_clickRow"
                @dblclick="pl_dblClickRow"
                @mouseenter="pl_mouseenterRow"
        />

    </div>
</template>

<script>
    import PlBaseTableColumnController from "./pl-base-table-column-controller";
    import {RowData, TableMixin} from "./index";
    import PlBaseTableHead from "./pl-base-table-head";
    import PlBaseTableBody from "./pl-base-table-body";

    export default {
        name: "pl-base-table",
        components: {PlBaseTableBody, PlBaseTableHead, PlBaseTableColumnController},
        mixins: [TableMixin],
        props: {
            beforeConfig: {type: Function},
            config: {type: Function},
            id: {type: String, required: true},
            clickRow: {type: Function},
            dblclickRow: {type: Function},
            mouseenterRow: {type: Function},

            page: {type: Number, default: 1},
            pageSize: {type: Number, default: 0},
            index: {type: Boolean, default: true},
        },
        data() {
            return {
                p_data: [],                             //缓存数据
                p_originCols: [],                       //原始列数据信息
                p_cols: [],                             //处理好的列数据信息
                p_headCols: [],                         //表头列信息
                p_bodyCols: [],                         //表体列信息

                p_tableWidth: null,                     //表格宽度
                p_sortField: this.sortField,            //排序字段
                p_sortDesc: this.sortDesc,              //排序方式，先序降序
                p_initSortField: this.sortField,        //初始的时候的排序字段
                p_initSortDesc: this.sortDesc,          //初始的时候的排序方式

                p_hover: null,                          //鼠标是否覆盖在表格上
                p_hoverIndex: null,                     //鼠标悬浮所在行索引
                p_scrollLeft: false,                    //内容是否滑动到左端
                p_scrollRight: false,                   //内容是否滑动到右端
                p_selected: false,                      //当前是否处于多选状态
            }
        },
        watch: {
            data: {
                immediate: true,
                handler(newVal, oldVal) {
                    // console.log('data change')
                    newVal = newVal || []
                    if (newVal !== oldVal) {
                        /*重新创建数据*/
                        this.p_data = newVal.reduce((ret, item, index) => {
                            const rowData = new RowData(item, index, this.id)
                            this.pl_reactiveData(rowData)
                            ret.push(rowData)
                            return ret
                        }, [])
                    } else {
                        // TODO 复用数据
                        const p_data = []
                        newVal.forEach((newItem, index) => {
                            const oldOne = this.$plain.$utils.findOne(this.p_data, i => i.row === newItem)
                            if (!!oldOne) {
                                oldOne.index = index
                                p_data.push(oldOne)
                            } else {
                                const rowData = new RowData(newItem, index, this.id)
                                this.pl_reactiveData(rowData)
                                p_data.push(rowData)
                            }
                        })
                        this.p_data = p_data
                    }
                },
            },
            sortField(val) {
                this.p_sortField = val
            },
            sortDesc(val) {
                this.p_sortDesc = val
            },
        },
        created() {
            this.$on('clickTitle', this.pl_clickTitle)
        },
        computed: {
            classes() {
                return {
                    'pl-base-table-fit-parent': this.fitParent,
                    'pl-base-table-left-shadow': !this.p_scrollLeft,
                    'pl-base-table-right-shadow': !this.p_scrollRight,
                }
            },
            /*
            *  判断左右表格是否应该存在
            *  @author     martsforever
            *  @datetime   2019/1/6 21:52
            */
            p_fixedExist() {
                if (!this.p_cols) return {}
                const ret = {left: false, center: false, right: false}
                this.p_cols.forEach(col => Object.keys(ret).forEach(position => !ret[position] && (ret[position] = col.fixed === position)))
                // console.log('==>>', ret)
                return ret
            },
        },
        methods: {
            /*---------------------------------------可用函数-------------------------------------------*/
            /*编辑相关*/
            /**
             * 开启编辑功能
             * @author  韦胜健
             * @date    2019/5/27 20:47
             */
            enableEdit({item, index} = {}) {
                this.pl_iterateData({item, index}, (sub) => sub.editable = true)
            },
            /**
             * 关闭编辑功能
             * @author  韦胜健
             * @date    2019/5/27 20:48
             */
            disableEdit({item, index} = {}) {
                this.pl_iterateData({item, index}, (sub) => sub.editable = false)
            },
            /**
             * 保存编辑，将editRow的变化保存到row中
             * @author  韦胜健
             * @date    2019/5/27 20:48
             */
            saveEdit({item, index} = {}) {
                this.pl_iterateData({item, index}, (sub) => {
                    Object.keys(sub.editRow).forEach(key => this.$set(sub.row, key, sub.editRow[key]))
                })
            },
            /**
             * 取消编辑，将editRow中的数据还原为row中的数据
             * @author  韦胜健
             * @date    2019/5/27 20:48
             */
            cancelEdit({item, index} = {}) {
                this.pl_iterateData({item, index}, (sub) => {
                    Object.keys(sub.editRow).forEach(key => this.$set(sub.editRow, key, sub.row[key]))
                })
            },
            /**
             * 获取编辑数据，如果校验不通过，则返回promise.reject
             * @author  韦胜健
             * @date    2019/5/27 11:53
             */
            async getEditData() {
                const {editData, validRet} = this.validData()
                if (!validRet) return Promise.resolve(editData.map(item => item.rowData))
                else {
                    this.$dialog.show({
                        type: 'error',
                        message: `${validRet.title}：${validRet.msg}`
                    })
                    return Promise.reject(validRet)
                }
            },

            /*校验相关*/
            /**
             * 获取数据，同时校验数据
             * @author  韦胜健
             * @date    2019/5/27 11:53
             */
            validData() {
                /*获取处于编辑的行的index数组*/
                const editData = this.p_data.reduce((ret, item, index) => {
                    if (!!item.editable) {
                        ret.push({
                            rowData: item,
                            index,
                        })
                    }
                    return ret
                }, [])

                /*获取处于编辑的行TableRow组件实例*/
                const editIndexList = editData.map(item => item.index)
                const tableRows = this.$plain.$dom.findComponentsDownward(this, (com) => com.$options.name === 'pl-base-table-row' && editIndexList.indexOf(com.index) > -1)

                /*校验*/
                let validRet;
                tableRows.forEach(tableRow => {
                    const tableCells = this.$plain.$dom.findComponentsDownward(tableRow, (com) => com.$options.name === 'pl-base-table-cell' && !!com.p_editable)
                    tableCells.forEach(cell => {
                        const {isValid, validMsg} = this.$plain.$valid.valid(cell)
                        if (isValid === false) {
                            !validRet && (validRet = {
                                'rowIndex': tableRow.index,
                                'title': cell.col.title,
                                'field': cell.col.field,
                                msg: validMsg,
                            })
                        }
                    })
                })
                return {editData, validRet}
            },

            /*获取选择数据*/
            /**
             * 开启选择功能
             * @author  韦胜健
             * @date    2019/5/27 20:49
             */
            async startSelected() {
                if (!!this.p_selected) return
                this.p_selected = true
                await this.$plain.nextTick()
            },
            /**
             * 关闭选择功能
             * @author  韦胜健
             * @date    2019/5/27 20:49
             */
            async finishSelected() {
                if (!this.p_selected) return
                this.p_selected = false
                await this.$plain.nextTick()
            },
            /**
             * 获取选择的数据，需要先【开启选择功能】
             * @author  韦胜健
             * @date    2019/5/27 20:49
             */
            getSelected() {
                return new Promise((rs, rj) => {
                    if (!this.p_selected) {
                        const msg = '请先调用startSelected开启选择状态'
                        console.error(msg)
                        rj(msg)
                        return
                    }
                    const dataRows = this.$refs.pick.getSelected()
                    if (dataRows.length === 0) {
                        const msg = '请至少选择一行数据'
                        this.$dialog.show(msg)
                        rj(msg)
                    }
                    rs(dataRows)
                })
            },
            /**
             * 高亮选中行
             * @author  韦胜健
             * @date    2019/6/23 16:50
             */
            selectRow({id, index}) {
                let selectRow;
                this.p_data.forEach((data, i) => {
                    const flag = data.id === id || index === i
                    data.check = flag
                    if (flag) selectRow = data
                })
                this.$emit('selectRow', selectRow)
            },
            /**
             * （复选框）选中行
             * @author  韦胜健
             * @date    2019/6/23 16:50
             */
            checkRow({id, index}) {
                if (!this.$refs.pick) {
                    console.warn('请先开启选择状态')
                    return
                }
                this.$refs.pick.checkRow({id, index})
            },
            /**
             * （复选框）取消选中行
             * @author  韦胜健
             * @date    2019/6/23 16:51
             */
            uncheckRow({id, index}) {
                if (!this.$refs.pick) {
                    console.warn('请先开启选择状态')
                    return
                }
                this.$refs.pick.uncheckRow({id, index})
            },

            /*---------------------------------------事件处理-------------------------------------------*/
            /*
             *  收集列信息
             *  @author     martsforever
             *  @datetime   2019/5/18 23:24
             */
            async pl_collect(cols) {
                /*等待属性变化完成*/
                await this.$plain.nextTick()
                /*原始列信息*/
                this.p_originCols = this.pl_colsCopy(cols)

                /*配置列之前处理动作*/
                !!this.beforeConfig && this.beforeConfig(cols, this.pl_colsIterate)

                /*配置列*/
                this.pl_colsIterate(cols, (col, group, cols) => {
                    if (col.disabledConfig) return
                    !!this.config && this.config(col, group, cols)
                    if (col.hide) cols.splice(cols.indexOf(col), 1)
                })

                /*---------------------------------------排序-------------------------------------------*/
                /*递归遍历子节点，如果是多级表头，则对子列进行插入排序(因为可能会在上一步配置列中修改order排序，所以上一步递归结束之后才能进行排序操作)*/
                this.pl_colsIterate(cols, (col, group) => {
                    if (!!group && !!col.children && col.children.length > 0) {
                        /*列组的话，设置子节点的fixed值为父节点的fixed值*/
                        col.children.forEach(item => item.fixed = col.fixed)
                        this.$plain.$utils.insertSort(col.children, this.pl_colsOrder)
                    }
                })
                /*对最外层列或者列组进行插入排序*/
                this.$plain.$utils.insertSort(cols, this.pl_colsOrder);

                /*cols是已经处理好的，树状结构的列数据信息数组*/
                this.p_cols = cols
                this.$emit('collect', this.p_cols)
                this.p_data.forEach(rowData => this.pl_reactiveData(rowData))
                await this.pl_resetTableWidth()
                // console.log(this.p_cols)
            },
            /*
             *  处理点击标题排序变化事件
             *  @author     martsforever
             *  @datetime   2019/5/24 21:06
             */
            pl_clickTitle({col}) {
                if (!col.sort || col.group) return
                if (this.p_sortField === col.field) {
                    if (!!this.p_sortDesc) {
                        this.p_sortDesc = false
                    } else {
                        this.p_sortField = this.p_initSortField
                        this.p_sortDesc = this.p_initSortDesc
                    }
                } else {
                    this.p_sortField = col.field
                    this.p_sortDesc = true
                }
                this.$emit('sortChange', {field: this.p_sortField, desc: this.p_sortDesc})
            },
            /*
             *  处理点击行
             *  @author     martsforever
             *  @datetime   2019/5/25 12:10
             */
            pl_clickRow({item, index, e}) {
                this.$emit('clickRow', {item, index, e})
                if (!!this.clickRow) {
                    this.clickRow({item, index})
                } else {
                    this.selectRow({id: item.id})
                }
            },
            /*
             *  处理双击行
             *  @author     martsforever
             *  @datetime   2019/5/25 12:11
             */
            pl_dblClickRow({item, index, e}) {
                this.$emit('dblclickRow', {item, index, e})
            },
            /*
             *  处理鼠标滑过行
             *  @author     martsforever
             *  @datetime   2019/5/25 12:11
             */
            pl_mouseenterRow({item, index, e}) {
                this.$emit('mouseenterRow', {item, index, e})
                if (!!this.mouseenterRow) {
                    this.mouseenterRow({item, index, e})
                    return
                }
                if (this.p_hoverIndex != null) this.p_data[this.p_hoverIndex].hover = false
                this.p_hoverIndex = index
                this.p_data[this.p_hoverIndex].hover = true
            },
            /**
             * 鼠标离开表格
             * @author  韦胜健
             * @date    2019/5/27 18:39
             */
            pl_mouseleave() {
                if (this.p_hoverIndex != null) this.p_data[this.p_hoverIndex].hover = false
                this.p_hoverIndex = null
            },

            /*---------------------------------------列收集相关函数-------------------------------------------*/
            /**
             * 复制columns
             * @author  韦胜健
             * @date    2019/2/20 16:13
             */
            pl_colsCopy(cols) {
                const ret = []
                if (!cols || cols.length === 0) return ret
                for (let i = 0; i < cols.length; i++) {
                    const col = cols[i];
                    if (col.group) col.children = this.pl_colsCopy(col.children)
                    ret.push(col)
                }
                return ret
            },
            /**
             * 递归遍历所有列以及列组
             * @author  韦胜健
             * @date    2019/2/20 09:45
             */
            pl_colsIterate(cols, fn) {
                if (!cols || cols.length === 0) return
                for (let i = 0; i < cols.length; i++) {
                    const col = cols[i];
                    const beforeLength = cols.length
                    !!fn && fn(col, !!col.group, cols)
                    const afterLength = cols.length
                    i -= (afterLength - beforeLength)
                    if (!!col.group) this.pl_colsIterate(col.children, fn)
                }
            },
            /*
             *  列排序判断函数
             *  @author     martsforever
             *  @datetime   2019/5/18 22:50
             */
            pl_colsOrder(a, b) {
                const aOrder = a.order + (a.fixed === 'left' ? 999 : a.fixed === 'right' ? -999 : 0)
                const bOrder = b.order + (b.fixed === 'left' ? 999 : b.fixed === 'right' ? -999 : 0)
                return aOrder < bOrder
            },
            /*
             *  重新计算表格宽度
             *  @author     martsforever
             *  @datetime   2019/5/18 22:58
             */
            async pl_resetTableWidth() {
                await this.$plain.nextTick()
                await this.$plain.nextTick()

                /*计算表格宽度*/
                this.p_tableWidth = null
                let el = this.$el
                while (!this.p_tableWidth && !!el.parentNode) {
                    // console.log(el)
                    if (el.offsetWidth > 0) {
                        this.p_tableWidth = el.scrollWidth
                    } else {
                        el = el.parentNode
                    }
                }

                this.pl_resetHeadCols()
                this.pl_resetBodyCols()
            },
            /*
             *  计算表头列数据
             *  @author     martsforever
             *  @datetime   2019/5/18 23:01
             */
            pl_resetHeadCols() {
                /*多级表头最大层数*/
                let maxLevel = 1;
                let p_cols = this.pl_colsCopy(this.p_cols)

                /*计算最大层数*/
                const calculateLevel = (cols, level) => {
                    if (!!cols && cols.length > 0) {
                        if (level > maxLevel) maxLevel = level
                        cols.forEach((col) => {
                            col.level = level - 1
                            !!col.group && calculateLevel(col.children, level + 1)
                        })
                    }
                }
                calculateLevel(p_cols, 1)

                /*计算多级表头每个单元格所占行数以及列数*/
                const calculateSpan = (col) => {
                    if (!!col.group) {
                        col.children.forEach(item => calculateSpan(item))
                        col.rowspan = 1
                        col.colspan = 0
                        col.children.forEach(item => col.colspan += item.colspan)
                    } else {
                        col.rowspan = maxLevel - col.level
                        col.colspan = 1
                    }
                }
                p_cols.forEach(i => calculateSpan(i))
                const headCols = []
                for (let j = 0; j < maxLevel; j++) headCols.push([])
                /*收集多级表头渲染数据*/
                const calculateHeadColumns = (cols) => {
                    if (!!cols && cols.length > 0) {
                        cols.forEach((col) => {
                            headCols[col.level].push(col)
                            !!col.group && calculateHeadColumns(col.children)
                        })
                    }
                }
                calculateHeadColumns(p_cols)
                this.p_headCols = headCols
            },
            /*
             *  计算表体列数据
             *  @author     martsforever
             *  @datetime   2019/5/18 23:02
             */
            pl_resetBodyCols() {
                /*收集渲染的列*/
                const cols = []
                this.pl_colsIterate(this.p_cols, (col, group) => !group && cols.push(col))
                this.p_bodyCols = cols
                this.pl_resetFitWidth()
            },
            pl_resetFitWidth() {
                let totalColWidth = this.p_bodyCols.reduce((ret, item) => ret + item.width, 0)
                if (totalColWidth < this.p_tableWidth) {
                    let externalWidth = this.p_tableWidth - totalColWidth
                    let totalColFit = this.p_bodyCols.reduce((ret, item) => ret + item.fit, 0)
                    if (totalColFit === 0) {
                        for (let i = this.p_bodyCols.length - 1; i >= 0; i--) {
                            const col = this.p_bodyCols[i]
                            if (col.fixed !== 'left' && col.fixed !== 'right') {
                                col.fit = 1
                                break
                            }
                        }
                        totalColFit = 1
                    }
                    let externalChunkWidth = Math.floor(externalWidth / totalColFit) - 1
                    let externalChunkWidthChip = externalWidth - externalChunkWidth * totalColFit
                    let isFirstFit = true
                    this.p_bodyCols.forEach(col => {
                        let ew
                        if (isFirstFit && col.fit > 0) {
                            ew = Math.floor(col.fit * externalChunkWidth) + externalChunkWidthChip
                            isFirstFit = false
                        } else {
                            ew = Math.floor(col.fit * externalChunkWidth)
                        }
                        col.width = this.$plain.$utils.removePx(col.width) + ew
                    })
                }
            },

            /*---------------------------------------其他操作函数-------------------------------------------*/
            /*
             *  遍历数据
             *  @author     martsforever
             *  @datetime   2019/5/25 12:09
             */
            pl_iterateData({item, index}, func) {
                if (!item && index == null) {
                    this.p_data.forEach((sub, subIndex) => func(sub, subIndex))
                } else {
                    if (index == null) {
                        index = this.p_data.indexOf(item)
                    }
                    func(this.p_data[index], index)
                }
            },
            /**
             * 响应式格式化数据
             * @author  韦胜健
             * @date    2019/5/27 16:59
             */
            pl_reactiveData(rowData) {
                if (!this.p_cols || this.p_cols.length === 0) return
                this.p_cols.forEach(col => {
                    this.$set(rowData.row, col.field, rowData.row[col.field])
                    this.$set(rowData.editRow, col.field, rowData.editRow[col.field])
                })
            },
        }
    }
</script>

<style lang="scss">
    @include themeWrap {
        .pl-base-table {
            border: solid 1px plVar(colorBorder);
            border-radius: plVar(borderFillet);
            font-size: inherit;

            .pl-scroll-horizontal-indicator {
                z-index: 1;
            }

            &:hover {
                .pl-scroll-horizontal-indicator, .pl-scroll-vertical-indicator {
                    opacity: 1;
                }
            }

            &.pl-base-table-fit-parent {
                height: 100%;
                display: flex;
                flex-direction: column;

                .pl-base-table-body {
                    flex: 1;

                    .pl-base-table-body-item {
                        height: 100% !important;
                    }
                }
            }

            &.pl-base-table-left-shadow {
                .pl-base-table-body-item-left, .pl-base-table-head-item-left {
                    box-shadow: 0 0 10px rgba(black, 0.12);
                }
            }

            &.pl-base-table-right-shadow {
                .pl-base-table-body-item-right, .pl-base-table-head-item-right {
                    box-shadow: 0 0 10px rgba(black, 0.12);
                }
            }
        }
    }
</style>
