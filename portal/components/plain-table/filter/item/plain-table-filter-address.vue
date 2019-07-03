<template>
    <pl-input
            :value="showValue"
            class="plain-table-filter-address"
            icon="pad-location-fill"
            inputReadonly
            @clear="pl_clear"
            @click="pl_click"
    />
</template>

<script>
    export default {
        name: "plain-table-filter-address",
        props: {
            filterData: {},
            col: {},
        },
        computed: {
            view() {
                const ret = {}
                const externalProp = this.col.externalProp || {}
                if (!!externalProp.province) ret.province = true
                if (!!externalProp.city) {
                    ret.province = true
                    ret.city = true
                }
                if (!!externalProp.area) {
                    ret.province = true
                    ret.city = true
                    ret.area = true
                }
                return ret
            },
        },
        watch: {
            filterData: {
                immediate: true,
                deep: true,
                async handler(val) {
                    if (!val || !val.value) this.showValue = null
                    else this.showValue = await this.$address.getNameByCode(val.value)
                },
            },
        },
        data() {
            return {
                address: {},
                showValue: null,
            }
        },
        methods: {
            pl_clear() {
                this.filterData.value = null
                this.$emit('confirm')
            },
            pl_click() {
                this.$address.pick({
                    view: this.view,
                    onConfirm: (ret) => {
                        if (!!ret.province) this.filterData.value = ret.province
                        if (!!ret.city) this.filterData.value = ret.city
                        if (!!ret.area) this.filterData.value = ret.area
                        this.$emit('confirm')
                    }
                })
            },
        }
    }
</script>

<style lang="scss">

</style>
