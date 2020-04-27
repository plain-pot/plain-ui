<template>
    <pl-item tag="tr"
             class="plt-row"
             :class="classes"
             @mouseenter.native="onMouseenter"
             @click.native="onClick">
        <plt-body-cell v-for="(plc,plcIndex) in plTable.bodyPlcList" :key="plcIndex" :plc="plc" :rowData="rowData"/>
    </pl-item>
</template>

<script>
    import {TableComponentMixin} from "./table-utils";

    export default {
        name: "plt-row",
        mixins: [
            TableComponentMixin,
        ],
        props: {
            rowData: {},
        },
        computed: {
            isHover() {
                const {hoverRow, keyField} = this.plTable
                return !!hoverRow && (hoverRow === this.rowData || (!!keyField && this.rowData.row[keyField] === hoverRow.row[keyField]))
            },
            isCurrent() {
                const {currentRowOrKey, keyField} = this.plTable
                if (!currentRowOrKey) {
                    return false
                }
                const type = typeof currentRowOrKey
                if (type === "string") {
                    return !!keyField && currentRowOrKey === this.rowData.row[keyField]
                } else if (type === "object") {
                    return currentRowOrKey === this.rowData
                }

                return false
            },
            classes() {
                return {
                    'plt-row-hover': this.isHover,
                    'plt-row-current': this.isCurrent,
                }
            },
        },
        methods: {
            onMouseenter() {
                this.plTable.onHoverRow(this.rowData)
            },
            onClick() {
                this.plTable.onClickRow(this.rowData)
            },
        },
    }
</script>

<style lang="scss">

</style>