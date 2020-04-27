<template>
    <div class="pl-table" :class="classes" @mouseleave="onMouseleaveTable">
        <plc-list ref="plc">
            <slot></slot>
        </plc-list>
        <plt-head ref="head"/>
        <plt-body ref="body"/>
    </div>
</template>

<script lang="ts">

    import {EmitMixin, RefsMixinFactory} from "../../utils/mixins";
    import {formatPlcList, refreshPlcWidth} from "./plc/plc-process";
    import {TableHoverPart} from "./table/table-utils";
    import {PlcFixedType} from "./plc/plc-utils";

    export default {
        name: "pl-table",
        provide() {
            return {
                plTable: this,
            }
        },
        mixins: [
            EmitMixin,
            RefsMixinFactory({
                plc: Object,
                head: Object,
                body: Object,
            })
        ],
        emitters: {
            emitScroll: Function,
            emitScrollLeft: Function,
            emitHoverChange: Function,
            emitCurrentChange: Function,
            emitClickRow: Function,
        },
        props: {
            data: {type: Array},                                    // 显示的数据
            virtual: {type: Boolean, default: true},                // 虚拟滚动

            // theme
            size: {type: String, default: 'normal'},                // 表格尺寸
            border: {type: Boolean},                                // 是否带纵向边框
            stripe: {type: Boolean},                                // 是否为斑马纹table
            headRowHeight: {type: [String, Number], default: 40},   // 表头行高
            bodyRowHeight: {type: [String, Number], default: 36},   // 表体行高
            hideHeader: {type: Boolean},                            // 是否隐藏表头
            showRows: {type: Number, default: 10},                  // 表格显示的行数，当表体的行数超过这个值时，将会出现表体内部滚动，这个属性实际上就是用来设值表格高度
            emptyText: {type: String},                              // 空数据时显示的文本

            // class style
            rowClassFunc: {type: Function},                         // 行 className 的计算函数
            rowStyleFunc: {type: Function},                         // 行 style内联样式的计算函数
            cellClassFunc: {type: Function},                        // 单元格 className 的计算函数
            cellStyleFunc: {type: Function},                        // 单元格 style 内联样式的计算函数
            headRowClassFunc: {type: Function},                     // 表头行 className 计算函数
            headRowStyleFunc: {type: Function},                     // 表头行 style 内联样式计算函数
            headCellClassFunc: {type: Function},                    // 表头单元格的 className 的计算函数
            headCellStyleFunc: {type: Function},                    // 表头单元格 style 内联样式计算函数
            rowspanFunc: {type: Function},                          // 合并行的方法
            colspanFunc: {type: Function},                          // 合并列的方法

            // row data
            rowKey: {type: String, Function},                       // 行数据的key，在多选行以及树形表格的情况下该属性必填
            currentRowKey: {type: String},                          // 当前行的key
            disabledHighCurrentRow: {type: Boolean},                // 是否禁用高亮当前行

            // 合计行
            summaryData: {type: Array},                             // 表尾合计行数据
            summaryText: {type: String, default: '合计'},            // 表尾合计行第一列的文本
        },
        data() {

            const hoverState: {
                part: TableHoverPart,
                fixed: PlcFixedType
            } = {
                part: TableHoverPart.body,
                fixed: PlcFixedType.center,
            }

            return {
                isMounted: false,                                   // 当前组件dom是否已经挂载
                hoverState,                                         // 鼠标的hover状态
                hoverRow: null,                                     // 当前鼠标悬浮所在的行
                currentRowOrKey: null,                              // 当前选中行
            }
        },
        mounted() {
            this.unwatch = this.$watch('totalContentWidth', (newVal, oldVal) => {
                if (newVal !== oldVal) {
                    this.head.refreshScroll()
                    this.body.refreshScroll()
                }
            })
            this.$nextTick(() => this.isMounted = true)
            window.addEventListener('resize', this.refreshPlcWidth)
        },
        beforeDestroy() {
            this.unwatch()
            window.removeEventListener('resize', this.refreshPlcWidth)
        },
        computed: {
            /**
             * 根节点样式
             * @author  韦胜健
             * @date    2020/4/24 18:34
             */
            classes() {
                return {
                    'pl-table-border': this.border,
                    'pl-table-disabled-high-current': this.disabledHighCurrentRow,
                }
            },
            /**
             * 总的列宽度
             * @author  韦胜健
             * @date    2020/4/24 18:35
             */
            totalContentWidth() {
                if (!this.bodyPlcList) return
                return this.bodyPlcList.reduce((ret, plc) => {
                    return ret + plc.actualProps.width
                }, 0)
            },
            formatPlcList() {
                if (!this.isMounted) return
                // console.log('this.plc.items', this.$plain.utils.deepcopy(this.plc.items))
                // console.log('ret', this.$plain.utils.deepcopy(ret))
                // console.log('formatPlcList')
                return formatPlcList(this.plc.items, {
                    totalWidth: this.$el.offsetWidth
                })
            },
            /**
             * 列信息数组
             * @author  韦胜健
             * @date    2020/4/24 18:35
             */
            plcList() {
                if (!this.formatPlcList) return
                return this.formatPlcList.plcList
            },
            /**
             * 表体列信息数组
             * @author  韦胜健
             * @date    2020/4/24 18:35
             */
            bodyPlcList() {
                if (!this.formatPlcList) return
                return this.formatPlcList.flatPlcList
            },
            /**
             * 表格数据格式化
             * @author  韦胜健
             * @date    2020/4/24 18:35
             */
            tableData() {
                return (this.data || []).map((row, rowIndex) => ({
                    row,
                    rowIndex,
                }))
            },
            /**
             * 表格合计行数据格式化
             * @author  韦胜健
             * @date    2020/4/24 18:35
             */
            tableSummaryData() {
                return (this.summaryData || []).map((row, rowIndex) => ({
                    row,
                    rowIndex,
                }))
            },
            /**
             * 是否禁用虚拟滚动
             * @author  韦胜健
             * @date    2020/4/24 18:36
             */
            isDisabledVirtualScroll() {
                return !this.virtual
            },
        },
        methods: {
            /*---------------------------------------metthods-------------------------------------------*/
            /**
             * 重新计算列宽
             * @author  韦胜健
             * @date    2020/4/25 11:18
             */
            refreshPlcWidth() {
                refreshPlcWidth(this.plcList, this.$el.offsetWidth)
            },

            /*---------------------------------------handler-------------------------------------------*/
            /**
             * 鼠标进入表格的某一部分的时候的处理动作
             * @author  韦胜健
             * @date    2020/4/27 15:39
             */
            onHoverPart(part: TableHoverPart, fixed: PlcFixedType) {
                this.hoverState.part = part
                this.hoverState.fixed = fixed
            },
            /**
             * 鼠标离开表格的处理动作
             * @author  韦胜健
             * @date    2020/4/27 15:43
             */
            onMouseleaveTable() {
                this.hoverRow = null
            },
            /*---------------------------------------row handler-------------------------------------------*/
            /**
             * 鼠标进入某一行的处理动作
             * @author  韦胜健
             * @date    2020/4/27 15:43
             */
            onHoverRow(rowData) {
                this.hoverRow = rowData
                this.emitHoverChange(rowData)
            },
            /**
             * 鼠标单击行的处理动作
             * @author  韦胜健
             * @date    2020/4/27 16:01
             */
            onClickRow(rowData) {
                this.currentRowOrKey = rowData
                this.emitCurrentChange(rowData)
                this.emitClickRow(rowData)
            },
        },
    }
