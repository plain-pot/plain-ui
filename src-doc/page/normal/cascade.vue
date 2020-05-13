<template>
    <div class="demo-cascade">
        <demo-row title="cascade-panel">
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
                        :nodeDisabled="nodeDisabled"
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
                        <cascade-item :node="node" :index="index"/>
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
            <demo-row title="cascade-panel:点击分支的时候也能触发change">
                <demo-line>
                    {{val[6]}}
                </demo-line>
                <pl-cascade-panel
                        v-model="val[6]"
                        :data="treeData"
                        labelField="name"
                        keyField="id"
                        childrenField="subs"
                        selectBranch
                />
            </demo-row>
            <demo-row title="cascade-panel:筛选文本以及自定义筛选函数">
                <demo-line>
                    <pl-input v-model="filterText"/>
                </demo-line>
                <demo-line>
                    {{val[6]}}
                </demo-line>
                <pl-cascade-panel
                        v-model="val[6]"
                        :data="treeData"
                        labelField="name"
                        keyField="id"
                        childrenField="subs"
                        :filterText="filterText"
                        :filterMethod="filterMethod"
                />
            </demo-row>
        </demo-row>
        <demo-row title="cascade-service">
            <demo-row title="cascade service：基本用法">
                <pl-button label="open cascade" ref="test0" @click="test0.toggle()"/>
            </demo-row>
            <demo-row title="cascade service：懒加载">
                <pl-button label="open cascade" ref="lazyTest" @click="lazyTest.toggle()"/>
            </demo-row>
        </demo-row>

        <demo-row title="pl-cascade">
            <demo-row title="基本用法">
                <demo-line>
                    {{val[7]}}
                </demo-line>
                <pl-cascade
                        v-model="val[7]"
                        :data="treeData"
                        labelField="name"
                        keyField="id"
                        childrenField="subs"
                        @focus="$plain.log('focus')" @blur="$plain.log('blur')"
                />

            </demo-row>
            <demo-row title="禁用选项">
                <demo-line>
                    {{val[7]}}
                </demo-line>
                <pl-cascade
                        v-model="val[7]"
                        :data="treeData"
                        labelField="name"
                        keyField="id"
                        childrenField="subs"
                        :nodeDisabled="nodeDisabled"
                />
            </demo-row>
            <demo-row title="只显示最后一级文本">
                <demo-line>
                    {{val[8]}}
                </demo-line>
                <pl-cascade
                        v-model="val[8]"
                        :data="treeData"
                        labelField="name"
                        keyField="id"
                        childrenField="subs"
                        showLast
                />
            </demo-row>
            <demo-row title="可以选择分支（可以选择非叶子节点）">
                <demo-line>
                    {{val[9]}}
                </demo-line>
                <pl-cascade
                        v-model="val[9]"
                        :data="treeData"
                        labelField="name"
                        keyField="id"
                        childrenField="subs"
                        selectBranch
                />
            </demo-row>
            <demo-row title="动态加载">
                <demo-line>
                    {{formData}}
                </demo-line>
                <pl-cascade
                        :value="[formData.level1Key,formData.level2Key,formData.level3Key]"
                        @change="onCascadeChange"
                        :showFormat="showFormat"

                        labelField="name"
                        keyField="id"
                        childrenField="subs"
                        lazy
                        :getChildren="lazyDemo.getChildren"
                        :isLeaf="lazyDemo.isLeaf"
                />
                <pl-cascade
                        :value="[formData.level1Key,formData.level2Key,formData.level3Key]"
                        @change="onCascadeChange"
                        :showFormat="showFormat"

                        labelField="name"
                        keyField="id"
                        childrenField="subs"
                        lazy
                        :getChildren="lazyDemo.getChildren"
                        :isLeaf="lazyDemo.isLeaf"
                />
            </demo-row>

            <demo-row title="输入筛选">
                <demo-line>
                    {{val[10]}}
                </demo-line>
                <pl-cascade
                        v-model="val[10]"
                        :data="treeData"
                        labelField="name"
                        keyField="id"
                        childrenField="subs"
                        filterable
                />
            </demo-row>
            <demo-row title="自定义节点内容">
                <demo-line>
                    {{val[12]}}
                </demo-line>
                <pl-cascade
                        v-model="val[12]"
                        :data="treeData"
                        labelField="name"
                        keyField="id"
                        childrenField="subs"
                >
                    <template slot-scope="{node,index}">
                        {{index+1}}、{{node.data.name}}
                    </template>
                </pl-cascade>
            </demo-row>

            <demo-row title="禁用以及只读">
                <demo-line title="禁用">
                    <pl-checkbox v-model="flag.disabled" label="禁用"/>
                    <pl-cascade :data="treeData" labelField="name" keyField="id" childrenField="subs" :disabled="flag.disabled" v-model="val[13]"/>
                </demo-line>
                <demo-line title="只读">
                    <pl-checkbox v-model="flag.readonly" label="只读"/>
                    <pl-cascade :data="treeData" labelField="name" keyField="id" childrenField="subs" :readonly="flag.readonly" v-model="val[13]"/>
                </demo-line>
            </demo-row>

        </demo-row>
    </div>
</template>

<script>

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
            console.log('mounted', this.node.label)
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
                        }, Math.random() * 500 + 500)
                    })
                },
            }

            const newData = (name, option) => {
                let result = {
                    service: null,
                    option: {
                        props: {
                            data: () => this.treeData,
                            labelField: 'name',
                            keyField: 'id',
                            childrenField: 'subs',

                            value: null,
                            ...option,
                        },
                        popperProps: {
                            reference: () => this.$refs[name],
                        },
                        listener: {
                            change: (val) => {
                                this.$message(val.toString())
                                result.option.props.value = val
                            },
                        },
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