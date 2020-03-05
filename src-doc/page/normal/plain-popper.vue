<template>
    <div class="demo-plain-popper">
        <demo-row title="基本用法">
            <plain-popper component="pl-input" :componentBinding="inputBinding">
                <div>
                    this is popper content
                </div>
            </plain-popper>
        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-plain-popper",
        props: {},
        data() {
            return {
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