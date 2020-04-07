<template>
    <div class="pl-cascade-controller">
        <pl-cascade-service v-for="item in count" :key="item" ref="items"/>
    </div>
</template>

<script>

    import PlCascadeService from './pl-cascade-service'
    import {RefsMixinFactory} from "../../../utils/mixins";

    export default {
        name: "pl-cascade-controller",
        mixins: [RefsMixinFactory({
            items: Array
        })],
        components: {PlCascadeService},
        props: {},
        data() {
            return {
                count: 1,
            }
        },
        methods: {
            async getInstance() {
                let service = this.items.find(item => (!item.showFlag && !item.openFlag) && !item.isPrivate)
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
    .pl-cascade-controller {
        position: fixed;
        top: -9999px;
        left: -9999px;
        z-index: 1500;

        .pl-cascade-service-popper {
            .plain-popper-content {
                padding: 0px;
                border: none !important;
            }
        }
    }
</style>