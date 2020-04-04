<template>
    <div class="pl-color-panel">
        <pl-color-sv-panel height="180"
                           width="240"
                           :hue="color.hue"
                           :value="color.value"
                           :saturation="color.saturation"
                           @change="onSvChange" @dblclick="onDblclickSvPanel"/>
        <pl-color-alpha-slider v-if="color.enableAlpha"
                               size="180"
                               :color="color.hex"
                               :value="color.alpha"
                               @change="onAlphaChange"/>
        <pl-color-hue-slider size="240"
                             v-model="color.hue"
                             @change="onHueChange"/>
        <div class="pl-color-panel-input-group">
            <pl-input size="mini" :value="color.color" :width="enableAlpha?204:186"/>
            <pl-button-group size="mini" mode="stroke">
                <pl-button icon="el-icon-close" @click="reset"/>
                <pl-button icon="el-icon-check" @click="onConfirm"/>
            </pl-button-group>
        </div>
    </div>
</template>

<script>
    import PlColorSvPanel from "./sub/pl-color-sv-panel";
    import PlColorHueSlider from "./sub/pl-color-hue-slider";
    import PlColorAlphaSlider from "./sub/pl-color-alpha-slider";
    import {Color} from "./Color";
    import {EmitMixin} from "../../utils/mixins";

    export default {
        name: "pl-color-panel",
        components: {PlColorAlphaSlider, PlColorHueSlider, PlColorSvPanel},
        mixins: [
            EmitMixin
        ],
        emitters: {
            emitInput: Function,
            emitDblclickSvPanel: Function,
        },
        props: {
            value: {type: String},                  // 当前颜色值
            enableAlpha: {type: Boolean},            // 是否启用透明度
            format: {type: String},                 // 格式类型：hex、rgb
        },
        watch: {
            value(val) {
                this.color.setValue(val)
            },
            enableAlpha(val) {
                this.color.enableAlpha = val
                this.color.updateByAlpha()
            },
            format(val) {
                this.color.format = val || 'hex'
                this.color.format === 'hex' ? this.color.updateByHex() : this.color.updateByRgb()
            },
        },
        data() {
            const color = new Color(this.value, this.enableAlpha, this.format)
            return {
                color,
            }
        },
        methods: {
            /**
             * 重置当前的颜色值
             * @author  韦胜健
             * @date    2020/4/4 22:11
             */
            reset() {
                this.color.setValue(this.value)
            },
            /**
             * sv中的饱和度以及亮度变化动作处理
             * @author  韦胜健
             * @date    2020/4/4 22:11
             */
            onSvChange({value, saturation}) {
                this.color.value = value
                this.color.saturation = saturation
                this.color.updateByHsv()
            },
            /**
             * 色相变化动作处理
             * @author  韦胜健
             * @date    2020/4/4 22:11
             */
            onHueChange(hue) {
                this.color.hue = hue
                this.color.updateByHsv()
            },
            /**
             * 透明度变化动作处理
             * @author  韦胜健
             * @date    2020/4/4 22:11
             */
            onAlphaChange(alpha) {
                this.color.alpha = alpha
                this.color.updateByAlpha()
            },
            /**
             * 派发值变化动作
             * @author  韦胜健
             * @date    2020/4/4 22:12
             */
            onConfirm() {
                this.p_value = this.color.color
                this.emitInput(this.p_value)
            },
            /**
             * 处理双击 sv panel动作
             * @author  韦胜健
             * @date    2020/4/4 22:12
             */
            onDblclickSvPanel(e) {
                this.onConfirm()
                this.emitDblclickSvPanel(e)
            },
        },
    }
</script>

<style lang="scss">
    @include themify {
        .pl-color-panel {
            display: inline-block;
            font-size: 0;

            .pl-color-hue-slider {
                margin-top: 8px;
                display: block;
            }

            .pl-color-alpha-slider {
                margin-left: 8px;
            }

            .pl-color-panel-input-group {
                margin-top: 8px;

                .pl-input {
                    margin-right: 8px;

                    .pl-input-inner {
                        text-align: center;
                    }
                }
            }
        }
    }
</style>