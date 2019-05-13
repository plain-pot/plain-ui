<template>
    <button class="pl-toggle" :class="classes" @click="p_click" @mousedown="p_mousedown" @mouseup="p_mouseup">
        <div class="pl-toggle-circle"></div>
        <pl-edit-control v-bind="editBinding" v-on="editListening" :value="p_value"/>
    </button>
</template>

<script>

    import {EditMixin, ValueMixin} from "../mixin/component-mixin";
    import PlEditControl from "./form/pl-edit-control";

    export default {
        name: "pl-toggle",
        components: {PlEditControl},
        mixins: [ValueMixin, EditMixin],
        props: {
            size: {type: String, default: 'default'},                   //大小
            color: {type: String, default: 'primary'},                  //颜色
            readonly: {type: Boolean},                                  //是否只读
            disabled: {type: Boolean},                                  //是否禁用

            trueValue: {default: true},                                 //激活的时候的实际值
            falseValue: {default: false},                               //未激活的时候的实际值
        },
        data() {
            return {
                p_active: false,
            }
        },
        computed: {
            on() {
                return this.p_value === this.trueValue
            },
            classes() {
                return [
                    `pl-toggle-color-${this.color}`,
                    `pl-toggle-size-${this.size}`,
                    {
                        'pl-toggle-on': !!this.on,
                        'pl-toggle-active': this.p_active,
                        'pl-toggle-readonly': this.p_readonly,
                        'pl-toggle-disabled': this.p_disabled,
                    }
                ]
            },
        },
        methods: {
            p_click() {
                if (this.p_readonly || this.p_disabled) return
                this.p_value = !this.on ? this.trueValue : this.falseValue
                this.p_emitValue()
            },
            p_mousedown() {
                this.p_active = true
            },
            p_mouseup() {
                this.p_active = false
            },
        },
    }
</script>