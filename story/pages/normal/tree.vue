<template>
    <div class="demo-tree">
        <demo-row title="基本用法">

            <demo-line>
                <pl-button-group>
                    <pl-button label="全部展开" @click="$refs.tree1.expandAll()"/>
                    <pl-button label="全部收起" @click="$refs.tree1.collapseAll()"/>
                    <pl-button label="展开特定节点" @click="$refs.tree1.expand('2-2-2')"/>
                    <pl-button label="展开部分节点" @click="tree1.expandSome"/>
                    <pl-button label="当前选中节点" @click="tree1.showCurrent"/>
                    <pl-button label="展开并且设置当前选中节点" @click="tree1.expandAndSelect"/>
                </pl-button-group>
            </demo-line>

            <div style="height: 500px">
                <pl-tree
                        ref="tree1"
                        :data="treeData"
                        keyField="id"
                        labelField="name"
                        childrenField="subs"
                        expandOnClickNode>
                </pl-tree>
            </div>
        </demo-row>

        <demo-row title="多选">
            <demo-line>
                <pl-button-group>
                    <pl-button label="展开所有节点" @click="$refs.checkTree.expandAll()"/>
                    <pl-button label="全部收起" @click="$refs.checkTree.collapseAll()"/>
                    <pl-button label="全部选中" @click="$refs.checkTree.checkAll()"/>
                    <pl-button label="全部取消" @click="$refs.checkTree.uncheckAll()"/>
                    <pl-button label="选中部分数据" @click="$refs.checkTree.check(['1-1-1','2-2-2'])"/>
                    <pl-button label="获取选中的数据" @click="$message($refs.checkTree.getCheckedData().map(node=>node.data.name).join('____'),{time:null})"/>
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

        <demo-row title="懒加载子节点">
            <demo-line>
                <pl-button label="打印数据" @click="log(lazyDemo.treeData)"/>
                <pl-button label="获取选中的数据" @click="$message($refs.lazyTree.getCheckedData().map(node=>node.data.name).join('____'),{time:null})"/>
            </demo-line>
            <pl-tree
                    v-model:data="lazyDemo.treeData"
                    showCheckbox
                    expandOnClickNode
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


        <demo-row title="多选：父子互不关联">
            <demo-line>
                <pl-button-group>
                    <pl-button label="展开所有节点" @click="$refs.checkStrictlyTree.expandAll()"/>
                    <pl-button label="全部收起" @click="$refs.checkStrictlyTree.collapseAll()"/>
                    <pl-button label="全部选中" @click="$refs.checkStrictlyTree.checkAll()"/>
                    <pl-button label="全部取消" @click="$refs.checkStrictlyTree.uncheckAll()"/>
                    <pl-button label="选中部分数据" @click="$refs.checkStrictlyTree.check(['1-1-1','2-2-2'])"/>
                    <pl-button label="获取选中的数据" @click="$message($refs.checkStrictlyTree.getCheckedData().map(node=>node.data.name).join('____'),{time:null})"/>
                </pl-button-group>
            </demo-line>
            <pl-tree ref="checkStrictlyTree"
                     height="330px"
                     showCheckbox
                     checkStrictly
                     :data="treeData"
                     keyField="id"
                     labelField="name"
                     childrenField="subs"/>
        </demo-row>

        <demo-row title="多选：禁用部分选项，只能勾选1结尾的节点">
            <demo-line>
                <pl-button-group>
                    <pl-button label="展开所有节点" @click="$refs.checkableTree.expandAll()"/>
                    <pl-button label="全部选中" @click="$refs.checkableTree.checkAll()"/>
                    <pl-button label="全部取消" @click="$refs.checkableTree.uncheckAll()"/>
                    <pl-button label="选中部分数据" @click="$refs.checkableTree.check(['1-1-1','2-2-2'])"/>
                    <pl-button label="获取选中的数据" @click="$message($refs.checkableTree.getCheckedData().map(node=>node.data.name).join('____'),{time:null})"/>
                </pl-button-group>
            </demo-line>
            <pl-tree ref="checkableTree"
                     height="330px"
                     showCheckbox
                     :data="treeData"
                     keyField="id"
                     labelField="name"
                     childrenField="subs"
                     :isCheckable="isCheckable"/>
        </demo-row>

        <demo-row title="自定义内容：作用域插槽">

            <demo-line>
                <pl-button-group>
                    <pl-button label="全部展开" @click="$refs.scopedSlotDemo.expandAll()"/>
                    <pl-button label="全部收起" @click="$refs.scopedSlotDemo.collapseAll()"/>
                    <pl-button label="当前选中节点" @click="$message(!!$refs.scopedSlotDemo.getCurrent() ? $refs.scopedSlotDemo.getCurrent().data.name : '未选中任何节点！')"/>
                    <pl-button label="获取选中的数据" @click="$message($refs.scopedSlotDemo.getCheckedData().map(node=>node.data.name).join('____'),{time:null})"/>
                    <pl-button label="打印数据" @click="log(scopedSlotDemo.treeData)"/>
                </pl-button-group>
            </demo-line>

            <pl-tree ref="scopedSlotDemo"
                     height="330px"
                     :data="scopedSlotDemo.treeData"
                     keyField="id"
                     labelField="name"
                     childrenField="subs"
                     style="width: 500px"
                     showCheckbox>
                <template v-slot="{node}">
                    <div style="width:100%;display: flex;justify-content: space-between">
                        <span>{{node.data.name}}</span>
                        <pl-button-group mode="text">
                            <pl-button label="Add" @click="e=>scopedSlotDemo.addItem(e,node)" size="mini"/>
                            <pl-button label="Del" @click="e=>scopedSlotDemo.deleteItem(e,node)" size="mini" status="error"/>
                            <pl-button label="Clr" @click="e=>scopedSlotDemo.clear(e,node)" size="mini" status="error"/>
                        </pl-button-group>
                    </div>
                </template>
            </pl-tree>
        </demo-row>

        <demo-row title="自定义内容：渲染函数">

            <demo-line>
                <pl-button-group>
                    <pl-button label="全部展开" @click="$refs.renderDemo.expandAll()"/>
                    <pl-button label="全部收起" @click="$refs.renderDemo.collapseAll()"/>
                    <pl-button label="当前选中节点" @click="$message(!!$refs.renderDemo.getCurrent() ? $refs.renderDemo.getCurrent().data.name : '未选中任何节点！')"/>
                    <pl-button label="获取选中的数据" @click="$message($refs.renderDemo.getCheckedData().map(node=>node.data.name).join('____'),{time:null})"/>
                </pl-button-group>
            </demo-line>

            <pl-tree ref="renderDemo"
                     :data="renderDemo.treeData"
                     height="330px"
                     keyField="id"
                     labelField="name"
                     childrenField="subs"
                     style="width: 500px"
                     showCheckbox
                     :renderContent="renderDemo.renderContent"/>
        </demo-row>

        <demo-row title="节点图标">
            <pl-tree defaultExpandAll
                     :data="treeData"
                     height="330px"
                     keyField="id"
                     labelField="name"
                     childrenField="subs"
                     :nodeIcon="nodeIcon"/>
        </demo-row>

        <demo-row title="手风琴模式，展开节点的时候关闭兄弟节点">
            <pl-tree according
                     :data="treeData"
                     height="330px"
                     keyField="id"
                     labelField="name"
                     childrenField="subs"/>
        </demo-row>

        <demo-row title="自定义过滤函数">
            <demo-line>
                <pl-input v-model="filterDemo.filterText" suffixIcon="el-icon-search" clearIcon/>
            </demo-line>
            <pl-tree defaultExpandAll
                     :data="treeData"
                     height="330px"
                     keyField="id"
                     labelField="name"
                     childrenField="subs"
                     :filterNodeMethod="filterDemo.filterNodeMethod"/>
        </demo-row>

        <demo-row title="绑定currentKey">
            <demo-line>
                <pl-button label="全部展开" @click="$refs.currentTree.expandAll()"/>
                <pl-button label="设置currentKey" @click="currentKey = '3-1-1'"/>
                {{currentKey}}
            </demo-line>
            <pl-tree ref="currentTree"
                     height="330px"
                     :currentKey="currentKey"
                     :data="treeData"
                     keyField="id"
                     labelField="name"
                     childrenField="subs"
                     @current-change="treeNode=>currentKey = treeNode.key"/>
        </demo-row>

        <demo-row title="展开图标">
            <pl-tree
                    :data="treeData"
                    height="330px"
                    keyField="id"
                    labelField="name"
                    childrenField="subs"
                    folderExpandIcon="el-icon-caret-bottom"
                    folderCollapseIcon="el-icon-caret-right"
                    leafIcon="el-icon-paperclip"
            />
        </demo-row>

        <demo-row title="虚拟滚动">
            <demo-line>
                <pl-button-group>
                    <pl-button label="全部展开" @click="$refs.virtualTree.expandAll()"/>
                    <pl-button label="全部收起" @click="$refs.virtualTree.collapseAll()"/>
                    <pl-button label="当前选中节点" @click="$message(!!$refs.virtualTree.getCurrent() ? $refs.virtualTree.getCurrent().data.name : '未选中任何节点！')"/>
                    <pl-button label="获取选中的数据" @click="$message($refs.virtualTree.getCheckedData().map(node=>node.data.name).join('____'),{time:null})"/>
                    <pl-button label="打印数据" @click="log(addressData)"/>
                </pl-button-group>
            </demo-line>
            <pl-tree ref="virtualTree"
                     :data="addressData"
                     keyField="id"
                     labelField="name"
                     childrenField="children"
                     height="360px"
                     width="500px"
                     virtual
                     showCheckbox
                     @node-click="val=>$message(val.data.name)"/>
        </demo-row>

        <demo-row title="拖拽节点">
            <demo-line>
                <pl-button label="全部展开" @click="$refs.dragTree.expandAll()"/>
                <pl-button label="打印数据" @click="log(treeData)"/>
            </demo-line>
            <pl-tree
                    ref="dragTree"
                    :data="treeData"
                    defaultExpandAll
                    height="360px"
                    keyField="id"
                    labelField="name"
                    childrenField="subs"
                    draggable>
                <template v-slot="{node:{data}}">
                    <span :style="{color:data.id.charAt(0) === '1'?'#12b4a5':(data.id.charAt(0) === '2'?'#00CC00':'#F38585')}">{{data.name}}</span>
                </template>
            </pl-tree>
        </demo-row>

        <demo-row title="拖拽节点+可勾选">
            <pl-card width="100%" title="勾选行为说明" style="margin: 10px 0;">
                <li>父子关联模式下，拖拽节点可能会引起 选中/取消选中 事件</li>
                <li>拖拽节点会刷新节点的状态，每个节点会先判断子节点是否全都选中，全部选中并且自身未选中的情况下，会选中自身</li>
                <li>自身选中，但是存在子节点未选中的情况下，会取消选中自身</li>
                <li>非父子关联模式下，拖拽节点不会导致节点选中状态变化</li>
            </pl-card>
            <demo-line>
                <pl-button label="全部展开" @click="$refs.dragAndCheckTree.expandAll()"/>
                <pl-button label="打印数据" @click="log(treeData)"/>
                <pl-button label="获取选中的数据" @click="$message($refs.dragAndCheckTree.getCheckedData().map(node=>node.data.name).join('____'),{time:null})"/>
            </demo-line>
            <pl-tree
                    ref="dragAndCheckTree"
                    height="360px"
                    :data="treeData"
                    defaultExpandAll
                    keyField="id"
                    labelField="name"
                    childrenField="subs"
                    showCheckbox
                    draggable/>
        </demo-row>

        <demo-row title="拖拽节点：可拖拽allowDrag以及可放置allowDrop">
            <pl-card title="控制说明">
                <li>2-2开头的id不能被拖拽</li>
                <li>3开头的id不能放置任何节点</li>
            </pl-card>
            <pl-tree
                    height="360px"
                    :data="treeData"
                    defaultExpandAll
                    keyField="id"
                    labelField="name"
                    childrenField="subs"
                    draggable
                    :allowDrag="allowDrag"
                    :allowDrop="allowDrop"
            />
        </demo-row>

        <demo-row title="可拖拽+虚拟滚动">
            <demo-line>
                <pl-button-group>
                    <pl-button label="全部展开" @click="$refs.virtualTreeWithDrag.expandAll()"/>
                    <pl-button label="全部收起" @click="$refs.virtualTreeWithDrag.collapseAll()"/>
                    <pl-button label="当前选中节点" @click="$message(!!$refs.virtualTreeWithDrag.getCurrent() ? $refs.virtualTreeWithDrag.getCurrent().data.name : '未选中任何节点！')"/>
                    <pl-button label="获取选中的数据" @click="$message($refs.virtualTreeWithDrag.getCheckedData().map(node=>node.data.name).join(','),{time:null})"/>
                    <pl-button label="打印数据" @click="log(treeData)"/>
                </pl-button-group>
            </demo-line>
            <pl-tree
                    ref="virtualTreeWithDrag"
                    :data="addressData"
                    defaultExpandAll
                    keyField="id"
                    labelField="name"
                    childrenField="children"
                    height="360px"
                    width="500px"
                    virtual
                    draggable
                    showCheckbox
                    @click-node="val=>log(val.data.name)"/>
        </demo-row>

    </div>
