<template>
    <pl-item tag="tr"
             class="plt-row"
             :class="classes"
             @mouseenter.native="onMouseenter">
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
            classes() {
                return {
                    'plt-row-hover': this.isHover
                }
            },
        },
        methods: {
            onMouseenter() {
                this.plTable.onHoverRow(this.rowData)
            },
        },
    }
</script>

<style lang="scss">

</style>