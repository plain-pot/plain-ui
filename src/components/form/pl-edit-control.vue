<template>
    <transition name="pl-edit-scale">
        <div class="pl-edit-control" v-show="!isValid">
            <span>{{validMsg}}</span>
        </div>
    </transition>
</template>

<script>
    import {EditMixin} from "../../mixin/component-mixin";

    export default {
        name: "pl-edit-control",
        mixins: [EditMixin],
        props: {
            value: {},
        },
        watch: {
            value() {
                this.valid()
            },
            required() {
                this.valid()
            },
        },
        data() {
            return {
                validMsg: '输入格式不正确',
            }
        },
        methods: {
            valid() {
                if (!this.rules && this.required === null) return {isValid: true};
                const {isValid, validMsg} = this.$plain.$valid.validate(this.value, this.required, this.rules)
                this.isValid = isValid
                this.validMsg = validMsg
                this.$emit('update:isValid', this.isValid)
                return {isValid, validMsg}
            },
            cancelValid() {
                this.isValid = true
                this.validMsg = null
                this.$emit('update:isValid', this.isValid)
            },
            setDisabled(flag = true) {
                this.$emit('update:p_disabled', flag)
            },
            setReadonly(flag = true) {
                this.$emit('update:p_readonly', flag)
            },
        },
        mounted() {
            !!this.validOnInit && this.valid()
        },
    }
</script>