</template>

<script>

    import treeData from '../data/tree.data'
    import addressData from '../data/address'
    import {deepcopy} from "plain-utils/object/deepcopy";

    export default {
        name: "tree",
        data() {
            return {
                treeData,
                addressData,
                currentKey: '',

                tree1: (() => ({
                    showCurrent: () => {
                        let current = this.$refs.tree1.getCurrent()
                        this.$message(!!current ? current.data.name : '未选中任何节点！')
                    },
                    expandSome: async () => {
                        // console.log(this.$refs.tree1.state)
                        await this.$refs.tree1.expand(['2-2-2', '3-1-2'])
                    },
                    expandAndSelect: () => {
                        this.$refs.tree1.expand('2-2-2')
                        this.$refs.tree1.setCurrent('2-2-2')
                    },
                }))(),

                lazyDemo: {
                    treeData: [],
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

                isCheckable(treeNode) {
                    return treeNode.data.name.endsWith('1')
                },

                scopedSlotDemo: {
                    treeData: deepcopy(treeData),
                    addItem: (e, treeNode) => {
                        e.stopPropagation()
                        const {data} = treeNode
                        if (!data.subs) {data.subs = []}
                        const subs = data.subs
                        const name = `n-${data.id}-${subs.length + 1}`
                        const id = name + Date.now().toString()
                        subs.push({id, name: `new item ${name}`,})
                        this.$refs.scopedSlotDemo.refreshCheckStatus(treeNode)
                        this.$nextTick().then(() => this.$refs.scopedSlotDemo.expand(id))
                    },
                    deleteItem: (e, treeNode) => {
                        e.stopPropagation()
                        let {data, parentRef} = treeNode
                        const parent = parentRef()
                        const subs = parent.data.subs
                        const ids = subs.map(item => item.id)
                        subs.splice(ids.indexOf(data.id), 1)
                        this.$refs.scopedSlotDemo.refreshCheckStatus(treeNode.parentRef())
                    },
                    clear: (e, treeNode) => {
                        e.stopPropagation()
                        treeNode.data.subs = []
                    },
                },

                log(...args) {
                    console.log(...args)
                },

                renderDemo: {
                    treeData: deepcopy(treeData),
                    renderContent: ({node}) => {
                        return (
                            <div style="width:100%;display: flex;justify-content: space-between">
                                <span>{node.data.name}</span>
                                <pl-button-group mode="text">
                                    <pl-button label="Add" onClick={e => this.renderDemo.addItem(e, node)} size="mini"/>
                                    <pl-button label="Del" onClick={e => this.renderDemo.deleteItem(e, node)} size="mini" status="error"/>
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
                        data.subs = subs
                        this.$refs.renderDemo.refreshCheckStatus(treeNode)
                        this.$nextTick().then(() => this.$refs.renderDemo.expand(id))
                    },
                    deleteItem: (e, treeNode) => {
                        e.stopPropagation()
                        let {data, parentRef} = treeNode
                        const parent = parentRef()
                        const subs = parent.data.subs
                        const ids = subs.map(item => item.id)
                        subs.splice(ids.indexOf(data.id), 1)
                        this.$refs.renderDemo.refreshCheckStatus(treeNode.parentRef())
                    },
                },

                nodeIcon(treeNode) {
                    return treeNode.isLeaf ? 'el-icon-male' : 'el-icon-female'
                },

                filterDemo: {
                    filterText: '',
                    filterNodeMethod: (treeNode) => {
                        const data = treeNode.data
                        if (!this.filterDemo.filterText) return true;
                        return data.name.indexOf(this.filterDemo.filterText) !== -1;
                    },
                },

                allowDrag(dragTreeNode) {
                    // 2-2开头的id不能被拖拽
                    return !dragTreeNode.data.id.startsWith('2-2')
                },
                allowDrop(dragTreeNode, dropTreeNode, dragType) {
                    // 3-开头的id不能放置任何节点
                    return !dropTreeNode.data.id.startsWith('3')
                },
            }
        },
    }
</script>

<style lang="scss">

</style>