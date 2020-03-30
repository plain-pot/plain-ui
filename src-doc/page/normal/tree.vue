<template>
    <div class="demo-tree">
        <demo-row title="基本用法">
            <demo-line>
                <pl-button-group>
                    <pl-button label="全部展开" @click="$refs.tree1.expandAll()"/>
                    <pl-button label="全部收起" @click="$refs.tree1.collapseAll()"/>
                    <pl-button label="展开特定节点" @click="$refs.tree1.expand('8')"/>
                </pl-button-group>
            </demo-line>
            <pl-tree ref="tree1"
                     :data="treeData"
                     keyField="id"
                     labelField="name"
                     childrenField="subs"
                     @node-click="onNodeClick"/>
        </demo-row>


        <demo-row title="初始化的时候就渲染所有隐藏的节点，而不是第一次展开的时候才渲染">
            <pl-tree :data="treeData"
                     keyField="id"
                     labelField="name"
                     childrenField="subs"
                     :renderAfterExpand="false"/>
        </demo-row>


    </div>
</template>

<script>
    export default {
        name: "tree",
        props: {},
        data() {
            return {
                treeData: [
                    {
                        id: '1',
                        name: '一级 1',
                        subs: [{
                            id: '2',
                            name: '二级 1-1',
                            subs: [{
                                id: '3',
                                name: '三级 1-1-1'
                            }]
                        }]
                    }, {
                        id: '4',
                        name: '一级 2',
                        subs: [{
                            id: '5',
                            name: '二级 2-1',
                            subs: [{
                                id: '6',
                                name: '三级 2-1-1'
                            }]
                        }, {
                            id: '7',
                            name: '二级 2-2',
                            subs: [{
                                id: '8',
                                name: '三级 2-2-1'
                            }]
                        }]
                    }, {
                        id: '9',
                        name: '一级 3',
                        subs: [{
                            id: '10',
                            name: '二级 3-1',
                            subs: [{
                                id: '11',
                                name: '三级 3-1-1'
                            }]
                        }, {
                            id: '12',
                            name: '二级 3-2',
                            subs: [{
                                id: '13',
                                name: '三级 3-2-1'
                            }]
                        }]
                    }]
            }
        },
        methods: {
            onNodeClick(val) {
                console.log(val.data.name)
            },
        },
    }
</script>

<style lang="scss">
</style>