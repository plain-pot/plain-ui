<template>
    <div class="pl-color-sv-panel" :style="styles">
        pl-color-sv-panel
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
    .pl-color-sv-panel {
        position: relative;

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
    }
</style>