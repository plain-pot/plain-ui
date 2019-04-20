<template>
    <div class="pl-popper-container">
        <pl-popper ref="poppers"
                   v-for="(item,index) in data"
                   :key="index"
                   v-bind="item"/>
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
            async newPopper({reference, popper, direction, align}) {
                direction = direction || 'bottom'
                align = align || 'start'

                this.data.push({reference, popper, direction, align})
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