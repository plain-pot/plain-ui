<template>
    <div class="table-span">
        <demo-row title="合并行">
            <table-rowspan/>
        </demo-row>
        <demo-row title="合并列">
            <table-colspan/>
        </demo-row>
    </div>
</template>

<script>

    import TableRowspan from "./table-rowspan";
    import TableColspan from "./table-colspan";
    export default {
        name: "table-span.vue",
        components: {TableColspan, TableRowspan},
    }
</script>

<style lang="scss">

</style>