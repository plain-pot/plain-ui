<script>
    import {getPlcWatch, PlcMixin, PlcProps, PlcType} from "./plc-utils";

    export default {
        name: "plc",
        props: PlcProps,
        watch: {
            ...getPlcWatch(PlcProps)
        },
        mixins: [
            PlcMixin,
        ],
        data() {
            const plcType = PlcType.PLC

            return {
                plcType,
            }
        },
        render() {
            // return <span title={this.title} field={this.field}/>
            return null
        },
    }
</script>

<style lang="scss">

</style>