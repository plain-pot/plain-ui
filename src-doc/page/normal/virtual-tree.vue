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
                             :data="[]"
                             keyField="id"
                             labelField="name"
                             childrenField="subs"
                             @node-click="val=>$plain.log(val.data.name)"/>
        </demo-row>

        <demo-row title="懒加载子节点">
            <pl-virtual-tree ref="lazyTree"
                             keyField="id"
                             labelField="name"
                             childrenField="subs"
                             lazy
                             :isLeaf="lazyDemo.isLeaf"
                             :getChildren="lazyDemo.getChildren"
            />
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
                filterText: null,
                treeData,
                lazyDemo: {
                    isLeaf: (treeNode) => {
                        return treeNode.level >= 3
                    },
                    getChildren: (treeNode, resolve) => {
                        switch (treeNode.level) {
                            case 0:
                                // 加载一级数据
                                this.lazyDemo.getCitiesByParentId(null).then(resolve)
                                break
                            case 1:
                                // 加载二级数据
                                this.lazyDemo.getCitiesByParentId(treeNode.data.id).then(resolve)
                                break
                            case 2:
                                // 加载三级数据
                                this.lazyDemo.getCitiesByParentId(treeNode.data.id).then(resolve)
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
                },
                scopedSlotDemo: {
                    treeData: this.$plain.utils.deepcopy(treeData),
                    renderContent: (h, data) => {
                        return (
                            <div style="width:100%;display: flex;justify-content: space-between">
                                <span>{data.data.name}}</span>
                                <pl-button-group mode="text">
                                    <pl-button label="Add" onClick={e => {
                                        e.stopPropagation();
                                        this.scopedSlotDemo.addItem(data)
                                    }} size="mini"/>
                                    <pl-button label="Del" onClick={e => {
                                        e.stopPropagation();
                                        this.scopedSlotDemo.deleteItem(data)
                                    }} size="mini" status="error"/>
                                </pl-button-group>
                            </div>
                        )
                    },
                    addItem: (e, treeNode) => {
                        e.stopPropagation()
                        const {data} = treeNode
                        const subs = data.subs || []

                        const name = `n-${data.id}-${subs.length + 1}`
                        const id = name + Date.now().toString()
                        subs.push({
                            id,
                            name: `new item ${name}`,
                        })
                        this.$set(data, 'subs', subs)
                        this.$nextTick(() => this.$refs.scopedSlotDemo.expand(id))
                    },
                    deleteItem: (e, treeNode) => {
                        e.stopPropagation()
                        let {data, parent} = treeNode
                        const subs = !!parent ? parent.data.subs : this.treeData
                        subs.splice(subs.indexOf(data), 1)
                    },
                },
                renderDemo: {
                    treeData: this.$plain.utils.deepcopy(treeData),
                    renderContent: (h, data) => {
                        return (
                            <div style="width:100%;display: flex;justify-content: space-between">
                                <span>{data.data.name}</span>
                                <pl-button-group mode="text">
                                    <pl-button label="Add" onClick={e => this.renderDemo.addItem(e, data)} size="mini"/>
                                    <pl-button label="Del" onClick={e => this.renderDemo.deleteItem(e, data)} size="mini" status="error"/>
                                </pl-button-group>
                            </div>
                        )
                    },
                    addItem: (e, treeNode) => {
                        e.stopPropagation()
                        const {data} = treeNode
                        const subs = data.subs || []

                        const name = `n-${data.id}-${subs.length + 1}`
                        const id = name + Date.now().toString()
                        subs.push({
                            id,
                            name: `new item ${name}`,
                        })
                        this.$set(data, 'subs', subs)
                        this.$nextTick(() => this.$refs.renderDemo.expand(id))
                    },
                    deleteItem: (e, treeNode) => {
                        e.stopPropagation()
                        let {data, parent} = treeNode
                        const subs = !!parent ? parent.data.subs : this.treeData
                        subs.splice(subs.indexOf(data), 1)
                    },
                },
                currentKey: null,
            }
        },
        methods: {
            onNodeClick(treeNode) {
                console.log(treeNode.data.name)
            },
            showCurrent() {
                let current = this.$refs.tree1.getCurrent()
                this.$message(!!current ? current.data.name : '未选中任何节点！')
            },
            expandAndSelect() {
                this.$refs.tree1.expand('2-2-2')
                this.$refs.tree1.setCurrent('2-2-2')
            },
            async expandSome() {
                // console.log('start')
                await this.$refs.tree1.expand(['2-2-2', '3-1-2'])
                // console.log('end')
                console.log(Array.from(this.$el.querySelectorAll('.pl-tree-node')).length)
            },
            filterNodeMethod(treeNode) {
                const data = treeNode.data
                if (!this.filterText) return true;
                return data.name.indexOf(this.filterText) !== -1;
            },
            isCheckable(treeNode) {
                return treeNode.label.endsWith('1')
            },
            nodeIcon(treeNode) {
                return treeNode.isLeaf ? 'el-icon-document' : 'el-icon-folder-opened'
            },
        },
    }
</script>

<style lang="scss">

    @include themify {
        .pl-virtual-tree {
            .pl-list-move-right-enter {
                opacity: 0;
                transform: translateX(100px);
            }
        }
    }
</style>