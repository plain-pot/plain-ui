<template>
    <div class="pl-color-service-controller">
        <pl-color-service v-for="item in count" :key="item" ref="items"/>
    </div>
</template>

<script lang="ts">

    import PlColorService from './pl-color-service'
    import {RefsMixinFactory} from "../../../utils/mixins";

    export default {
        name: "pl-color-service-controller",
        mixins: [RefsMixinFactory({
            items: Array
        })],
        components: {PlColorService},
        props: {},
        data() {
            const count: number = 1
            return {
                count,
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
</style>