<template>
    <div class="demo-tree">
        <demo-row title="基本用法">

            <demo-line>
                <pl-button-group>
                    <pl-button label="全部展开" @click="$refs.tree1.methods.expandAll()"/>
                    <pl-button label="全部收起" @click="$refs.tree1.methods.collapseAll()"/>
                    <pl-button label="展开特定节点" @click="$refs.tree1.methods.expand('2-2-2')"/>
                    <pl-button label="展开部分节点" @click="tree1.expandSome"/>
                    <pl-button label="当前选中节点" @click="tree1.showCurrent"/>
                    <pl-button label="展开并且设置当前选中节点" @click="tree1.expandAndSelect"/>
                </pl-button-group>
            </demo-line>

            <pl-tree
                    ref="tree1"
                    :data="treeData"
                    keyField="id"
                    labelField="name"
                    childrenField="subs"
                    expandOnClickNode
            >

            </pl-tree>
        </demo-row>
    </div>
</template>

<script>

    import treeData from '../data/tree.data'

    export default {
        name: "tree",
        data() {
            return {
                treeData,

                tree1: (() => ({
                    showCurrent: () => {
                        let current = this.$refs.tree1.methods.getCurrent()
                        this.$message(!!current ? current.data.name : '未选中任何节点！')
                    },
                    expandSome: async () => {
                        // console.log(this.$refs.tree1.state)
                        await this.$refs.tree1.methods.expand(['2-2-2', '3-1-2'])
                    },
                    expandAndSelect: () => {
                        this.$refs.tree1.methods.expand('2-2-2')
                        this.$refs.tree1.methods.setCurrent('2-2-2')
                    },
                }))(),
            }
        },
    }
</script>

<style lang="scss">

</style>