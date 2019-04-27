<template>
    <div class="demo-select-service">
        <im-demo-row title="基本用法">
            <im-button label="选择" @click="select(1)" ref="button1"/>
            <im-button label="选择" @click="select(2)" ref="button2"/>
        </im-demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-select-service",
        data() {
            return {
                option1: {
                    data: [
                        {name: '上海', val: 'shanghai'},
                        {name: '北京', val: 'beijing'},
                        {name: '广州', val: 'guangzhou'},
                    ],
                    labelKey: 'name',
                    valueKey: 'val'
                },
                option2: {
                    data: [
                        {name: '华盛顿', val: 'huashengdun'},
                        {name: '纽约', val: 'niuyue'},
                        {name: '佛罗里达', val: 'fololida'},
                    ],
                    labelKey: 'name',
                    valueKey: 'val'
                },
            }
        },
        methods: {
            async select(num) {
                this[`option${num}`].reference = this.$refs[`button${num}`]
                await  this.$plain.$select.select(this[`option${num}`])
            },
        }
    }
</script>

<style lang="scss">

</style>