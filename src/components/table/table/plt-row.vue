<template>
    <pl-item tag="tr" class="plt-row">
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
    }
</script>

<style lang="scss">

</style>