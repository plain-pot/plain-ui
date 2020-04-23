<template>
    <div class="pl-table">
        <plc-list ref="plcList">
            <slot></slot>
        </plc-list>


    </div>
</template>

<script>
    import {RefsMixinFactory} from "../../utils/mixins";
    import {formatPlcList} from "./plc/plc-utils";

    export default {
        name: "pl-table",
        mixins: [
            RefsMixinFactory({
                plcList: Object
            })
        ],
        mounted() {
            const plcList = formatPlcList(this.plcList.children)
            console.log(plcList)
        },
    }
</script>

<style lang="scss">

</style>