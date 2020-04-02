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
                             :data="treeData"
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

        <demo-row title="多选">
            <demo-line>
                <pl-button-group>
                    <pl-button label="展开所有节点" @click="$refs.checkTree.expandAll()"/>
                    <pl-button label="全部选中" @click="$refs.checkTree.checkAll()"/>
                    <pl-button label="全部取消" @click="$refs.checkTree.uncheckAll()"/>
                    <pl-button label="选中部分数据" @click="$refs.checkTree.check(['1-1-1','2-2-2'])"/>
                    <pl-button label="获取选中的数据" @click="$message($refs.checkTree.getCheckedData().map(item=>item.name).join(','),{time:null})"/>
                </pl-button-group>
            </demo-line>
            <pl-virtual-tree ref="checkTree"
                             showCheckbox
                             checkOnClickNode
                             :expandOnClickNode="false"
                             :data="treeData"
                             keyField="id"
                             labelField="name"
                             childrenField="subs"/>
        </demo-row>

        <demo-row title="多选：父子互不关联">
            <demo-line>
                <pl-button-group>
                    <pl-button label="展开所有节点" @click="$refs.unCheckStrictTree.expandAll()"/>
                    <pl-button label="全部选中" @click="$refs.unCheckStrictTree.checkAll()"/>
                    <pl-button label="全部取消" @click="$refs.unCheckStrictTree.uncheckAll()"/>
                    <pl-button label="选中部分数据" @click="$refs.unCheckStrictTree.check(['1-1-1','2-2-2'])"/>
                    <pl-button label="获取选中的数据" @click="$message($refs.unCheckStrictTree.getCheckedData().map(item=>item.name).join(','),{time:null})"/>
                </pl-button-group>
            </demo-line>
            <pl-virtual-tree ref="unCheckStrictTree"
                             showCheckbox
                             checkOnClickNode
                             :expandOnClickNode="false"
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
                    <pl-button label="获取选中的数据" @click="$message($refs.checkableTree.getCheckedData().map(item=>item.name).join(','),{time:null})"/>
                </pl-button-group>
            </demo-line>
            <pl-virtual-tree ref="checkableTree"
                             showCheckbox
                             checkOnClickNode
                             :expandOnClickNode="false"
                             :data="treeData"
                             checkStrictly
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
                    <pl-button label="获取选中的数据" @click="$message($refs.scopedSlotDemo.getCheckedData().map(item=>item.name).join(','),{time:null})"/>
                </pl-button-group>
            </demo-line>

            <pl-virtual-tree ref="scopedSlotDemo"
                             :data="scopedSlotDemo.treeData"
                             keyField="id"
                             labelField="name"
                             childrenField="subs"
                             style="width: 500px"
                             showCheckbox>
                <template slot-scope="data">
                    <div style="width:100%;display: flex;justify-content: space-between">
                        <span>{{data.data.name}}</span>
                        <pl-button-group mode="text">
                            <pl-button label="Add" @click="e=>scopedSlotDemo.addItem(e,data)" size="mini"/>
                            <pl-button label="Del" @click="e=>scopedSlotDemo.deleteItem(e,data)" size="mini" status="error"/>
                        </pl-button-group>
                    </div>
                </template>
            </pl-virtual-tree>
        </demo-row>

        <demo-row title="自定义内容：渲染函数">

            <demo-line>
                <pl-button-group>
                    <pl-button label="全部展开" @click="$refs.renderDemo.expandAll()"/>
                    <pl-button label="全部收起" @click="$refs.renderDemo.collapseAll()"/>
                    <pl-button label="当前选中节点" @click="$message(!!$refs.renderDemo.getCurrent() ? $refs.renderDemo.getCurrent().data.name : '未选中任何节点！')"/>
                    <pl-button label="获取选中的数据" @click="$message($refs.renderDemo.getCheckedData().map(item=>item.name).join(','),{time:null})"/>
                </pl-button-group>
            </demo-line>

            <pl-virtual-tree ref="renderDemo"
                             :data="renderDemo.treeData"
                             keyField="id"
                             labelField="name"
                             childrenField="subs"
                             style="width: 500px"
                             showCheckbox
                             :renderContent="renderDemo.renderContent"/>
        </demo-row>

        <demo-row title="节点图标">
            <pl-virtual-tree defaultExpandAll
                             :data="treeData"
                             keyField="id"
                             labelField="name"
                             childrenField="subs"
                             :nodeIcon="nodeIcon"/>
        </demo-row>

        <demo-row title="手风琴模式，展开节点的时候关闭兄弟节点">
            <pl-virtual-tree according
                             :data="treeData"
                             keyField="id"
                             labelField="name"
                             childrenField="subs"/>
        </demo-row>

        <demo-row title="自定义过滤函数">
            <demo-line>
                <pl-input v-model="filterText" suffixIcon="el-icon-search" clearIcon/>
            </demo-line>
            <pl-virtual-tree defaultExpandAll
                             :data="treeData"
                             keyField="id"
                             labelField="name"
                             childrenField="subs"
                             :filterNodeMethod="filterNodeMethod"/>
        </demo-row>
        <demo-row title="绑定currentKey">
            <demo-line>
                <pl-button label="全部展开" @click="$refs.currentTree.expandAll()"/>
                <pl-button label="设置currentKey" @click="currentKey = '3-1-1'"/>
                {{currentKey}}
            </demo-line>
            <pl-virtual-tree ref="currentTree"
                             :currentKey="currentKey"
                             :data="treeData"
                             keyField="id"
                             labelField="name"
                             childrenField="subs"
                             @current-change="treeNode=>currentKey = treeNode.key"/>
        </demo-row>

        <demo-row title="展开图标">
            <pl-virtual-tree
                    :data="treeData"
                    keyField="id"
                    labelField="name"
                    childrenField="subs"
                    expandIcon="el-icon-caret-right"/>
        </demo-row>

        <demo-row title="拖拽节点">
            <demo-line>
                <pl-button label="全部展开" @click="$refs.dragTree.expandAll()"/>
            </demo-line>
            <pl-virtual-tree
                    ref="dragTree"
                    :data="treeData"
                    defaultExpandAll
                    keyField="id"
                    labelField="name"
                    childrenField="subs"
                    draggable
                    showCheckbox
            >
                <template slot-scope="{data}">
                    <span :style="{color:data.id.charAt(0) === '1'?'#12b4a5':(data.id.charAt(0) === '2'?'#00CC00':'#F38585')}">{{data.name}}</span>
                </template>
            </pl-virtual-tree>
        </demo-row>

        <demo-row title="拖拽节点+可勾选">
            <demo-line>
                <pl-button label="全部展开" @click="$refs.dragAndCheckTree.expandAll()"/>
                <pl-button label="打印数据" @click="$plain.log(treeData)"/>
                <pl-button label="获取选中的数据" @click="$message($refs.dragAndCheckTree.getCheckedData().map(item=>item.name).join(','),{time:null})"/>
            </demo-line>
            <ol>
                <li>父子关联模式下，拖拽节点可能会引起 选中/取消选中 事件</li>
                <li>拖拽节点会刷新节点的状态，每个节点会先判断子节点是否全都选中，全部选中并且自身未选中的情况下，会选中自身</li>
                <li>自身选中，但是存在子节点未选中的情况下，会取消选中自身</li>
                <li>非父子关联模式下，拖拽节点不会导致节点选中状态变化</li>
            </ol>
            <pl-tree
                    ref="dragAndCheckTree"
                    :data="treeData"
                    defaultExpandAll
                    keyField="id"
                    labelField="name"
                    childrenField="subs"
                    showCheckbox
                    draggable/>
        </demo-row>

        <demo-row title="拖拽节点：可拖拽allowDrag以及可放置allowDrop">
            <ol>
                <li>2-2开头的id不能被拖拽</li>
                <li>3开头的id不能放置任何节点</li>
            </ol>
            <pl-tree
                    ref="dragTree"
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

        <demo-row title="虚拟滚动(可拖拽+可选)">
            <virtual-tree-large-data/>
        </demo-row>
    </div>
</template>

<script>
    import VirtualTreeLargeData from "./virtual-tree-large-data";
    import DemoTree from './tree'

    export default {
        name: "virtual-tree",
        components: {VirtualTreeLargeData},
        mixins: [DemoTree],
    }
</script>

<style lang="scss">

    @include themify {
        .pl-tree {
            .pl-list-move-right-enter {
                opacity: 0;
                transform: translateX(100px);
            }
        }
    }
</style>