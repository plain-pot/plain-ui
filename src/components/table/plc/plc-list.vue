<template>
    <span class="plc-list">
        <slot></slot>
    </span>
</template>

<script lang="ts">
    import {PlcMixin, PlcType} from "./plc-utils";

    export default {
        name: "plc-list",
        props: {},
        mixins: [
            PlcMixin,
        ],
        data() {
            const plcType: PlcType = PlcType.LIST

            return {
                plcType,
            }
        },
        methods: {},
    }
</script>

<style lang="scss">
</style>