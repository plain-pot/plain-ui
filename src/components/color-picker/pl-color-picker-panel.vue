<template>
    <div class="pl-color-picker-panel">
        <!--<div>
            <div>hue:{{color.hue}}</div>
            <div>saturation:{{color.saturation}}</div>
            <div>value:{{color.value}}</div>
            <div>alpha:{{color.alpha}}</div>
            <div>hex:{{color.hex}}</div>
            <div>color:{{color.color}}</div>
            <div>_value:{{color._value}}</div>
        </div>-->
        <pl-color-sv-picker ref="sv" :hue.sync="color.hue" :saturation.sync="color.saturation" :value.sync="color.value" @change="color.updateByHsv()" @dblclick="pl_dblclickSvPicker"/>
        <pl-color-hue-slider ref="hue" v-model="color.hue" @change="color.updateByHsv()"/>
        <pl-color-alpha-slider ref="alpha" :color="color.hex" v-model="color.alpha" v-if="color.enableAlpha" @change="color.updateByAlpha()"/>
        <pl-color-history ref="history" :current="color.color" @select="p_selectHistory"/>
        <div class="pl-color-picker-panel-operate">
            <pl-input :value="color._value" :width="184" @enter="p_enter" @clear="val=>color._value = null" input-readonly/>
            <pl-button label="确定" box-shape="round" @click="p_confirm"/>
        </div>
    </div>
</template>

<script>
    import PlColorHueSlider from "./pl-color-hue-slider";
    import PlColorSvPicker from "./pl-color-sv-picker";
    import PlColorHistory from "./pl-color-history";
    import {Color} from "./index";
    import {ValueMixin} from "../../mixin/component-mixin";
    import PlColorAlphaSlider from "./pl-color-alpha-slider";
    import PlInput from "../pl-input";
    import PlButton from "../pl-button";
    import PlButtonGroup from "../pl-button-group";

    export default {
        name: "pl-color-picker-panel",
        components: {PlButtonGroup, PlButton, PlInput, PlColorAlphaSlider, PlColorHistory, PlColorSvPicker, PlColorHueSlider},
        mixins: [ValueMixin],
        props: {
            enableAlpha: {type: Boolean},
            format: {type: String},
        },
        watch: {
            value(val) {
                this.color.updateByString(val, true, this.enableAlpha)
            },
        },
        data() {
            const color = new Color(this.value, this.enableAlpha, this.format)
            return {
                color,
            }
        },
        mounted() {
            const popover = this.$plain.$dom.findComponentUpward(this, 'pl-popover')
            if (!!popover) {
                popover.$on('show', this.init)
            } else this.init()
        },
        methods: {
            update(val) {
                this.color.updateByString(val === '' ? null : val)
            },
            init() {
                this.$refs.hue.init()
                !!this.enableAlpha && this.$refs.alpha.init()
                this.$refs.sv.init()
            },
            p_confirm() {
                // this.$message.show(this.color.color)
                this.p_value = this.color.color
                this.$refs.history.save(this.color.color)
                this.p_emitValue()
            },
            p_enter(e) {
                const val = e.target.value
                this.color.updateByString(val === '' ? null : val)
            },
            p_selectHistory(color) {
                this.color.updateByString(color)
            },
            async pl_dblclickSvPicker() {
                await this.$plain.nextTick()
                this.p_confirm()
            },
        }
    }
</script>