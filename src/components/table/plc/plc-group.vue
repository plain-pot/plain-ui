<template>
    <span class="plc-group">
        <slot></slot>
    </span>
</template>

<script lang="ts">
    import {PlcMixin, PlcType, PublicPlcProps} from "./plc-utils";

    export default {
        name: "plc-group",
        props: {
            ...PublicPlcProps,
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