<template>
    <div class="pl-popper-service-controller">
        <pl-popper-service-item v-for="item in count" :key="item" ref="items"/>
    </div>
</template>

<script>
    import PlPopperServiceItem from "./pl-popper-service-item";
    import {RefsMixinFactory} from "../../utils/mixins";

    export default {
        name: "pl-popper-service-controller",
        components: {PlPopperServiceItem},
        mixins: [RefsMixinFactory({
            items: Array
        })],
        props: {},
        data() {
            return {
                count: 1,
            }
        },
        methods: {
            async getInstance() {
                let service = this.items.find(ele => !ele.showFlag && !ele.openFlag)
                if (!service) {
                    this.count++
                    await this.$plain.nextTick()
                    return this.getInstance()
                } else {
                    return service
                }
            },
        },
    }
</script>

<style lang="scss">
    .pl-popper-service-controller {
        position: fixed;
        top: -9999px;
        left: -9999px;
    }
</style>