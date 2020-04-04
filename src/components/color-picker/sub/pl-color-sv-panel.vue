<template>
    <div class="pl-color-sv-panel" :style="styles">
        <div class="pl-color-sv-thumb-wrapper">
            <span class="pl-color-sv-thumb" ref="thumb"/>
        </div>
    </div>
</template>

<script lang="ts">
    import {EmitMixin, PropsMixinFactory} from "../../../utils/mixins";
    import {hsv2rgb} from "../ColorUtils";

    export default {
        name: "pl-color-sv-panel",
        mixins: [
            EmitMixin,
            PropsMixinFactory.create({
                height: PropsMixinFactory.Number,
                width: PropsMixinFactory.Number,
            }),
        ],
        props: {
            hue: {type: Number, default: 360},                      // 色相
            saturation: {type: Number},                             // 饱和度
            value: {type: Number},                                  // 亮度

            height: {type: [String, Number], default: 180},         // 面板高度
            width: {type: [String, Number], default: 240},          // 面板宽度
        },
        data() {
            return {
                p_saturation: this.saturation,
                p_value: 100 - (this.value || 0),
            }
        },
        computed: {
            styles() {
                const color = hsv2rgb(this.hue, 100, 100)
                return {
                    width: this.$plain.utils.suffixPx(this.width),
                    height: this.$plain.utils.suffixPx(this.height),
                    backgroundColor: `rgb(${color.r},${color.g},${color.b})`,
                }
            },
        },
        methods: {},
    }
</script>

<style lang="scss">
    @include themify {
        .pl-color-sv-panel {
            position: relative;
            box-shadow: 0 0px 4px 0 rgba(0, 0, 0, 0.4);

            &, &:before, &:after {
                border-radius: 4px;
            }

            &:before, &:after {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                content: '';
            }

            &:before {
                background: linear-gradient(to right, white, rgba(255, 255, 255, 0));
            }

            &:after {
                background: linear-gradient(to top, black, rgba(255, 255, 255, 0));
            }

            .pl-color-sv-thumb-wrapper {
                display: inline-block;
                position: absolute;
                width: 1px;
                height: 1px;
                left: 0;
                top: 0;

                .pl-color-sv-thumb {
                    display: inline-block;
                    width: 10px;
                    height: 10px;
                    border: solid 1px $colorInfo;
                    border-radius: 10px;
                    position: absolute;
                    top: -5px;
                    left: -5px;
                }
            }
        }
    }
</style>