<template>
    <div class="virtual-tree">
        <demo-row title="基本用法">
            <demo-line>
                <pl-button-group>
                    <pl-button label="全部展开" @click="$refs.tree1.expandAll()"/>
                    <pl-button label="全部收起" @click="$refs.tree1.collapseAll()"/>
                    <pl-button label="展开特定节点" @click="$refs.tree1.expand('2-2-2')"/>
                    <pl-button label="展开部分节点" @click="expandSome"/>
                    <pl-button label="当前选中节点" @click="showCurrent"/>
                    <pl-button label="展开并且设置当前选中节点" @click="expandAndSelect"/>
                </pl-button-group>
            </demo-line>
            <pl-virtual-tree ref="tree1"
                             :data="treeData"
                             keyField="id"
                             labelField="name"
                             childrenField="subs"
                             @node-click="val=>$message(val.data.name)"/>
        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "virtual-tree",
        props: {},
        data() {
            const treeData = [
                {
                    id: '1',
                    name: '一级 1',
                    subs: [{
                        id: '1-1',
                        name: '二级 1-1',
                        subs: [{
                            id: '1-1-1',
                            name: '三级 1-1-1'
                        }]
                    }]
                }, {
                    id: '2',
                    name: '一级 2',
                    subs: [{
                        id: '2-1',
                        name: '二级 2-1',
                        subs: [{
                            id: '2-1-1',
                            name: '三级 2-1-1'
                        }]
                    }, {
                        id: '2-2',
                        name: '二级 2-2',
                        subs: [{
                            id: '2-2-1',
                            name: '三级 2-2-1'
                        }, {
                            id: '2-2-2',
                            name: '三级 2-2-2'
                        }]
                    }]
                }, {
                    id: '3',
                    name: '一级 3',
                    subs: [{
                        id: '3-1',
                        name: '二级 3-1',
                        subs: [{
                            id: '3-1-1',
                            name: '三级 3-1-1'
                        }, {
                            id: '3-1-2',
                            name: '三级 3-1-2'
                        }]
                    }, {
                        id: '3-2',
                        name: '二级 3-2',
                        subs: [{
                            id: '3-2-1',
                            name: '三级 3-2-1'
                        }]
                    }]
                }]
            return {
                treeData,
            }
        },
        methods: {},
    }
</script>

<style lang="scss">
</style>