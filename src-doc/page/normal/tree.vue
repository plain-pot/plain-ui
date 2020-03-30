<template>
    <div class="demo-tree">
        <demo-row title="基本用法">
            <pl-tree
                    :data="treeData"
                    labelKey="name"
                    childrenKey="subs"
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
                    name: '一级 1',
                    subs: [{
                        name: '二级 1-1',
                        subs: [{
                            name: '三级 1-1-1'
                        }]
                    }]
                }, {
                    name: '一级 2',
                    subs: [{
                        name: '二级 2-1',
                        subs: [{
                            name: '三级 2-1-1'
                        }]
                    }, {
                        name: '二级 2-2',
                        subs: [{
                            name: '三级 2-2-1'
                        }]
                    }]
                }, {
                    name: '一级 3',
                    subs: [{
                        name: '二级 3-1',
                        subs: [{
                            name: '三级 3-1-1'
                        }]
                    }, {
                        name: '二级 3-2',
                        subs: [{
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