</script>

<style lang="scss">

    @include themify {

        $tableHeadColor: rgba(0, 0, 0, 0.85);
        $tableHeadBackground: #f8f8f8;
        $tableHeadHoverBackground: #e1e1e1;
        $tableHeadBorder: solid 1px #e6e6e6;

        $tableBodyBorder: solid 1px #f0f0f0;
        $tableBodyColor: rgba(0, 0, 0, 0.65);

        $tableRowHoverBackground: #eaeaea;
        $tableRowCurrentBackground: rgba($colorPrimary, 0.1);

        .pl-table {

            font-size: 12px;
            box-sizing: border-box;

            table {
                border-collapse: collapse;
            }

            .pl-vertical-scrollbar {
                z-index: 1;
                opacity: 1 !important;
            }

            .pl-horizontal-scrollbar {
                z-index: 3;
                opacity: 1 !important;
            }

            .pl-table-item-fixed-right, .pl-table-item-fixed-left {
                position: absolute;
                top: 0;
                box-shadow: $boxshadow;
                z-index: 2;

                &.pl-table-item-fixed-left {
                    left: 0;
                }

                &.pl-table-item-fixed-right {
                    right: 0;
                }
            }


            .plt-head {
                color: $tableHeadColor;
                position: relative;
                overflow: hidden;
                border-bottom: $tableHeadBorder;
                border-width: 0.5px;

                .plt-head-item {
                    background-color: $tableHeadBackground;
                    height: 100%;

                    & > table {
                        height: 100%;
                    }

                    .plt-head-cell {
                        transition: background-color 500ms $transition;
                        font-weight: 500;
                        border-bottom: $tableBodyBorder;
                        position: relative;

                        .plt-head-cell-indicator {
                            position: absolute;
                            top: 0;
                            bottom: 0;
                            width: 6px;
                            right: 0;
                            content: '';
                            background-color: rgba(black, 0.1);
                            cursor: ew-resize;
                            opacity: 0;
                            transition: opacity 500ms $transition;
                            z-index: 1;
                        }

                        &:hover {
                            background-color: $tableHeadHoverBackground;
                            cursor: pointer;

                            .plt-head-cell-indicator {
                                opacity: 1;
                            }
                        }
                    }
                }

                &.plt-head-border {
                    .plt-cell {
                        border: $tableHeadBorder;
                    }
                }
            }

            .plt-body {
                color: $tableBodyColor;
                position: relative;
                overflow: hidden;

                .plt-body-item {
                    height: 100%;
                    width: 100%;
                    background-color: white;

                    .plt-body-cell {
                        border-bottom: $tableBodyBorder;
                    }

                    .plt-row {
                        transition: all 500ms $transition;

                        &.plt-row-hover, &:hover {
                            background-color: $tableRowHoverBackground;
                        }

                    }
                }
            }

            .plt-cell {
                padding: 0 12px;
                box-sizing: border-box;

                &.plt-cell-align-left {
                    text-align: left;
                }

                &.plt-cell-align-center {
                    text-align: center;
                }

                &.plt-cell-align-right {
                    text-align: right;
                }
            }

            &.pl-table-border {

                .plt-body {
                    border-bottom: $tableBodyBorder;
                    border-width: 0.5px;

                    .plt-body-item {
                        .plt-cell {
                            border: $tableBodyBorder;
                        }

                        .plt-row {
                            &:last-child {
                                .plt-cell {
                                    border-bottom: none;
                                }
                            }
                        }
                    }
                }
            }

            &:not(.pl-table-disabled-high-current) {
                .plt-row-current {
                    background-color: $tableRowCurrentBackground;
                }
            }

        }

        .pl-virtual-table {
            height: 100%;
            width: 100%;
            overflow: hidden;
            position: relative;

            table {
                border-collapse: collapse;

                &:after {
                    content: '';
                    display: inline-block;
                    height: 12px;
                    width: 100%;
                }
            }

            .pl-virtual-table-summary-table {
                position: absolute;
                bottom: 0;
                left: 0;
                background-color: $tableHeadBackground;
            }
        }
    }
</style>