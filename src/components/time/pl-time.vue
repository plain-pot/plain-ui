<template>
    <div class="pl-time" @click="pl_click">
        <slot :value="p_value">
            <pl-input
                    ref="input"
                    v-bind="inputBinding"
                    :value="p_value"
                    icon="pl-time-circle-light"
                    @clear="pl_clear"
                    @click="pl_click"/>
        </slot>
        <pl-popper
                ref="popper"
                slot="prepend"
                v-bind="popperBinding"
                :reference="!p_mounted?null:$el">
            <pl-time-panel :value="p_value" @input="pl_panelInput" :max="max" :min="min" ref="panel" @clickLabel="p_clickLabel"/>
        </pl-popper>
    </div>
</template>

<script>
    import PlTimePanel from "./pl-time-panel";
    import PlInput from "../pl-input";
    import {MountedMixin, ValueMixin} from "../../mixin/component-mixin";
    import PlPopper from "../popper/pl-popper";

    export default {
        name: "pl-time",
        components: {PlPopper, PlInput, PlTimePanel},
        mixins: [MountedMixin, ValueMixin],
        props: {
            max: {type: String},                                                    //最大值
            min: {type: String},                                                    //最小值
        },
        watch: {
            value(val) {
                this.p_value !== val && (this.p_value = val)
            },
        },
        computed: {
            inputBinding() {
                return Object.assign({
                    inputReadonly: true,
                }, this.input)
            },
            popperBinding() {
                return {
                    height: 208,
                    width: 150,
                    disabledEqual: true,
                }
            },
        },
        methods: {
            pl_clear() {
                if (!!this.$refs.input.p_readonly && !!this.$refs.input.p_disabled) return
                this.p_value = null
                this.p_emitValue()
            },
            async p_clickLabel() {
                await this.$plain.nextTick()
                this.$emit('confirm', this.p_value)
                this.$refs.popper.hide()
            },
            pl_click() {
                if (!!this.$refs.input) {
                    if (!!this.$refs.input.p_readonly || !!this.$refs.input.p_disabled) return
                } else {
                    if (!!this.readonly || this.disabled) return;
                }
                this.$refs.popper.show()
            },
            pl_panelInput(val) {
                this.p_value = val
                this.p_emitValue()
            },
        },
    }
</script>