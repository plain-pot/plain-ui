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
        computed: {
            p_rules() {
                let ret = [], rules;
                rules = this.$plain.$utils.typeOf(this.rules) === 'string' ? [this.rules] : this.rules
                !!this.required && ret.push('required')
                !!this.rules && (ret = ret.concat(rules))
                return ret.length === 0 ? null : ret
            },
        },
        methods: {
            valid() {
                if (!this.p_rules) return true;
                const {isValid, validMsg} = this.$plain.$valid.validate(this.value, this.p_rules)
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