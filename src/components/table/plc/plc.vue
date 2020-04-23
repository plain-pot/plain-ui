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
        render() {
            return null
        },
    }
</script>

<style lang="scss">

</style>