<template>
    <div class="pl-base-table" :class="classes">
        <pl-base-table-column-controller @collect="pl_collect">
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
                @mouseenter.native="p_hover = 'body'"
                @scroll="e=>p_hover !== 'head' && !!$refs.head && $refs.head.$refs.scroll.setScroll({x: e.target.scrollLeft})"
                @scrollLeft="val=>p_scrollLeft = val"
                @scrollRight="val=>p_scrollRight = val"
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
                p_scrollLeft: false,                    //内容是否滑动到左端
                p_scrollRight: false,                   //内容是否滑动到右端
            }
        },
        watch: {
            data: {
                immediate: true,
                handler(newVal, oldVal) {
                    console.log('data change')
                    newVal = newVal || []
                    if (newVal !== oldVal) {
                        /*重新创建数据*/
                        this.p_data = newVal.reduce((ret, item, index) => {
                            ret.push(new RowData(item, index, this.id))
                            return ret
                        }, [])
                    } else {
                        // TODO 复用数据

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
                await this.pl_resetTableWidth()
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
                        this.p_sortField = this.p_initSortField || col.field
                        this.p_sortDesc = this.p_initSortDesc !== null ? this.p_initSortDesc : !this.p_sortDesc
                    }
                } else {
                    this.p_sortField = col.field
                    this.p_sortDesc = true
                }
                this.$emit('sortChange', {field: this.p_sortField, desc: this.p_sortDesc})
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
            },

            /*---------------------------------------其他操作函数-------------------------------------------*/
            /*
             *  重新计算表格宽度
             *  @author     martsforever
             *  @datetime   2019/5/18 22:58
             */
            async pl_resetTableWidth() {
                await this.$plain.nextTick()
                await this.$plain.nextTick()
                this.pl_resetHeadCols()
                this.pl_resetBodyCols()
                // this.p_tableWidth = this.$refs.body.$el.offsetWidth
                // console.log('this.p_headCols', this.p_headCols)
            },
        }
    }
</script>

<style lang="scss">
    @include themeWrap {
        .pl-base-table {
            background-color: rgba(0, 0, 0, 0.01);
            font-size: inherit;
            box-shadow: 0 0 12px 0 rgba(0, 0, 0, .1);


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