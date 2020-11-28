<template>
    <div class="demo-tree">
        <demo-row title="基本用法">

            <demo-line>
                <pl-button-group>
                    <pl-button label="全部展开" @click="$refs.tree1.methods.expandAll()"/>
                    <pl-button label="全部收起" @click="$refs.tree1.methods.collapseAll()"/>
                    <pl-button label="展开特定节点" @click="$refs.tree1.methods.expand('2-2-2')"/>
                    <pl-button label="展开部分节点" @click="tree1.expandSome"/>
                    <pl-button label="当前选中节点" @click="tree1.showCurrent"/>
                    <pl-button label="展开并且设置当前选中节点" @click="tree1.expandAndSelect"/>
                </pl-button-group>
            </demo-line>

            <pl-tree
                    height="330px"
                    ref="tree1"
                    :data="treeData"
                    keyField="id"
                    labelField="name"
                    childrenField="subs"
                    expandOnClickNode>
            </pl-tree>
        </demo-row>

        <demo-row title="懒加载子节点">
            <pl-tree
                    height="330px"
                    ref="lazyTree"
                    keyField="id"
                    labelField="name"
                    childrenField="subs"
                    lazy
                    :isLeaf="lazyDemo.isLeaf"
                    :getChildren="lazyDemo.getChildren"
            />
        </demo-row>

        <demo-row title="多选">
            <demo-line>
                <pl-button-group>
                    <pl-button label="展开所有节点" @click="$refs.checkTree.methods.expandAll()"/>
                    <pl-button label="全部收起" @click="$refs.checkTree.methods.collapseAll()"/>
                    <pl-button label="全部选中" @click="$refs.checkTree.methods.checkAll()"/>
                    <pl-button label="全部取消" @click="$refs.checkTree.methods.uncheckAll()"/>
                    <pl-button label="选中部分数据" @click="$refs.checkTree.methods.check(['1-1-1','2-2-2'])"/>
                    <pl-button label="获取选中的数据" @click="$message($refs.checkTree.methods.getCheckedData().map(item=>item.name).join(','),{time:null})"/>
                </pl-button-group>
            </demo-line>
            <pl-tree
                    ref="checkTree"
                    height="330px"
                    showCheckbox
                    expandOnClickNode
                    :data="treeData"
                    keyField="id"
                    labelField="name"
                    childrenField="subs"/>
        </demo-row>

    </div>
</template>

<script>

    import treeData from '../data/tree.data'

    export default {
        name: "tree",
        data() {
            return {
                treeData,

                tree1: (() => ({
                    showCurrent: () => {
                        let current = this.$refs.tree1.methods.getCurrent()
                        this.$message(!!current ? current.data.name : '未选中任何节点！')
                    },
                    expandSome: async () => {
                        // console.log(this.$refs.tree1.state)
                        await this.$refs.tree1.methods.expand(['2-2-2', '3-1-2'])
                    },
                    expandAndSelect: () => {
                        this.$refs.tree1.methods.expand('2-2-2')
                        this.$refs.tree1.methods.setCurrent('2-2-2')
                    },
                }))(),

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
            }
        },
    }
</script>

<style lang="scss">

</style>