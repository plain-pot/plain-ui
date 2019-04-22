<template>
    <div class="pl-toggle" :class="classes" @click="p_click" @mousedown="p_mousedown" @mouseup="p_mouseup">
        <div class="pl-toggle-circle"></div>
    </div>
</template>

<script>

    import {ValueMixin} from "../mixin/component-mixin";

    export default {
        name: "pl-toggle",
        mixins: [ValueMixin],
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
                return this.currentValue === this.trueValue
            },
            classes() {
                return [
                    `pl-toggle-color-${this.color}`,
                    `pl-toggle-size-${this.size}`,
                    {
                        'pl-toggle-on': !!this.on,
                        'pl-toggle-active': this.p_active,
                        'pl-toggle-readonly': this.readonly,
                        'pl-toggle-disabled': this.disabled,
                    }
                ]
            },
        },
        methods: {
            p_click() {
                if (this.readonly || this.disabled) return
                this.currentValue = !this.on ? this.trueValue : this.falseValue
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