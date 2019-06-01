<template>
    <button class="pl-tag-input"
            :class="classes"
            :style="{width:width}"
            :disabled="p_disabled"
            :readonly="p_readonly"
            @focus="e=>$emit('focus',e)"
            @blur="e=>$emit('blur',e)"
            @keydown="e=>$emit('keydown',e)"
            @keyup="e=>$emit('keyup',e)"
            @mouseenter="pl_mouseenter"
            @mouseleave="pl_mouseleave"
            @click="e=>$emit('click',e)">
        <div class="pl-tag-input-content">
            <span class="pl-tag-input-placeholder" v-if="!p_value || p_value.length===0">{{placeholder}}</span>
            <pl-tag v-for="(item,index) in p_value" :key="index" :label="item" close @close="pl_close(item,index)" :disabled="p_disabled" :readonly="p_readonly"/>
            <input type="text" class="pl-tag-input-el" v-if="input" @focus="p_focus=true" @blur="p_focus=false" @keyup.enter.prevent="pl_enter" v-model="p_text" :disabled="p_disabled" :readonly="p_readonly">
        </div>
        <pl-icon icon="pad-close-circle-fill" v-if="!p_disabled&&!p_readonly&&p_hover&&!!icon&&!!p_value.join('')" class="pl-tag-input-clear-icon" @click.stop="pl_clear" key="clear"/>
        <pl-icon :icon="icon" v-else-if="icon" class="pl-tag-input-icon" key="normal"/>
        <pl-edit-control ref="edit" v-bind="editBinding" v-on="editListening" :value="p_value.join('')"/>
    </button>
</template>

<script>
    import PlTag from "./pl-tag";
    import PlEditControl from "../form/pl-edit-control";
    import {EditMixin} from "../../mixin/component-mixin";
    import PlIcon from "../pl-icon";

    export default {
        name: "pl-tag-input",
        components: {PlIcon, PlEditControl, PlTag},
        mixins: [EditMixin],
        props: {
            color: {type: String, default: 'info'},
            shape: {type: String, default: 'fillet'},
            value: {type: Array, default: () => []},
            close: {type: Boolean, default: true},
            width: {type: String, default: '200px'},
            icon: {type: String, default: 'pad-tag'},
            placeholder: {type: String},
            input: {type: Boolean},
            onCreate: {type: Function},
            onRemove: {type: Function},
        },
        data() {
            return {
                p_focus: false,
                p_value: [...(this.value || [])],
                p_text: null,
                p_hover: false,
            }
        },
        watch: {
            value(val) {
                this.p_value = [...(val || [])]
            },
        },
        computed: {
            classes() {
                return [
                    `pl-tag-input-color-${!this.isValid ? 'error' : this.color}`,
                    `pl-shape-${this.shape}`,
                    {
                        'pl-tag-input-disabled': this.p_disabled,
                        'pl-tag-input-focus': this.p_focus,
                    },
                ]
            },
        },
        methods: {
            async pl_clear(e) {
                if (!!this.p_disabled || !!this.p_readonly) return
                if (!!this.$listeners.clear) this.$listeners.clear(e)
                else {
                    this.p_value = []
                    this.$emit('input', null)
                }
            },
            async pl_close(item, index) {
                if (!!this.onRemove) {
                    await this.onRemove(item, index)
                } else {
                    this.p_value.splice(index, 1)
                }
                this.$emit('input', this.p_value)
            },
            async pl_enter() {
                if (!this.p_text) return
                if (!!this.onCreate) {
                    await this.onCreate(this.p_text)
                } else {
                    this.p_value.push(this.p_text)
                }
                this.p_text = null
                this.$emit('input', this.p_value)
            },
            pl_mouseenter(e) {
                this.p_hover = true
                this.$emit('mouseenter', e)
            },
            pl_mouseleave(e) {
                this.p_hover = false
                this.$emit('mouseleave', e)
            },
        },
    }
</script>