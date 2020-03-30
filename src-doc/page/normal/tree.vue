<template>
    <div class="demo-tree">
        <demo-row title="基本用法">
            <pl-tree
                    :data="treeData"
                    keyField="id"
                    labelField="name"
                    childrenField="subs"
                    @node-click="val=>$message(val.name)"
            />
        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "tree",
        props: {},
        data() {
            return {
                treeData: [{
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
        methods: {},
    }
</script>

<style lang="scss">
</style>