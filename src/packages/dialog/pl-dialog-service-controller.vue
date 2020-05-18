<template>
    <div class="pl-dialog-service-controller">
        <pl-dialog-service-item v-for="item in count" :key="item" :refer="val=>items[item-1] = ({value:val})"/>
    </div>
</template>

<script>

    export default {
        name: "pl-dialog-service-controller",
        props: {},
        data() {
            return {
                count: 1,
                items: [],
            }
        },
        methods: {
            async newService(...args) {
                let service = this.items.find(({value: {state}}) => !state.show)
                if (!service) {
                    this.count++
                    await this.$plain.nextTick()
                    return this.newService(...args)
                } else {
                    return service.value.methods.open(...args)
                }
            },
        },
    }
</script>

<style lang="scss">
</style>