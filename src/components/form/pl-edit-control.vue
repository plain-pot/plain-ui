<template>
    <transition name="pl-transition-scale">
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
                return isValid
            },
        },
        mounted() {
            !!this.validOnInit && this.valid()
        },
    }
</script>