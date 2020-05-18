<template>
    <div class="pl-dialog-service-controller">
        <pl-dialog-service-item v-for="item in count" :key="item" ref="items"/>
    </div>
</template>

<script>

    export default {
        name: "pl-dialog-service-controller",
        props: {},
        data() {
            return {
                count: 1,
            }
        },
        methods: {
            async newService(...args) {
                let service = this.$refs.items.find(({state: {show}}) => !show)
                if (!service) {
                    this.count++
                    await this.$plain.nextTick()
                    return this.newService(...args)
                } else {
                    return service.methods.open(...args)
                }
            },
        },
    }
</script>

<style lang="scss">
</style>