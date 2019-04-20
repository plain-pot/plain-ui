<template>
    <div class="pl-popper">
        <div>
            <im-button label="toggle" :active="!!popperData.under" @click="toggle"/>
            <im-input v-model="text"/>
        </div>

        <div style="background-color: #e4f2c9;height: 100px;width: 300px;border-radius: 4px" ref="container">
            <im-input v-model="text" v-if="popperData.initialized" :class="{'test-input':!!popperData.under}" ref="input"/>
        </div>
        <div style="background-color: #f2f2f2;height: 100px;width: 300px;border-radius: 4px" ref="body">

        </div>
    </div>
</template>

<script>
    export default {
        name: "pl-popper",
        props: {
            disableUnderBody: {type: Boolean},
            disableDestroyOnHide: {type: Boolean},
        },
        data() {
            return {
                text: 'hello',
                popperData: {
                    under: false,
                    initialized: false,
                },
                p_show: false,
            }
        },
        methods: {
            async toggle() {
                !!this.p_show ? this.hide() : this.show()
            },
            async show() {
                if (!this.popperData.initialized) {
                    this.popperData.initialized = true
                    await this.$plain.nextTick()
                }
                this.popperData.under = true

                this.$refs.input.$el.parentNode.removeChild(this.$refs.input.$el)
                this.$refs.body.appendChild(this.$refs.input.$el)

                this.p_show = true
            },
            async hide() {
                this.popperData.under = false

                this.$refs.input.$el.parentNode.removeChild(this.$refs.input.$el)
                this.$refs.container.appendChild(this.$refs.input.$el)

                await this.$plain.nextTick()
                if (!this.disableDestroyOnHide) {
                    this.popperData.initialized = false
                    await this.$plain.nextTick()
                }
                this.p_show = false
            },
        }
    }
</script>

<style lang="scss">
    .test-input {
        /*position: fixed;*/
        /*top: 300px;*/
        /*left: 300px;*/
        /*z-index: 999;*/
    }
</style>