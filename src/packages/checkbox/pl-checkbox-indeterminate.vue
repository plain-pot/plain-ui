<template>
    <pl-checkbox class="pl-checkbox-indeterminate"
                 :size="size"
                 :disabled="disabled"
                 v-bind="checkboxProps"
                 @click.native="e=>$emit('click',e)">
        <template slot="checkbox-inner">
            <pl-checkbox-inner status="check" key="check" v-if="status === 'check'" :disabled="disabled"/>
            <pl-checkbox-inner status="uncheck" key="uncheck" v-if="status === 'uncheck'" :disabled="disabled"/>
            <pl-checkbox-inner status="minus" key="minus" v-if="status === 'minus'" :disabled="disabled"/>
        </template>
    </pl-checkbox>
</template>

<script>
    export default {
        name: "pl-checkbox-indeterminate",
        props: {
            size: {type: String},
            status: {type: String},                         // check,uncheck,minus
            disabled: {type: Boolean, default: null},
            checkboxProps: {type: Object},
        },
        data() {
            return {}
        },
        methods: {},
    }
</script>

<style lang="scss">
</style>