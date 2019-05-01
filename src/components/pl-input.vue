<template>
    <div class="pl-input" :class="classes" @mouseenter="pl_mouseenter" @mouseleave="pl_mouseleave" :style="{width:width}">
        <slot name="prepend"></slot>
        <div class="pl-input-inner">
            <input
                    ref="input"
                    :value="p_value"
                    @input="pl_input"

                    :type="inputType"
                    :placeholder="placeholder"
                    :readonly="p_readonly || loading || timerWait || timerHandler"
                    :disabled="p_disabled"

                    @focus="pl_focus"
                    @blur="pl_blur"
                    @keyup.enter="e=>pl_throttle(e,pl_enter)"
                    @keyup.esc="e=>pl_throttle(e,pl_esc)"
                    @keyup.space="e=>$emit('space',e)"
                    @keydown.up="e=>$emit('up',e)"
                    @keydown.down="e=>$emit('down',e)"
                    @keydown.left="e=>$emit('left',e)"
                    @keydown.right="e=>$emit('right',e)"
            >
            <pl-loading v-if="loading || timerWait || timerHandler" class="pl-input-loading"/>
            <pl-icon icon="pad-close-circle-fill" class="pl-input-close" v-else-if="!p_disabled && !p_readonly && !!p_value && p_hover" @click="pl_clear"/>
            <pl-icon :icon="icon" v-else-if="!!icon" class="pl-input-icon"/>
        </div>
        <slot name="append"></slot>
        <pl-edit-control v-bind="editBinding" v-on="editListening" :value="p_value"/>
    </div>
</template>

<script>
    import PlIcon from "./pl-icon";
    import PlLoading from "./pl-loading";
    import {EditMixin, ThrottleMixin} from "../mixin/component-mixin";
    import PlEditControl from "./form/pl-edit-control";

    export default {
        name: "pl-input",
        components: {PlEditControl, PlLoading, PlIcon},
        mixins: [ThrottleMixin, EditMixin],
        props: {
            value: {},
            icon: {type: String},
            long: {type: Boolean},
            width: {type: String, default: '200px'},
            loading: {type: Boolean},

            type: {type: String, default: 'line'},
            color: {type: String, default: 'info'},
            shape: {type: String, default: 'fillet'},
            size: {type: String, default: 'default'},

            inputType: {type: String, default: 'text'},
            placeholder: {type: String, default: '点击输入...'},
            focusOnHover: {type: Boolean},
        },
        data() {
            return {
                p_focus: false,
                p_value: this.value,
                p_hover: false,
            }
        },
        watch: {
            value(val) {
                this.p_value = val
            },
        },
        computed: {
            classes() {
                return [
                    `pl-type-${this.type}`,
                    `pl-color-${!this.isValid ? 'error' : this.color}`,
                    `pl-shape-${this.shape}`,
                    `pl-size-${this.size}`,
                    {
                        'pl-input-focus': this.p_focus,
                        'pl-input-has-icon': !!this.icon,
                        'pl-input-long': !!this.long,
                        'pl-input-disabled': !!this.p_disabled,
                        'pl-input-readonly': !!this.p_readonly,
                    },
                ]
            },
        },
        methods: {
            pl_mouseenter(e) {
                !!this.focusOnHover && this.$refs.input.focus()
                this.p_hover = true
                this.$emit('hoverChange', true)
            },
            pl_mouseleave(e) {
                this.p_hover = false
                this.$emit('hoverChange', false)
            },
            pl_clear(e) {
                if (!!this.$listeners.clear) this.$listeners.clear(e)
                else {
                    this.p_value = null
                    this.$emit('input', null)
                }
            },

            async pl_enter(e) {
                if (!!this.$listeners.enter) {
                    await this.$listeners.enter(e)
                } else {
                    this.$emit('enter', e)
                }
            },
            pl_space(e) {
                this.$emit('space', e)
            },
            pl_esc(e) {
                this.$emit('esc', e)
            },
            pl_input(e) {
                this.p_value = e.target.value
                this.$emit('input', this.p_value)
            },
            pl_focus(e) {
                this.p_focus = true
                this.$emit('focus', e)
            },
            pl_blur(e) {
                this.p_focus = false
                this.$emit('blur ', e)

            },
        }
    }
</script>