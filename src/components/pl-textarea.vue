<template>
    <div class="pl-textarea">
        <textarea class=""
                  id=""
                  :cols="cols"
                  :rows="rows"
                  :value="p_value"
                  :class="classes"
                  :style="{width:width}"
                  :placeholder="placeholder"
                  :disabled="p_disabled"
                  :readonly="p_readonly"

                  @input="pl_input"
                  @focus="p_focus = true"
                  @blur="p_focus = false">
        </textarea>
        <pl-edit-control v-bind="editBinding" v-on="editListening" :value="p_value"/>
    </div>
</template>

<script>
    import {EditMixin, ThrottleMixin} from "../mixin/component-mixin";
    import PlEditControl from "./form/pl-edit-control";

    export default {
        name: "pl-textarea",
        components: {PlEditControl},
        mixins: [EditMixin, ThrottleMixin],
        props: {
            value: {},

            cols: {},
            rows: {default: 5},
            long: {type: Boolean},
            width: {default: '200px'},
            placeholder: {default: '点击输入文本...'},

            type: {type: String, default: 'line'},
            color: {type: String, default: 'info'},
            shape: {type: String, default: 'fillet'},
            size: {type: String, default: 'default'},
        },
        watch: {
            value(val) {
                this.p_value = val
            },
        },
        data() {
            return {
                p_focus: false,
                p_value: this.value,
            }
        },
        computed: {
            classes() {
                return [
                    `pl-type-${this.type}`,
                    `pl-color-${!this.isValid ? 'error' : this.color}`,
                    `pl-shape-${this.shape}`,
                    `pl-size-${this.size}`,
                    {
                        'pl-textarea-focus': this.p_focus,
                        'pl-textarea-long': !!this.long,
                        'pl-textarea-disabled': !!this.p_disabled,
                        'pl-textarea-readonly': !!this.p_readonly,
                    }
                ]
            }
        },
        methods: {
            pl_input(e) {
                this.p_value = e.target.value
                this.$emit('input', this.p_value)
            },
        }
    }
</script>

<style lang="scss">

</style>