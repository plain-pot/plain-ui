<template>
    <span class="plc-group">
        <slot></slot>
    </span>
</template>

<script lang="ts">
    import {getPlcWatch, PlcGroupProps, PlcMixin, PlcType} from "./plc-utils";

    export default {
        name: "plc-group",
        watch: {
            ...getPlcWatch(PlcGroupProps),
        },
        props: {
            ...PlcGroupProps,
        },
        mixins: [
            PlcMixin,
        ],
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