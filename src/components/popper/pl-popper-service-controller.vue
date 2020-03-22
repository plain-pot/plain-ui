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
            async getService() {
                let service = this.items.find(ele => !ele.showFlag && !ele.openFlag)
                if (!service) {
                    this.count++
                    await this.$plain.nextTick()
                    return this.getService()
                } else {
                    return service
                }
            },
        },
    }
</script>

<style lang="scss">
</style>