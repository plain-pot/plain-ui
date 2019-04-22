<template>
    <div class="pl-popper-container">
        <pl-popper ref="poppers"
                   v-for="(item,index) in data"
                   :key="index"
                   :id="item.id"
                   :data="item"
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
                poppers: [],
            }
        },
        methods: {
            async newPopper(props) {
                props.direction = props.direction || 'bottom'
                props.align = props.align || 'start'

                const newItem = {id: this.$plain.$utils.uuid(), props, parentNode: props.popper.parentNode}
                this.data.push(newItem)
                await this.$plain.nextTick()
                const poppers = this.$refs.poppers || []
                const popperInstance = this.$plain.$utils.findOne(poppers, item => item.id === newItem.id)
                if (!popperInstance) throw 'create popper fail!'
                return popperInstance
            },

            async getPopper(props) {
                const existPopper = this.$plain.$utils.findOne(this.poppers, item => item.data.props === props)
                if (!!existPopper) return existPopper

                let popperInstance = this.$plain.$utils.findOne(this.poppers, item => !item.isOpen)
                if (!popperInstance) {
                    popperInstance = await this.newPopper(props)
                    this.poppers.push(popperInstance)
                    console.log('new')
                } else {
                    await popperInstance.destroy()
                    const itemData = this.$plain.$utils.findOne(this.data, item => item.id === popperInstance.id)
                    itemData.props = props
                    await this.$plain.nextTick()
                    await popperInstance.reload()
                    console.log('old')
                }
                return popperInstance
            },
        },
    }
</script>

<style lang="scss">

</style>