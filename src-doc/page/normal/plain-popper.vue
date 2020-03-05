<template>
    <div class="demo-plain-popper">
        <demo-row title="基本用法">
            <plain-popper component="pl-input" :componentBinding="inputBinding" v-if="showFlag">
                <div>
                    this is popper content
                </div>
            </plain-popper>
            <pl-checkbox v-model="showFlag" label="showFlag"/>
        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-plain-popper",
        props: {},
        data() {
            return {
                showFlag: true,
                inputBinding: {
                    props: {
                        suffixIcon: 'el-icon-arrow-down'
                    },
                },
            }
        },
        methods: {},
    }
</script>

<style lang="scss">
</style>