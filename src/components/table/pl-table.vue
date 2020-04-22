<template>
    <div class="pl-table">
        <plc-controller>
            <slot></slot>
        </plc-controller>



    </div>
</template>

<script>
    import PlcController from "./basic/plc-controller";

    export default {
        name: "pl-table",
        components: {PlcController},
    }
</script>

<style lang="scss">

</style>