<template>
    <div class="demo-cascade">
        <demo-row title="CascadePanel">
            <demo-row title="基本用法">
                <demo-line>
                    {{val[0]}}
                </demo-line>
                <pl-cascade-panel
                        v-model="val[0]"
                        :data="treeData"
                        :labelField="labelFlag?'id':'name'"
                        keyField="id"
                        childrenField="subs"
                />
            </demo-row>

            <demo-row title="懒加载">
                <demo-line>
                    {{val[1]}}
                </demo-line>
                <pl-cascade-panel
                        v-model="val[1]"
                        labelField="name"
                        keyField="id"
                        childrenField="subs"
                        lazy
                        :isLeaf="lazyDemo.isLeaf"
                        :getChildren="lazyDemo.getChildren"
                />
            </demo-row>

            <demo-row title="懒加载，有默认值">
                <demo-line>
                    {{val[11]}}
                </demo-line>
                <pl-cascade-panel
                        v-model="val[11]"
                        labelField="name"
                        keyField="id"
                        childrenField="subs"
                        lazy
                        :isLeaf="lazyDemo.isLeaf"
                        :getChildren="lazyDemo.getChildren"
                />
            </demo-row>

        </demo-row>

    </div>
</template>

<script>
    export default {
        name: "cascade",
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

            const lazyDemo = {
                isLeaf: (node) => {
                    return node.level >= 3
                },
                getChildren: (node, resolve) => {
                    if (!node) {
                        // 加载一级数据
                        this.lazyDemo.getCitiesByParentId(null).then(resolve)
                        return
                    }
                    switch (node.level) {
                        case 1:
                            // 加载二级数据
                            this.lazyDemo.getCitiesByParentId(node.data.id).then(resolve)
                            break
                        case 2:
                            // 加载三级数据
                            this.lazyDemo.getCitiesByParentId(node.data.id).then(resolve)
                            break
                        default:
                            return null
                    }
                },
                getCitiesByParentId(parentId) {
                    return new Promise((resolve) => {
                        // 这个是模拟在数据库表中的数据
                        const data = [
                            {id: '1', name: '广东省', parentId: null, subs: []},
                            {id: '2', name: '佛山市', parentId: '1', subs: []},
                            {id: '3', name: '深圳市', parentId: '1', subs: []},
                            {id: '4', name: '禅城区', parentId: '2', subs: []},
                            {id: '5', name: '南山区', parentId: '3', subs: []},

                            {id: '6', name: '湖南省', parentId: null, subs: []},
                            {id: '7', name: '长沙市', parentId: '6', subs: []},
                            {id: '8', name: '邵阳市', parentId: '6', subs: []},
                            {id: '9', name: '天心区', parentId: '7', subs: []},

                            {id: '11', name: '陕西省', parentId: null, subs: []},
                        ]

                        // 模拟请求，请求时间大概在1s-2s之间
                        setTimeout(() => {
                            resolve(data.filter(item => item.parentId === parentId))
                        }, Math.random() * 500 + 500)
                    })
                },
            }

            return {
                val: {
                    11: ["6", "7", "9"],
                    2: ["2", "2-1", "2-1-1"],
                },
                treeData,
                labelFlag: false,
                lazyDemo,
            }
        },
        methods: {},
    }
</script>

<style lang="scss">

</style>