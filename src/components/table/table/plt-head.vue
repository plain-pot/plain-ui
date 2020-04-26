<template>
    <div class="plt-head" :style="styles" :class="classes">
        <pl-scroll scrollX :scrollY="false" ref="scroll" @scroll="onScroll">
            <plt-head-item/>
        </pl-scroll>
        <plt-head-item fixed="left"/>
        <plt-head-item fixed="right"/>
    </div>
</template>

<script lang="ts">

    import {TableComponentMixin, TableHoverPart} from "./table-utils";
    import {RefsMixinFactory} from "../../../utils/mixins";

    export default {
        name: "plt-head",
        provide() {
            return {
                pltHead: this,
            }
        },
        mixins: [
            TableComponentMixin,
            RefsMixinFactory({
                scroll: Object
            })
        ],
        created() {
            this.plTable.$on('scroll-left', this.onScrollLeft)
        },
        beforeDestroy() {
            this.plTable.$off('scroll-left', this.onScrollLeft)
        },
        computed: {
            styles() {
                return {
                    height: `${this.plTable.headRowHeight * this.headPlcList.length + 1}px`
                }
            },
            classes() {
                return {
                    'plt-head-border': !!this.plTable.border || (!!this.headPlcList && this.headPlcList.length > 1)
                }
            },
            headPlcList() {
                if (!this.plTable.plcList) return []

                // 最大表头层数
                let maxLevel = 1
                const plcList = this.plTable.plcList as any[];

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
        },
        methods: {
            refreshScroll() {
                this.scroll.refresh()
            },
            onScroll(e) {
                this.plTable.emitScrollLeft(e, TableHoverPart.head)
            },
            onScrollLeft(e, part) {
                if (part === TableHoverPart.body && this.plTable.hoverState.part === TableHoverPart.body) {
                    // console.log('scroll left', TableHoverPart.head)
                    this.scroll.scroll({x: e.target.scrollLeft})
                }
            },
        },
    }
</script>

<style lang="scss">

</style>