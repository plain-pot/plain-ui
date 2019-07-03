<template>
    <pl-input
            class="pl-address"
            :value="p_showValue"
            ref="input"
            inputReadonly
            :readonly="readonly"
            :disabled="disabled"
            :required="required"
            icon="pad-location-fill"
            v-bind="Object.assign({},input,simpleBinding)"
            @clear="pl_clear"
            @click="pl_click"
    />
</template>

<script>
    import {SimpleEditMixin} from "../../../src/mixin/component-mixin";

    export default {
        name: "pl-address",
        mixins: [SimpleEditMixin],
        props: {
            input: {},
            
            province: {},
            city: {},
            area: {},
        },
        data() {
            return {
                p_showValue: null,
            }
        },
        methods: {
            pl_clear() {
                console.log('clear')
            },
            pl_click() {
                if (!!this.$refs.input.p_readonly || !!this.$refs.input.p_disabled) return
                console.log('open')
                this.$address.pick({})
            },
        }
    }
</script>

<style lang="scss">

</style>
