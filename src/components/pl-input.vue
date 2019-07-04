<template>
    <div class="pl-input" :class="classes" @mouseenter="pl_mouseenter" @mouseleave="pl_mouseleave" :style="{width:$plain.$utils.unit(width)}">
        <slot name="prepend"></slot>
        <div class="pl-input-inner">
            <input
                    ref="input"
                    :value="p_value"
                    @input="pl_input"

                    :type="inputType"
                    :placeholder="placeholder"
                    :readonly="inputReadonly || p_readonly || loading || p_throttleLoading"
                    :disabled="p_disabled"

                    @click="pl_click"
                    @focus="pl_focus"
                    @blur="pl_blur"
                    @keyup.enter="e=>pl_throttle(e,pl_enter)"
                    @keyup.esc="e=>pl_throttle(e,pl_esc)"
                    @keyup.space="pl_space"
                    @keydown.up="pl_up"
                    @keydown.down="pl_down"
                    @keydown.left="e=>$emit('left',e)"
                    @keydown.right="e=>$emit('right',e)"
                    @keydown.tab="pl_tab"
            >
            <div class="pl-input-controller" v-if="!!controller">
                <pl-loading v-if="controller === 'loading'" class="pl-input-loading"/>
                <pl-icon icon="pad-close-circle-fill" class="pl-input-close" key="close" v-else-if="controller === 'clear'" @click.stop="pl_clear"/>
                <slot name="icon" v-else-if="controller === 'icon'">
                    <pl-icon :icon="icon" class="pl-input-icon" key="icon"/>
                </slot>
            </div>
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
            width: {default: '200px'},
            loading: {type: Boolean},

            type: {type: String, default: 'line'},
            color: {type: String, default: 'info'},
            shape: {type: String, default: 'fillet'},
            size: {type: String, default: 'default'},

            throttleSync: {default: true},
            throttleTime: {default: 500},

            noClear: {type: Boolean},
            inputType: {type: String, default: 'text'},
            inputReadonly: {type: Boolean},
            placeholder: {type: String, default: '点击输入...'},
            focusOnHover: {type: Boolean},
            suggestion: {default: null},
            suggestionLabelKey: {default: null},
            suggestionFilter: {default: null},
            open: {type: Function},
        },
        data() {
            return {
                p_focus: false,
                p_value: this.value,
                p_hover: false,
                p_select: null,

                suggestionOption: {
                    autoFocus: false,
                    labelKey: this.suggestionLabelKey,
                    slot: this.$scopedSlots.suggestion,
                    onClose: () => this.p_select = null,
                    reference: null,
                    data: [],
                },
            }
        },
        mounted() {
            if (!!this.suggestion) {
                this.suggestionOption.reference = this.$el
                this.suggestionOption.data = this.suggestionData
            }
        },
        watch: {
            value(val) {
                this.p_value = val
            },
            p_value() {
                this.suggestionOption.data = this.suggestionData
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
            suggestionData() {
                if (!this.suggestion) return null
                if (!this.p_value) return this.suggestion
                return this.suggestion.filter(item => {
                    if (!!this.suggestionFilter) return this.suggestionFilter(item, this.p_value)
                    if (!!this.suggestionLabelKey) {
                        return item[this.suggestionLabelKey].indexOf(this.p_value) > -1
                    } else
                        return item.indexOf(this.p_value) > -1
                })
            },
            controller() {
                if (!this.p_readonly && !this.p_disabled && (this.loading || this.p_throttleLoading)) return 'loading'
                if (!this.p_disabled && !this.p_readonly && !!this.p_value && this.p_hover && !this.noClear) return 'clear'
                if (!!this.icon || !!this.$slots.icon) return 'icon'
                return null
            },
        },
        methods: {
            pl_mouseenter(e) {
                !!this.focusOnHover && this.$refs.input.focus()
                this.p_hover = true
                this.$emit('hoverChange', true)
                this.$emit('mouseenter', e)
            },
            pl_mouseleave(e) {
                this.p_hover = false
                this.$emit('hoverChange', false)
                this.$emit('mouseleave', e)
            },
            pl_clear(e) {
                if (!!this.$listeners.clear) this.$listeners.clear(e)
                else {
                    this.p_value = null
                    this.$emit('input', null)
                }
            },
            async pl_enter(e) {
                if (!!this.suggestion) {
                    if (!!this.p_select) this.p_select.confirm()
                    else this.pl_openSuggestion()
                }
                await this.$plain.nextTick()
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
                if (!!this.p_select) this.p_select.hide()
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
                this.$emit('blur', e)
                this.p_focus = false
            },
            pl_up(e) {
                this.$emit('up', e)
                !!this.p_select && this.p_select.prev()
            },
            pl_down(e) {
                this.$emit('down', e)
                !!this.p_select && this.p_select.next()
            },
            pl_tab(e) {
                this.$emit('tab', e)
                !!this.p_select && !!this.p_select.p_show && this.p_select.hide()
            },
            pl_click(e) {
                this.$emit('click', e)
                this.pl_openSuggestion()
                if (!!this.open && !this.p_readonly && !this.p_disabled) this.open()
            },
            async pl_openSuggestion() {
                if (this.p_readonly || this.p_disabled) return
                if (!!this.suggestionData) {
                    if (!this.p_select) this.p_select = await this.$plain.$select.getSelect()
                    !this.p_select.p_show ?
                        this.p_select.select(this.suggestionOption).then(e => {
                            this.p_value = !!this.suggestionLabelKey ? e[this.suggestionLabelKey] : e
                            this.$emit('input', this.p_value)
                        })
                        : this.p_select.hide()
                }
            },
        }
    }
</script>
