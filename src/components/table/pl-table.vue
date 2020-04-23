<template>
    <div class="pl-table">
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
                plc: Object
            })
        ],
        props: {
            data: {type: Array},                                    // 显示的数据

            // theme
            size: {type: String, default: 'normal'},                // 表格尺寸
            border: {type: Boolean},                                // 是否带纵向边框
            stripe: {type: Boolean},                                // 是否为斑马纹table
            headRowHeight: {type: [String, Number], default: 40},   // 表头行高
            bodyRowHeight: {type: [String, Number], default: 32},   // 表体行高
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
            plcList() {
                if (!this.isMounted) return

                /*---------------------------------------计算列宽度-------------------------------------------*/

                // 总宽度
                const totalWidth = this.$el.offsetWidth
                // 额外的宽度（在iterate执行完之后得到真实值）
                let externalWidth = totalWidth
                // 填充宽度的列
                const fitPlcList: Plc[] = []
                // 填充宽度分配总份数
                let totalFits = 0

                // 列信息
                const plcList = formatPlcList(this.plc.children)
                // 展开的列信息，如果是分组表头，则取叶子节点
                let flatPlcList: Plc[] = []

                this.iterate(plcList, (plc) => {
                    if (!plc.group) {
                        flatPlcList.push(plc)
                        externalWidth = externalWidth - plc.props.width
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
                            fitPlc.props.width = fitPlc.props.width + externalWidth
                            externalWidth = 0
                        } else {
                            // 根据fit分配宽度
                            const newWidth = fitPlc.props.fit * fitBlockWidth + fitPlc.props.width
                            fitPlc.props.width = newWidth
                            externalWidth -= newWidth
                        }
                    })
                }

                /*---------------------------------------end-------------------------------------------*/

                return plcList
            },
            tableData() {
                return (this.data || []).map((row, rowIndex) => ({
                    row,
                    rowIndex,
                }))
            },
        },
        mounted() {
            // console.log(this.$plain.utils.deepcopy(this.plcList))
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
    @include themify {
        .pl-table {
            .plt-head {
                .plt-head-item {
                    background-color: #f8f8f8;

                    .plt-head-cell {
                        color: $ihc;
                        transition: background-color 500ms $transition;
                        font-weight: 500;
                        /*border-bottom: solid 1px black;*/
                        /*border-right: solid 1px black;*/

                        &:hover {
                            background-color: #e1e1e1;
                            cursor: pointer;
                        }
                    }
                }
            }

            .plt-body {
                .plt-body-item {
                    .plt-body-cell {
                        color: $itc;
                        font-size: 14px;

                    }
                }
            }

            .plt-cell {
                padding: 0 12px;
                box-sizing: border-box;
                font-size: 14px;

            }
        }
    }
</style>