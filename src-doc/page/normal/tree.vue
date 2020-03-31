<template>
    <div class="demo-tree">
        <!--<demo-row title="基本用法">
            <demo-line>
                <pl-button-group>
                    <pl-button label="全部展开" @click="$refs.tree1.expandAll()"/>
                    <pl-button label="全部收起" @click="$refs.tree1.collapseAll()"/>
                    <pl-button label="展开特定节点" @click="$refs.tree1.expand('8')"/>
                    <pl-button label="当前选中节点" @click="showCurrent"/>
                </pl-button-group>
            </demo-line>
            <pl-tree ref="tree1"
                     :data="treeData"
                     keyField="id"
                     labelField="name"
                     childrenField="subs"
                     @node-click="onNodeClick"/>
        </demo-row>-->


        <!-- <demo-row title="初始化的时候就渲染所有隐藏的节点，而不是第一次展开的时候才渲染">
             <pl-tree :data="treeData"
                      keyField="id"
                      labelField="name"
                      childrenField="subs"
                      :renderAfterExpand="false"/>
         </demo-row>-->

        <demo-row title="懒加载叶子节点">
            <demo-line>
                <pl-button label="log" @click="$plain.log($refs.lazyTree)"/>
            </demo-line>
            <pl-tree ref="lazyTree" keyField="id"
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
                    }],
                lazyDemo: {
                    isLeaf: (treeNode) => {
                        return treeNode.level >= 2 || (!!treeNode.children && treeNode.children.level === 0)
                    },
                    getChildren: (treeNode, resolve) => {
                        if (!treeNode) {
                            // 加载一级数据
                            this.lazyDemo.getCitiesByParentId(null).then(resolve)
                        } else {
                            switch (treeNode.level) {
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
                        }
                    },
                    getCitiesByParentId(parentId) {
                        return new Promise((resolve) => {
                            // 这个是模拟在数据库表中的数据
                            const data = [
                                {id: '1', name: '广东省', parentId: null},
                                {id: '2', name: '湖南省', parentId: null},
                                {id: '3', name: '陕西省', parentId: null},

                                {id: '4', name: '佛山市', parentId: '1'},
                                {id: '5', name: '深圳市', parentId: '1'},

                                {id: '6', name: '长沙市', parentId: '2'},
                                {id: '7', name: '邵阳市', parentId: '2'},
                                {id: '8', name: '衡阳市', parentId: '2'},
                            ]

                            // 模拟请求，请求时间大概在1s-4s之间
                            setTimeout(() => {
                                resolve(data.filter(item => item.parentId === parentId))
                            }, Math.random() * 3000 + 1000)
                        })
                    },
                },
            }
        },
        methods: {
            onNodeClick(treeNode) {
                console.log(treeNode)
            },
            showCurrent() {
                let current = this.$refs.tree1.getCurrent()
                this.$message(!!current ? current.data.name : '未选中任何节点！')
            },
        },
    }
</script>

<style lang="scss">
    .demo-tree {
        .demo-row-content {
            width: 300px;
        }
    }
</style>