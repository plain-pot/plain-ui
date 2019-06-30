<template>
    <pl-select :data="p_data" labelKey="label" valueKey="code" :value="preValue" @input="pl_input" :before="pl_before" :after="pl_after"/>
</template>

<script>
    export default {
        name: "pl-ov",
        props: {
            type: {type: String},
            value: {},
            parentType: {},
            parentCode: {},
            parentMsg: {default: '请先选择父选项'},
            before: {},
            after: {},
        },
        watch: {
            type: {
                immediate: true,
                handler() {
                    this.pl_resetData()
                },
            },
            value: {
                immediate: true,
                async handler(val) {
                    await this.$plain.nextTick()
                    if (!!this.p_timer) {
                        clearTimeout(this.p_timer)
                        this.p_timer = null
                    }
                    this.p_value = val
                }
            },
            parentType() {
                this.pl_resetData()
            },
            parentCode() {
                this.p_timer = setTimeout(() => {
                    this.p_timer = null
                    this.p_value = null
                    this.$emit('input', null)
                }, 0)
                this.pl_resetData()
            },
        },
        data() {
            return {
                p_value: null,
                p_data: [],
                p_timer: null,
            }
        },
        methods: {
            pl_input(val) {
                this.p_value = val
                this.$emit('input', val)
            },
            async pl_resetData() {
                let p_data;
                if (!!this.parentType) {
                    p_data = await this.$ov.getByParentTypeAndCode(this.type, this.parentType, this.parentCode)
                } else {
                    p_data = await this.$ov.getByType(this.type)
                }
                this.p_data = p_data
            },
            async pl_before() {
                if (!!this.parentType && !this.parentCode) {
                    this.$dialog.show(this.parentMsg)
                    return Promise.reject(this.parentMsg)
                }
                !!this.before && (await this.before())
            },
            async pl_after() {
                !!this.after && (await this.after())
            },
        },
        computed: {
            preValue() {
                if (!this.p_data || this.p_data.length === 0) return null
                return this.p_value
            },
        },
    }
</script>

<style lang="scss">

</style>
