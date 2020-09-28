<template>
    <div class="demo-cascade">
        <demo-row title="cascade-service">
            <demo-row title="cascade service：基本用法">
                <pl-button label="open cascade" ref="test0" @click="test0.toggle()"/>
            </demo-row>
            <demo-row title="cascade service：懒加载">
                <pl-button label="open cascade" ref="lazyTest" @click="lazyTest.toggle()"/>
            </demo-row>
        </demo-row>
    </div>
</template>

<script>

    import {$cascade} from "../../../src/packages/cascade/CascadeService";

    const CascadeItem = {
        props: {
            node: {},
            index: {},
        },
        render(h) {
            return (
                <div>
                    {this.index}, {this.node.label}
                </div>
            )
        },
        mounted() {
            // console.log('mounted', this.node.label)
        },
    }

    export default {
        name: "cascade",
        props: {},
        components: {CascadeItem},
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

            const newData = (name, option) => {
                let result = {
                    agent: null,
                    option: {
                        reference: () => this.$refs[name],
                        props: {
                            data: treeData,
                            labelField: 'name',
                            keyField: 'id',
                            childrenField: 'subs',

                            value: null,
                            ...option,
                        },
                        listener: {
                            change: (val) => {
                                this.$message(val.toString())
                                result.option.props.value = val
                            },
                        },
                    },
                    toggle: async () => {
                        if (!result.agent) {
                            result.agent = await $cascade(() => result.option)
                        }
                        console.log(result.agent)
                        result.agent.toggle()
                    },
                }
                return result
            }

            // 无初始值
            const test0 = newData('test0', {
                renderContent: (...args) => this.renderContent(...args)
            })

            const lazyTest = newData('lazyTest', {
                lazy: true,
                isLeaf: lazyDemo.isLeaf,
                getChildren: lazyDemo.getChildren,
                data: null,
            })

            return {
                label: false,
                treeData,
                lazyDemo,
                val: {
                    11: ["6", "7", "9"],
                    2: ["2", "2-1", "2-1-1"],
                },

                test0,
                lazyTest,

                filterText: null,
                // filterMethod: null,
                filterMethod: (nodes, text) => {
                    return nodes.some(node => node.key.indexOf(text) > -1)
                },

                formData: {
                    level1Name: '广东省',
                    level1Key: '1',
                    level2Name: '深圳市',
                    level2Key: '3',
                    level3Name: '南山区',
                    level3Key: '5',
                },

                flag: {
                    disabled: true,
                    readonly: true
                },
            }
        },
        methods: {
            isLeaf(node) {
                return node.level > 3
            },
            nodeDisabled(node) {
                return node.isLeaf && node.label.indexOf('2') > 0
            },
            renderContent(h, {node, index}) {
                return (
                    <div>
                        <CascadeItem node={node} index={index}/>
                    </div>
                )
            },

            onCascadeChange(value, nodes) {
                console.log('onCascadeChange', value, nodes)
                if (!value) {
                    this.formData.level1Name = null
                    this.formData.level1Key = null
                    this.formData.level2Name = null
                    this.formData.level2Key = null
                    this.formData.level3Name = null
                    this.formData.level3Key = null
                } else {
                    this.formData.level1Name = nodes[0].data.name
                    this.formData.level1Key = value[0]
                    this.formData.level2Name = nodes[1].data.name
                    this.formData.level2Key = value[1]
                    this.formData.level3Name = nodes[2].data.name
                    this.formData.level3Key = value[2]
                }
            },
            showFormat() {
                return [this.formData.level1Name, this.formData.level2Name, this.formData.level3Name].filter(item => !!item).join(' / ')
            },
        },
    }
</script>

<style lang="scss">
</style>