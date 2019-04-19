<template>
    <div class="pl-input" :class="classes" @mouseenter="pl_mouseenter" @mouseleave="pl_mouseleave">
        <div class="pl-input-inner">
            <input
                    v-model="p_value"
                    :type="inputType"
                    :placeholder="placeholder"
                    @focus="p_focus = true"
                    @blur="p_focus = false"
            >
            <pl-loading v-if="p_loading" class="pl-input-loading"/>
            <pl-icon icon="pad-close-circle-fill" class="pl-input-close" v-else-if="!!p_value && p_hover" @click="pl_clear"/>
            <pl-icon :icon="icon" v-else-if="!!icon"/>
        </div>
    </div>
</template>

<script>
    import PlIcon from "./pl-icon";
    import PlLoading from "./pl-loading";

    export default {
        name: "pl-input",
        components: {PlLoading, PlIcon},
        props: {
            value: {},
            icon: {type: String},
            long: {type: Boolean},
            loading: {type: Boolean},

            type: {type: String, default: 'line'},
            color: {type: String, default: 'info'},
            shape: {type: String, default: 'fillet'},
            size: {type: String, default: 'default'},

            inputType: {type: String, default: 'text'},
            placeholder: {type: String, default: '点击输入...'},
        },
        data() {
            return {
                p_focus: false,
                p_value: this.value,
                p_hover: false,
                p_loading: this.loading,
            }
        },
        computed: {
            classes() {
                return [
                    `pl-type-${this.type}`,
                    `pl-color-${this.color}`,
                    `pl-shape-${this.shape}`,
                    `pl-size-${this.size}`,
                    {
                        'pl-input-focus': this.p_focus,
                        'pl-input-icon': !!this.icon,
                        'pl-input-long': !!this.long,
                    },
                ]
            },
        },
        methods: {
            pl_mouseenter(e) {
                this.p_hover = true
                this.$emit('hoverChange', true)
            },
            pl_mouseleave(e) {
                this.p_hover = false
                this.$emit('hoverChange', false)
            },
            pl_clear(e) {
                if (!!this.$listeners.clear) this.$listeners.clear(e)
                else this.p_value = null
            },
        }
    }
</script>