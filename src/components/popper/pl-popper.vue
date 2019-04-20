<template>
    <div class="pl-popper">
        <div>
            <im-button label="toggle" :active="!!popperData.under" @click="toggle"/>
            <im-input v-model="text"/>
        </div>
        <im-input v-model="text" v-plain-dom="popperData.under" v-if="popperData.initialized" :class="{'test-input':!!popperData.under}" ref="input"/>
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
                this.p_show = true
            },
            async hide() {
                this.popperData.under = false
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
        position: fixed;
        top: 300px;
        left: 300px;
        z-index: 999;
    }
</style>