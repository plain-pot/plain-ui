<template>
    <span class="plc">
        <slot></slot>
    </span>
</template>

<script lang="ts">
    import {PlcMixin, PlcProps, PlcType} from "./plc-utils";

    export default {
        name: "plc",
        props: PlcProps,
        mixins: [
            PlcMixin,
        ],
        data() {
            const plcType: PlcType = PlcType.PLC

            return {
                plcType,
            }
        },
    }
</script>

<style lang="scss">

</style>