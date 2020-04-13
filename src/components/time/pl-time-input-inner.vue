<template>
    <input ref="input"
           type="text"
           class="pl-time-input-inner"
           :style="styles"
           :value="p_value"
           @input="onInput"
           @blur="onBlur"
           @focus="onFocus"
           :disabled="isDisabled"
           :readonly="isReadonly"
    >
</template>

<script>
    import {EditMixin, EmitMixin, PropsMixinFactory, RefsMixinFactory} from "../../utils/mixins";

    export default {
        name: "pl-time-input-inner",
        mixins: [
            EmitMixin,
            EditMixin,
            RefsMixinFactory({
                input: Object
            }),
            PropsMixinFactory.create({
                width: PropsMixinFactory.Number
            })
        ],
        emitters: {
            emitInput: Function,
            emitBlur: Function,
            emitFocus: Function,
        },
        props: {
            width: {type: [String, Number], default: 138},
            value: {type: String},

            displayFormat: {type: String},
        },
        watch: {
            value(val) {
                this.p_value = val
            },
        },
        data() {
            return {
                p_value: this.value,
            }
        },
        computed: {
            styles() {
                return {
                    width: this.$plain.utils.suffixPx(this.p_width)
                }
            },
            regexp() {
                return new RegExp('^' + this.displayFormat.replace(/[a-zA-Z]/g, '\\d') + '$')
            },
        },
        methods: {
            /*---------------------------------------methods-------------------------------------------*/
            focus() {
                this.input.focus()
            },
            /*---------------------------------------handler-------------------------------------------*/
            onInput(e) {
                this.p_value = e.target.value
                if (!this.p_value) {
                    this.emitInput(this.p_value)
                    return
                }
                if (!this.regexp.test(this.p_value)) {
                    return
                }
                this.emitInput(this.p_value)
            },
            onBlur(e) {
                this.p_value = this.value
                this.emitBlur(e)
            },
            onFocus(e) {
                this.emitFocus(e)
            },
        },
    }
</script>

<style lang="scss">

</style>