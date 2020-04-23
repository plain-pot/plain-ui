<template>
    <div class="pl-table">
        <plc-list ref="plc">
            <slot></slot>
        </plc-list>
        <plt-head ref="head"/>
    </div>
</template>

<script lang="ts">
    import {MountedMixin, RefsMixinFactory} from "../../utils/mixins";
    import {formatPlcList} from "./plc/plc-utils";

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
            headRowHeight: {type: [String, Number], default: 40},   // 表头行高
            bodyRowHeight: {type: [String, Number], default: 32},   // 表体行高
            showRows: {type: Number},                               // 表格显示的行数，当表体的行数超过这个值时，将会出现表体内部滚动，这个属性实际上就是用来设值表格高度
            stripe: {type: Boolean},                                // 是否为斑马纹table
            border: {type: Boolean},                                // 是否带纵向边框
            size: {type: String, default: 'normal'},                // 表格尺寸
            hideHeader: {type: Boolean},                            // 是否隐藏表头
            disabledHighCurrentRow: {type: Boolean},                // 是否禁用高亮当前行
            currentRowKey: {type: String},                          // 当前行的key

            rowClassFunc: {type: Function},                         // 行 className 的计算函数
            rowStyleFunc: {type: Function},                         // 行 style内联样式的计算函数
            cellClassFunc: {type: Function},                        // 单元格 className 的计算函数
            cellStyleFunc: {type: Function},                        // 单元格 style 内联样式的计算函数
            headRowClassFunc: {type: Function},                     // 表头行 className 计算函数
            headRowStyleFunc: {type: Function},                     // 表头行 style 内联样式计算函数
            headCellClassFunc: {type: Function},                    // 表头单元格的 className 的计算函数
            headCellStyleFunc: {type: Function},                    // 表头单元格 style 内联样式计算函数

            rowKey: {type: String, Function},                       // 行数据的key，在多选行以及树形表格的情况下该属性必填
            emptyText: {type: String},                              // 空数据时显示的文本

            defaultExpandAll: {type: Boolean},                      // 是否默认展开所有行
            expandRowKeys: {type: Array},                           // 展开的行的key数组

            summaryData: {type: Array},                             // 表尾合计行数据
            summaryText: {type: String, default: '合计'},            // 表尾合计行第一列的文本

            rowspanFunc: {type: Function},                          // 合并行的方法
            colspanFunc: {type: Function},                          // 合并列的方法

            expandIndent: {type: Number, default: 16},              // 树节点的缩进
            lazy: {type: Boolean},                                  // 是否懒加载子节点数据
            isLeaf: {},
        },
        computed: {
            plcList() {
                if (!this.isMounted) return
                return formatPlcList(this.plc.children)
            },
            headPlcList() {
                if (!this.plcList) return null

                // 最大表头层数
                let maxLevel = 1
                const plcList = this.plcList as any[];

                // 计算最大层数
                const calculateLevel = (cols, level) => {
                    if (!!cols && cols.length > 0) {
                        if (level > maxLevel) maxLevel = level
                        cols.forEach((col) => {
                            col.level = level - 1
                            !!col.group && calculateLevel(col.children, level + 1)
                        })
                    }
                }
                calculateLevel(plcList, 1)

                // 计算多级表头每个单元格所占行数以及列数
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
                plcList.forEach(plc => calculateSpan(plc))

                // 计算结果
                const headCols = []
                for (let j = 0; j < maxLevel; j++) headCols.push([])
                // 收集多级表头渲染数据
                const calculateHeadColumns = (cols) => {
                    if (!!cols && cols.length > 0) {
                        cols.forEach((col) => {
                            headCols[col.level].push(col)
                            !!col.group && calculateHeadColumns(col.children)
                        })
                    }
                }
                calculateHeadColumns(plcList)

                return headCols
            },
            bodyPlcList() {

            },
        },
        mounted() {
        },
    }
</script>

<style lang="scss">

</style>