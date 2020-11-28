<template>
    <div class="demo-test">
        <pl-button-group>
            <pl-button v-for="node in formatData" :key="node.index" @click="doubleAlias(node)">
                {{node.item.name}} / {{(node.item.alias||[]).join(',')}}
            </pl-button>
        </pl-button-group>
    </div>
</template>

<script>
    export default {
        name: "test",
        data() {
            return {
                treeData: [
                    {id: '111', name: 'aaa', alias: ['q', 'w']},
                    {id: '222', name: 'bbb'},
                ],
            }
        },
        computed: {
            formatData() {
                return this.treeData.map((item, index) => ({
                    index,
                    item,
                }))
            },
        },
        methods: {
            doubleAlias(node) {
                let {alias, id, name} = node.item
                if (!!alias) {
                    alias = [...alias, ...alias]
                } else {
                    alias = [id, name]
                }
                node.item.alias = alias
            },
        },
    }
</script>

<style lang="scss">

</style>