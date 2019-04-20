<template>
    <div class="pl-popper-container">
        <pl-popper ref="poppers" v-for="(item,index) in data" :key="index" :reference="item.reference" :popper="item.popper"/>
    </div>
</template>

<script>
    import PlPopper from "./pl-popper";

    export default {
        name: "pl-popper-container",
        components: {PlPopper},
        data() {
            return {
                data: [],
            }
        },
        methods: {
            async newPopper(reference, popper) {
                this.data.push({reference, popper})
                await this.$plain.nextTick()
                const popperInstance = this.$plain.$utils.findOne(this.$refs.poppers, item => item.reference === reference)
                if (!popperInstance) throw 'create popper fail!'
                return popperInstance
            },
        },
    }
</script>

<style lang="scss">

</style>