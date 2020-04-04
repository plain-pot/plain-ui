<template>
    <div class="pl-color-alpha-slider" :style="styles">
        <div class="pl-color-alpha-shadow" :style="shadowStyles"></div>
    </div>
</template>

<script>
    import {EmitMixin, PropsMixinFactory} from "../../../utils/mixins";

    const bg = require('./opacity.png')

    export default {
        name: "pl-color-alpha-slider",
        mixins: [
            EmitMixin,
            PropsMixinFactory.create({
                size: PropsMixinFactory.Number,
            })
        ],
        props: {
            color: {type: String},
            value: {type: Number, default: 0},
            size: {type: [String, Number]},
        },
        data() {
            return {}
        },
        computed: {
            styles() {
                return {
                    height: this.$plain.utils.suffixPx(this.p_size),
                    backgroundImage: `url(${bg})`,
                }
            },
            shadowStyles() {
                return {
                    background: `linear-gradient(to bottom, ${this.color}, rgba(255,255,255,0))`,
                }
            },
        },
        methods: {},
    }
</script>

<style lang="scss">
    @include themify{
        .pl-color-alpha-slider {
            width: 10px;
            background-size: 10px 10px;
            position: relative;
            cursor: pointer;
            border-radius: 10px;
            display: inline-block;
            border: solid 1px $ibc;

            .pl-color-alpha-shadow {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                border-radius: 10px;
            }
        }
    }
</style>