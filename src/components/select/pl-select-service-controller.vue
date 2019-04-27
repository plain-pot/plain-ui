<template>
    <div class="pl-select-service-controller">
        <pl-select-service v-for="(item) in items" :key="item" ref="services"/>
    </div>
</template>

<script>
    import PlSelectService from "./pl-select-service";

    export default {
        name: "pl-select-service-controller",
        components: {PlSelectService},
        data() {
            return {
                items: [],
            }
        },
        methods: {
            async getSelect() {
                let service = !this.$refs.services ? null : this.$plain.$utils.findOne(this.$refs.services, item => !item.popper || !item.popper.isOpen)
                if (!service) {
                    this.items.push(this.items.length + 1)
                    await this.$plain.nextTick()
                    service = this.$plain.$utils.findOne(this.$refs.services, item => !item.popper || !item.popper.isOpen)
                }
                return service
            },
        }
    }
</script>

<style lang="scss">

</style>