<template>
    <div class="pl-table" :class="classes">
        <plc-list ref="plc">
            <slot></slot>
        </plc-list>
        <plt-head ref="head"/>
        <plt-body ref="body"/>
    </div>
</template>

<script lang="ts">
    import {MountedMixin, RefsMixinFactory} from "../../utils/mixins";
    import {formatPlcList, Plc} from "./plc/plc-utils";

    export default {
        name: "pl-table",
        provide() {
            return {
                plTable: this,
            }
        },
        mixins: [
            MountedMixin,
            RefsMixinFactory({
                plc: Object,
                head: Object,
                body: Object,
            })
        ],
        props: {
            data: {type: Array},                                    // 显示的数据

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
        computed: {
            classes() {
                return {
                    'pl-table-border': this.border,
                }
            },
            totalContentWidth() {
                if (!this.bodyPlcList) return
                return this.bodyPlcList.reduce((ret, plc) => {
                    return ret + plc.props.width
                }, 0)
            },
            plcList() {
                if (!this.isMounted) return

                /*---------------------------------------计算列宽度-------------------------------------------*/

                // 额外的宽度（在iterate执行完之后得到真实值）
                let externalWidth = this.$el.offsetWidth
                // 填充宽度的列
                const fitPlcList: Plc[] = []
                // 填充宽度分配总份数
                let totalFits = 0

                // 列信息
                const plcList = formatPlcList(this.plc.items)
                // 展开的列信息，如果是分组表头，则取叶子节点
                let flatPlcList: Plc[] = []

                this.iterate(plcList, (plc) => {
                    if (!plc.group) {
                        flatPlcList.push(plc)
                        externalWidth = externalWidth - plc.originProps.width
                        if (!!plc.props.fit) {
                            totalFits += plc.props.fit
                            fitPlcList.push(plc)
                        }
                    }
                })

                if (externalWidth > 0) {
                    if (fitPlcList.length === 0) {
                        fitPlcList.push(flatPlcList[flatPlcList.length - 1])
                        totalFits = 1
                    }
                    const fitBlockWidth = Math.floor(externalWidth / totalFits)

                    fitPlcList.forEach((fitPlc, index) => {
                        if (index === fitPlcList.length - 1) {
                            // 如果是最后一个，用完剩下的宽度
                            fitPlc.props.width = fitPlc.originProps.width + externalWidth - 1
                            externalWidth = 0
                        } else {
                            // 根据fit分配宽度
                            const newWidth = fitPlc.props.fit * fitBlockWidth + fitPlc.originProps.width
                            fitPlc.props.width = newWidth
                            externalWidth -= newWidth
                        }
                    })
                }

                /*---------------------------------------end-------------------------------------------*/

                return plcList
            },
            bodyPlcList() {
                if (!this.plcList) return []
                const flatPlcList = []
                this.iterate(this.plcList, (plc) => {
                    if (!plc.group) {
                        flatPlcList.push(plc)
                    }
                })
                return flatPlcList
            },
            tableData() {
                return (this.data || []).map((row, rowIndex) => ({
                    row,
                    rowIndex,
                }))
            },
        },
        mounted() {
            this.unwatch = this.$watch('totalContentWidth', (newVal, oldVal) => {
                if (newVal !== oldVal) {
                    this.head.scroll.refresh()
                    this.body.scroll.refresh()
                }
            })
        },
        beforeDestroy() {
            if (!!this.unwatch) {
                this.unwatch()
            }
        },
        methods: {
            iterate(plcList: Plc[], handler: (plc: Plc) => void) {
                plcList.forEach(plc => {
                    handler(plc)
                    if (plc.group) {
                        this.iterate(plc.children, handler)
                    }
                })
            },
        },
    }
</script>

<style lang="scss">


    $tableHeadColor: rgba(0, 0, 0, 0.85);
    $tableHeadBackground: #f8f8f8;
    $tableHeadHoverBackground: #e1e1e1;
    $tableHeadBorder: solid 1px #e6e6e6;

    $tableBodyBorder: solid 1px #f0f0f0;
    $tableBodyColor: rgba(0, 0, 0, 0.65);

    @include themify {
        .pl-table {

            font-size: 12px;
            box-sizing: border-box;

            table {
                border-collapse: collapse;
            }

            .plt-head {
                color: $tableHeadColor;
                border-bottom: $tableHeadBorder;
                border-width: 0.5px;

                .plt-head-item {
                    background-color: $tableHeadBackground;

                    .plt-head-cell {
                        transition: background-color 500ms $transition;
                        font-weight: 500;
                        border-bottom: $tableHeadBorder;

                        &:hover {
                            background-color: $tableHeadHoverBackground;
                            cursor: pointer;
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

                .plt-body-item {
                    height: 100%;
                    width: 100%;

                    .plt-body-cell {
                        border-bottom: $tableBodyBorder;
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
                .plt-head {
                    border-bottom: none;
                }

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

        }
    }
</style>