<template>
    <div class="table-tree-data">
        <demo-row title="基本用法">
            <demo-line>
                <pl-button-group>
                    <pl-button label="全部展开" @click="$refs.tree1.treePlc.methods.expandAll()"/>
                    <pl-button label="全部收起" @click="$refs.tree1.treePlc.methods.collapseAll()"/>
                    <pl-button label="展开特定节点" @click="$refs.tree1.treePlc.methods.expand('2-2-2')"/>
                    <pl-button label="展开部分节点" @click="expandSome"/>
                    <!--                    <pl-button label="当前选中节点" @click="showCurrent"/>-->
                    <pl-button label="展开并且设置当前选中节点" @click="expandAndSelect"/>
                </pl-button-group>
            </demo-line>
            <pl-table :data="data"
                      keyField="id"
                      childrenField="subs"
                      ref="table1"
            >
                <plc-index/>
                <plc-tree ref="tree1"/>
                <plc title="编号" field="id"/>
                <plc title="名称" field="name"/>
            </pl-table>
        </demo-row>
        <demo-row title="">

        </demo-row>
    </div>
</template>

<script>

    import data from '../data/tree.data'

    export default {
        name: "table-tree-data",
        data() {
            return {
                data,
            }
        },
        methods: {
            async expandSome() {
                const keys = ['2-2-2', '3-1-2']
                await this.$refs.tree1.treePlc.methods.expand(keys)
            },
            expandAndSelect() {
                this.$refs.tree1.treePlc.methods.expand('2-2-2')
                this.$refs.table1.methods.setCurrent('2-2-2')
            },
        }
    }
</script>

<style lang="scss">

</style>