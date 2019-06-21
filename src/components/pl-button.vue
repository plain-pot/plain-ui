<template>
    <button class="pl-button"
            :type="buttonType"
            :class="classes"
            :readonly="p_readonly || loading"
            :disabled="p_disabled"
            @click="e=>!p_disabled && !p_readonly && pl_throttle(e,pl_click)"
            @focus="e=>$emit('focus',e)"
            @keyup="e=>$emit('keyup',e)"
            @keydown="e=>$emit('keydown',e)">
        <pl-loading v-if="(loading || p_throttleLoading) && !circle"/>
        <slot>
            <pl-icon v-if="!!icon" :icon="icon"/>
            <span v-if="!!label">{{label}}</span>
        </slot>
        <pl-edit-control v-bind="editBinding" v-on="editListening"/>
    </button>
</template>

<script>
    import PlLoading from "./pl-loading";
    import PlIcon from "./pl-icon";
    import {EditMixin, ThrottleMixin} from "../mixin/component-mixin";
    import PlEditControl from "./form/pl-edit-control";

    export default {
        name: "pl-button",
        components: {PlEditControl, PlIcon, PlLoading},
        mixins: [ThrottleMixin, EditMixin],
        props: {
            type: {type: String, default: 'fill'},
            color: {type: String, default: 'primary'},
            shape: {type: String, default: 'fillet'},
            size: {type: String, default: 'default'},
            label: {},
            icon: {type: String},
            active: {type: Boolean},
            loading: {type: Boolean},

            circle: {type: Boolean},                                        //圆形按钮
            long: {type: Boolean,},                                         //长按钮
            noPadding: {type: Boolean},                                     //左右边距
            textAlign: {type: String, default: 'center'},
            buttonType: {type: String, default: 'button'},
        },
        computed: {
            classes() {
                return [
                    `pl-type-${this.type}`,
                    `pl-color-${this.color}`,
                    `pl-shape-${this.shape}`,
                    `pl-size-${this.size}`,
                    `pl-align-${this.textAlign}`,

                    {
                        'pl-button-long': this.long,
                        'pl-button-active': this.active,
                        'pl-button-loading': this.loading,
                        'pl-button-circle': this.circle,
                        'pl-button-no-padding': this.noPadding,
                        'pl-button-disabled': this.p_disabled,
                    },
                ]
            }
        },
        data() {
            return {}
        },
        methods: {
            async pl_click(e) {
                if (!!this.$listeners.click) {
                    try {
                        await this.$listeners.click(e)
                    } catch (e) {
                    }
                } else {
                    this.$emit('click', e)
                }
            },
        }
    }
</script>