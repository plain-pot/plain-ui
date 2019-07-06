<template>
    <div class="plain-table-filter-number">
        <pl-number :input="{type:'none',width:'80px',noClear:true,placeholder:'最大值'}" noController v-model="filterData.start" @enter="pl_enter"/>
        <span class="plain-table-filter-number-separator">到</span>
        <pl-number :input="{type:'none',width:'80px',noClear:true,placeholder:'最小值'}" noController v-model="filterData.end" @enter="pl_enter"/>
        <pl-icon icon="pad-close-circle-fill" class="plain-table-filter-number-clear-icon" @click="pl_clear"/>
    </div>
</template>

<script>
    export default {
        name: "plain-table-filter-number",
        props: {
            filterData: {},
        },
        methods: {
            pl_enter() {
                this.$emit('confirm')
            },
            pl_clear() {
                this.filterData.start = null
                this.filterData.end = null
                this.$emit('clear')
            },
        }
    }
</script>

<style lang="scss">
    @include themeWrap {

    }
</style>
