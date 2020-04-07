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
            />
        </demo-row>

        <demo-row title="cascade-panel: 懒加载">
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
        <demo-row title="cascade-panel: 懒加载，有默认值">
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

        <demo-row title="cascade-panel: init value">
            <demo-line>
                {{val[2]}}
            </demo-line>
            <pl-cascade-panel
                    v-model="val[2]"
                    :data="treeData"
                    labelField="name"
                    keyField="id"
                    childrenField="subs"
            />
        </demo-row>

        <demo-row title="cascade-panel:hover 触发器">
            <demo-line>
                {{val[3]}}
            </demo-line>
            <pl-cascade-panel
                    trigger="hover"
                    v-model="val[3]"
                    :data="treeData"
                    labelField="name"
                    keyField="id"
                    childrenField="subs"
            />
        </demo-row>
        <demo-row title="cascade-panel:禁用部分选项">
            <demo-line>
                禁用掉叶子节点，并且节点名称中含有[2]的节点
            </demo-line>
            <demo-line>
                {{val[4]}}
            </demo-line>
            <pl-cascade-panel
                    :isDisabled="isDisabled"
                    v-model="val[4]"
                    :data="treeData"
                    labelField="name"
                    keyField="id"
                    childrenField="subs"
            />
        </demo-row>

        <demo-row title="cascade-panel:自定义内容-作用域插槽">
            <demo-line>
                {{val[5]}}
            </demo-line>
            <pl-cascade-panel
                    v-model="val[5]"
                    :data="treeData"
                    labelField="name"
                    keyField="id"
                    childrenField="subs"
            >
                <template slot-scope="{node,index}">
                    {{index+1}}. {{node.data.name}}
                </template>
            </pl-cascade-panel>
        </demo-row>

        <demo-row title="cascade-panel:自定义内容-渲染函数">
            <demo-line>
                {{val[5]}}
            </demo-line>
            <pl-cascade-panel
                    v-model="val[5]"
                    :data="treeData"
                    labelField="name"
                    keyField="id"
                    childrenField="subs"
                    :renderContent="renderContent"
            >
            </pl-cascade-panel>
        </demo-row>

        <demo-row title="cascade service：基本用法">
            <pl-button label="open cascade" ref="test0" @click="test0.toggle()"/>
        </demo-row>
        <demo-row title="cascade service：懒加载">
            <pl-button label="open cascade" ref="lazyTest" @click="lazyTest.toggle()"/>
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

            const lazyDemo = {
                isLeaf: (node) => {
                    return node.level >= 3
                },
                getChildren: (node, resolve) => {
                    switch (node.level) {
                        case 0:
                            // 加载一级数据
                            this.lazyDemo.getCitiesByParentId(null).then(resolve)
                            break
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
                        }, Math.random() * 1000 + 1000)
                    })
                },
            }

            const newData = (name, option) => {
                let result = {
                    service: null,
                    option: {
                        data: () => this.treeData,
                        labelField: 'name',
                        keyField: 'id',
                        childrenField: 'subs',

                        value: null,
                        reference: () => this.$refs[name],
                        on: {
                            change: (val) => {
                                this.$message(val.toString())
                                result.option.value = val
                            },
                        },
                        ...option,
                    },
                    toggle: async () => {
                        if (!result.service) {
                            result.service = await this.$plain.$cascade(result.option)
                        }
                        result.service.toggle()
                    },
                }
                return result
            }

            // 无初始值
            const test0 = newData('test0', {})

            const lazyTest = newData('lazyTest', {
                lazy: true,
                isLeaf: lazyDemo.isLeaf,
                getChildren: lazyDemo.getChildren,
                data: null,
            })

            return {
                treeData,
                lazyDemo,
                val: {
                    11: ["6", "7", "9"],
                    2: ["2", "2-1", "2-1-1"],
                },

                test0,
                lazyTest,
            }
        },
        methods: {
            isLeaf(node) {
                return node.level > 3
            },
            isDisabled(node) {
                return node.isLeaf && node.label.indexOf('2') > 0
            },
            renderContent(h, {node, index}) {
                return (
                    <div>
                        {index + 1}. {node.data.name}
                    </div>
                )
            },
        },
    }
</script>

<style lang="scss">
</style>