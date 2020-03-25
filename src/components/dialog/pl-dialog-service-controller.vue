<template>
    <div class="pl-dialog-service-controller">
        <pl-dialog-service-item v-for="item in count" :key="item" ref="items"/>
    </div>
</template>

<script>
    import PlDialogServiceItem from "./pl-dialog-service-item";
    import {RefsMixinFactory} from "../../utils/mixins";

    export default {
        name: "pl-dialog-service-controller",
        mixins: [
            RefsMixinFactory({
                items: Object,
            })
        ],
        components: {PlDialogServiceItem},
        props: {},
        data() {
            return {
                count: 1,
            }
        },
        methods: {
            async newService(...args) {
                let service = this.items.find(item => !item.show)
                if (!service) {
                    this.count++
                    await this.$plain.nextTick()
                    return this.newService(...args)
                } else {
                    return service.open(...args)
                }
            },
        },
    }
</script>

<style lang="scss">
</style>