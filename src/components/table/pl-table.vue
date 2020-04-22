<template>
    <div class="pl-table">
        <plc-list ref="plcList">
            <slot></slot>
        </plc-list>


    </div>
</template>

<script>
    import {RefsMixinFactory} from "../../utils/mixins";

    export default {
        name: "pl-table",
        mixins: [
            RefsMixinFactory({
                plcList: Object
            })
        ],
        mounted() {
            console.log(this.plcList.children)
        },
    }
</script>

<style lang="scss">

</style>