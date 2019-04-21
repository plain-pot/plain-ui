<template>
    <div class="pl-popper-container">
        <pl-popper ref="poppers"
                   v-for="(item,index) in data"
                   :key="index"
                   :id="item.id"
                   v-bind="item.props"/>
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
            async newPopper(props) {
                props.direction = props.direction || 'bottom'
                props.align = props.align || 'start'

                const newItem = {id: this.$plain.$utils.uuid(), props}
                this.data.push(newItem)
                await this.$plain.nextTick()
                const poppers = this.$refs.poppers || []
                const popperInstance = this.$plain.$utils.findOne(poppers, item => item.id === newItem.id)
                if (!popperInstance) throw 'create popper fail!'
                return popperInstance
            },
        },
    }
</script>

<style lang="scss">

</style>