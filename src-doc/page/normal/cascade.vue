<template>
    <div class="demo-cascade">
        <demo-row title="cascade-panel">
            <demo-line>
                {{val[0]}}
            </demo-line>
            <pl-cascade-panel
                    v-model="val[0]"
                    :data="treeData"
                    labelField="name"
                    keyField="id"
                    childrenField="subs"

                    :isLeaf="isLeaf"
            />
        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "cascade",
        props: {},
        data() {
            const treeData = [
                {
                    id: '1',
                    name: '一级 1',
                    subs: [
                        ...([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(index => ({
                            id: '1-' + index,
                            name: '二级 1-' + index,
                            subs: [{
                                id: `1-${index}-1`,
                                name: `三级 1-${index}-1`
                            }]
                        })))
                    ]
                }, {
                    id: '2',
                    name: '一级 2',
                    subs: [
                        ...([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(index => ({
                            id: '2-' + index,
                            name: '二级 2-' + index,
                            subs: [{
                                id: `2-${index}-1`,
                                name: `三级 2-${index}-1`
                            }]
                        })))
                    ]
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

                val: {},
            }
        },
        methods: {
            isLeaf(node) {
                return node.level > 3
            },
        },
    }
</script>

<style lang="scss">
</style>