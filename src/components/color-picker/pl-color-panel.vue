<template>
    <div class="pl-color-panel">
        <pl-color-sv-panel height="180"
                           width="240"
                           :hue="color.hue"
                           :value="color.value"
                           :saturation="color.saturation"
                           @change="onSvChange" @dblclick="emitDblclickSvPanel"/>
        <pl-color-alpha-slider size="180" :color="color.color"/>
        <pl-color-hue-slider size="240"
                             v-model="color.hue"
                             @change="onHueChange"/>
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
        data() {
            const color = new Color(this.value, this.enableAlpha, this.format)
            return {
                color,
            }
        },
        methods: {
            onSvChange({value, saturation}) {
                this.color.value = value
                this.color.saturation = saturation
                this.color.updateByHsv()
                this.onConfirm()
            },
            onHueChange(hue) {
                this.color.hue = hue
                this.color.updateByHsv()
                this.onConfirm()
            },
            onConfirm() {
                this.p_value = this.color.color
                this.emitInput(this.p_value)
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
        }
    }
</style>