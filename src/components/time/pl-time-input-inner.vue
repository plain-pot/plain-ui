<template>
    <input type="text"
           class="pl-time-input-inner"
           :style="styles"
           :value="p_value"
           @input="onInput"
    >
</template>

<script>
    import {PropsMixinFactory} from "../../utils/mixins";

    export default {
        name: "pl-time-input-inner",
        mixins: [
            PropsMixinFactory.create({
                width: PropsMixinFactory.Number
            })
        ],
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
        },
        methods: {
            onInput(e) {
                this.p_value = e.target.value
            },
        },
    }
</script>

<style lang="scss">
    .pl-time-input-inner {
        border: none;
        outline: none;
        width: 90px;
        height: 100%;
        text-align: center;
    }
</style>