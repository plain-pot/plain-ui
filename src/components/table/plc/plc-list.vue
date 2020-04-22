<template>
    <div class="plc-list">
        <slot></slot>
    </div>
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