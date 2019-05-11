<template>
    <pl-input
            ref="input"
            class="pl-color-picker"
            :value="p_value"
            v-bind="inputBinding"
            keyboard
            @enter="e => p_value = e.target.value"
            @clear="pl_clear"
            @click="pl_click">
        <pl-popover
                ref="popover"
                slot="prepend"
                class="pl-color-picker-popover"
                :reference="p_reference"
                :popper="popoverBinding">
            <pl-color-picker-panel ref="panel" :value="p_value" @input="p_select" :enable-alpha="enableAlpha" :format="format"/>
        </pl-popover>
        <pl-color :color="p_value" :round="!!input && input.shape === 'round'" slot="append" @click="pl_click">
            <pl-icon icon="pl-down"/>
        </pl-color>
    </pl-input>

</template>

<script>
    import PlColor from "./pl-color";
    import {MountedMixin, SimpleEditMixin, ValueMixin} from "../../mixin/component-mixin";
    import PlPopover from "../popper/pl-popover";
    import PlColorPickerPanel from "./pl-color-picker-panel";
    import PlIcon from "../pl-icon";
    import PlInput from "../pl-input";

    export default {
        name: "pl-color-picker",
        components: {PlInput, PlIcon, PlColorPickerPanel, PlPopover, PlColor},
        mixins: [ValueMixin, MountedMixin, SimpleEditMixin],
        props: {
            enableAlpha: {type: Boolean,},
            format: {type: String, default: 'hex'},
            input: {},
        },
        computed: {
            popoverBinding() {
                return {
                    disabledEqual: true,
                    width: 250,
                    height: this.enableAlpha ? 358 : 342,
                }
            },
            inputBinding() {
                return Object.assign({
                    inputReadonly: true,
                }, this.input, this.simpleBinding)
            },
            p_reference() {
                if (!this.p_mounted) return false
                return this.$el
            },
        },
        methods: {
            p_select(val) {
                this.p_value = val
                this.$refs.popover.hide()
                this.p_emitValue()
            },
            pl_click() {
                if (!!this.$refs.input.p_readonly || !!this.$refs.input.p_disabled) return
                this.$refs.popover.show()
            },
            pl_clear() {
                if (!!this.$refs.input.p_readonly || !!this.$refs.input.p_disabled) return
                this.p_value = null
                this.p_emitValue()
            },
        }
    }
</script>