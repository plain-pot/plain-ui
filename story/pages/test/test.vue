<template>
    <div class="demo-test">
        cascadeData:{{cascadeData}}
        <br>
        <pl-button label="change" @click="change"/>
    </div>
</template>

<script>
    export default {
        name: "test",
        data() {
            return {
                node: {
                    id: '112',
                    name: 'angel',
                    get childrenData() {
                        return this.children ? this.children.map(item => `[${item}]`) : 'nothing'
                    }
                },
            }
        },
        computed: {
            cascadeData() {
                return this.node.childrenData
            },
        },
        methods: {
            change() {
                this.node.children = ['a', 's']
            }
        },
    }
</script>

<style lang="scss">

</style>