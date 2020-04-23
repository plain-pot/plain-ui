<template>
    <div class="plc-group">
        <slot></slot>
    </div>
</template>

<script lang="ts">
    import {PlcMixin, PlcType} from "./plc-utils";

    export default {
        name: "plc-group",
        props: {},
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