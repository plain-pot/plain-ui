<template>
    <div class="plc-group">
    </div>
</template>

<script lang="ts">
    import {PlcType} from "./plc-utils";

    export default {
        name: "plc-group",
        props: {},
        data() {

            const plcType: PlcType = PlcType.GROUP

            return {
                plcType,
            }
        },
        methods: {},
    }
</script>

<style lang="scss">
</style>