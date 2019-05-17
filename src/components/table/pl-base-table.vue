<template>
    <div class="pl-base-table">
        <pl-base-table-column-controller @collect="pl_collect">
            <slot></slot>
        </pl-base-table-column-controller>
    </div>
</template>

<script>
    import PlBaseTableColumnController from "./pl-base-table-column-controller";

    export default {
        name: "pl-base-table",
        components: {PlBaseTableColumnController},
        data() {
            return {
                originCols: null,
            }
        },
        methods: {
            pl_collect(originCols) {
                this.originCols = originCols
                console.log('originCols', originCols)
            },
        }
    }
</script>

<style lang="scss">

</style>