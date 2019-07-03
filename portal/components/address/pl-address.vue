<template>
    <pl-input
            class="pl-address"
            :value="p_showValue"
            ref="input"
            inputReadonly
            :readonly="readonly"
            :disabled="disabled"
            :required="required"
            icon="pad-location-fill"
            v-bind="Object.assign({},input,simpleBinding)"
            @clear="pl_clear"
            @click="pl_click"
    />
</template>

<script>
    import {SimpleEditMixin} from "../../../src/mixin/component-mixin";

    export default {
        name: "pl-address",
        mixins: [SimpleEditMixin],
        props: {
            input: {},
            value: {},
            parentCode: {type: String},
            province: {type: Boolean},
            city: {type: Boolean},
            area: {type: Boolean},
        },
        data() {
            return {
                p_showValue: null,
                p_timer: null,
            }
        },
        watch: {
            async value(val) {
                await this.$plain.nextTick()
                if (!!this.p_timer) {
                    clearTimeout(this.p_timer)
                    this.p_timer = null
                }
                this.p_showValue = !!val ? await this.$address.getNameByCode(val) : null
            },
            parentCode() {
                this.p_timer = setTimeout(() => {
                    this.p_timer = null
                    this.$emit('input', null)
                }, 0)
            },
        },
        computed: {
            p_view() {
                return {
                    province: this.province,
                    city: this.city,
                    area: this.area,
                }
            },
            p_hasParentCode() {
                const propsData = this.$options.propsData || {}
                return propsData.hasOwnProperty('parentCode')
            },
            p_parentType() {
                if (!this.p_hasParentCode) return null
                if (!!this.p_view.province) return null
                if (!!this.p_view.city) return 'province'
                if (!!this.p_view.area) return 'city'
            },
            p_type() {
                if (!!this.p_view.province) return 'province'
                if (!!this.p_view.city) return 'city'
                if (!!this.p_view.area) return 'area'
            },
        },
        methods: {
            pl_clear() {
                this.$emit('input', null)
            },
            pl_click() {
                if (!!this.$refs.input.p_readonly || !!this.$refs.input.p_disabled) return

                if (!!this.p_hasParentCode && !this.parentCode) {
                    const msg = `请先选择${this.$address.titleMap[this.p_parentType]}`
                    this.$dialog.show(msg)
                    return
                }
                const data = {}
                if (!!this.p_hasParentCode) data[this.p_parentType] = this.parentCode
                data[this.p_type] = this.value
                this.$address.pick({
                    view: this.p_view,
                    data,
                    onConfirm: (data) => {
                        this.$emit('input', data[this.p_type])
                    },
                })

            },
        }
    }
</script>

<style lang="scss">

</style>
