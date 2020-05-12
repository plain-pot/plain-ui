<template>
    <div class="pl-tree" :class="classes" v-loading="isLoading">
        <div class="pl-tree-node-empty-text" v-if="!formatData || formatData.length === 0">
            <pl-icon icon="el-icon-reading"/>
            <span>{{emptyText}}</span>
        </div>
        <pl-tree-node v-else v-for="(item,index) in formatData" :key="item.key || index" :tree-node="item"/>
        <span class="pl-tree-drag-indicator" v-if="draggable" v-show="dragState.show" :style="indicatorStyles"></span>
    </div>
</template>
<script lang="ts">
    import {EmitMixin} from "../../utils/mixins";
    import {TreeDropType, TreeMark, TreeMarkAttr, TreeNode} from "./tree";
    import TreeDraggableMixin from "./TreeDraggableMixin";
    import plTreeNode from './pl-tree-node.vue'

    export default {
        name: 'pl-tree',
        components: {plTreeNode},
        mixins: [
            EmitMixin,
            TreeDraggableMixin,
        ],
        provide() {
            return {
                plTree: this,
            }
        },
        props: {
            data: {type: Array},                                        // 树形结构数据
            loading: {type: Boolean},                                   // 当前是否处于loading状态
            nodeIcon: {type: Function},                                 // 节点图标

            // 部分key
            keyField: {type: String, required: true},                   // 每一个树节点用来标识的唯一树形
            labelField: {type: String},                                 // 树节点展示文本对应字段
            childrenField: {type: String},                              // 树节点对应子节点数据对应字段

            // 普通属性
            renderContent: {type: Function},                            // 树节点内容渲染函数
            filterNodeMethod: {type: Function},                         // 对树节点进行筛选的方法，返回true表示可以显示，返回false表示隐藏
            highlightCurrent: {type: Boolean, default: true},           // 是否高亮当前选中节点
            currentKey: {type: String},                                 // 当前选中节点的key

            // 展开相关属性
            emptyText: {type: String, default: '暂无数据'},              // 没有子节点的时候展示的文本
            defaultExpandAll: {type: Boolean},                          // 是否默认展开所有节点
            according: {type: Boolean},                                 // 是否每次只展开一个同级的树节点
            expandIcon: {type: String},                                 // 树展开图标
            intent: {type: Number, default: 14},                        // 相邻级节点水平缩进距离，默认16，单位px
            lazy: {type: Boolean},                                      // 是否懒加载子节点数据
            isLeaf: {type: Function},                                   // 判断树节点是否为叶子节点的函数，仅在lazy模式有效
            getChildren: {type: Function},                              // 加载子节点数据的函数，仅当 lazy 为true时有效

            renderAfterExpand: {type: Boolean, default: true},          // 是否在第一次展开节点之后才渲染内容
            expandOnClickNode: {type: Boolean, default: null},          // 是否点击树节点的时候展开子节点
            autoExpandParent: {type: Boolean, default: true},           // 是否展开节点的时候，自动展开父节点

            // 勾选相关属性
            showCheckbox: {type: Boolean},                              // 是否展示勾选框
            checkOnClickNode: {type: Boolean},                          // 是否点击树节点的时候选中节点
            checkStrictly: {type: Boolean},                             // 在显示复选框的情况下，是否严格遵循父子互不关联的做法，默认为false
            isCheckable: {type: Function},                              // 当即将选中树节点时，判断是否可以选中该树节点

            // 拖拽属性
            draggable: {type: Boolean},                                 // 是否可拖拽
            allowDrag: {type: Function},                                // 判断节点是否可以拖拽
            allowDrop: {type: Function},                                // 判断目标节点能够被放置
        },
        emitters: {
            emitNodeClick: Function,
            emitCurrentChange: Function,

            emitExpandChange: Function,
            emitExpand: Function,
            emitCollapse: Function,

            emitCheckChange: Function,
            emitCheck: Function,
            emitUncheck: Function,

            emitDragStart: Function,
            emitDragEnter: Function,
            emitDragLeave: Function,
            emitDragOver: Function,
            emitDragEnd: Function,
            emitDrop: Function,
        },
        watch: {
            data(val) {
                this.rootTreeNode.setChildren(val)
            },
            /**
             * 单向绑定currentKey
             * @author  韦胜健
             * @date    2020/4/1 9:30
             */
            currentKey(val: string): void {
                this.p_currentKey = val
            },
        },
        data() {
            const p_currentKey = this.currentKey
            const p_loading = this.p_loading
            const virtualScrollFlag = false

            const treeMark = new TreeMark(this)
            const rootTreeNode = new TreeNode({[this.childrenField]: this.data}, this, 0, null, treeMark)

            return {
                p_currentKey,
                p_loading,
                virtualScrollFlag,
                treeMark,
                rootTreeNode,
            }
        },
        created() {
            this.initLazy()

            if (this.defaultExpandAll) {
                this.$nextTick(() => this.expandAll())
            }
        },
        computed: {
            isLoading() {
                return this.p_loading || this.loading
            },
            formatData(): TreeNode[] {
                return this.rootTreeNode.children
            },
            /**
             * 根节点class
             * @author  韦胜健
             * @date    2020/3/31 21:10
             */
            classes() {
                return [
                    'pl-tree',
                    'pl-tree-node-list',
                    {
                        'pl-tree-highlight-current': this.highlightCurrent,
                        'pl-tree-reflow': this.dragState.reflow,
                        'pl-tree-virtual-scrolling': this.virtualScrollFlag,
                    }
                ]
            },
            /**
             * 拖拽指示器的样式
             * @author  韦胜健
             * @date    2020/4/1 17:39
             */
            indicatorStyles() {
                let styles = {} as any
                const indicatorStyles = this.dragState.indicatorStyles
                if (!!indicatorStyles.left) {
                    styles.left = `${indicatorStyles.left + 6}px`
                }
                if (!!indicatorStyles.width) {
                    styles.width = `${indicatorStyles.width}px`
                }
                if (!!indicatorStyles.top) {
                    styles.top = `${indicatorStyles.top}px`
                }
                return styles
            },
            /**
             * 用來派发给开发者的当前展开的keys
             * @author  韦胜健
             * @date    2020/3/30 20:14
             */
            emitExpandKeys(): string[] {
                return this.treeMark.getActiveKeys(TreeMarkAttr.expand)
            },
            /**
             * 用来派发给开发者的当前选中的keys
             * @author  韦胜健
             * @date    2020/3/31 15:19
             */
            emitCheckKeys(): string[] {
                return this.treeMark.getActiveKeys(TreeMarkAttr.check)
            },
        },
        methods: {
            /*---------------------------------------methods-------------------------------------------*/
            /*select*/
            /**
             * 选中某一个树节点
             * @author  韦胜健
             * @date    2020/3/31 9:26
             */
            setCurrent(key: string) {
                this.p_currentKey = key
                this.emitCurrentChange(this.findTreeNodeByKey(this.p_currentKey))
            },
            /**
             * 获取当前选中节点
             * @author  韦胜健
             * @date    2020/3/31 9:39
             */
            getCurrent(): TreeNode | null {
                if (!this.p_currentKey) return null
                return this.findTreeNodeByKey(this.p_currentKey)
            },

            /**
             * 展开树节点
             * @author  韦胜健
             * @date    2020/3/30 18:58
             */
            async expand(keys: string | string[]) {
                await this.handleKeys(keys, async (key: string) => {
                    const treeNode = this.findTreeNodeByKey(key)
                    if (!treeNode) return
                    if (!treeNode.isExpand) {

                        if (
                            this.lazy &&                            // 懒加载模式
                            !treeNode.isLoaded &&               // 未曾加载过子节点数据
                            !treeNode.isLeaf                        // 节点不是叶子节点
                        ) {
                            const children = await this.getChildrenAsync(treeNode)
                            treeNode.setChildren(children || [])
                            await this.$plain.nextTick()
                        }

                        if (this.according) {
                            // 手风琴模式，展开某一个节点的时候，关闭兄弟节点
                            if (!!treeNode.parent && !!treeNode.parent.children) {
                                treeNode.parent.children.forEach((child: TreeNode) => child.key !== treeNode.key && this.collapse(child.key))
                            }
                        }

                        treeNode.expand(true)
                        await this.$plain.nextTick()
                        // console.log('expand ', treeNode.key)
                        this.emitExpand(treeNode)
                        this.emitExpandChange(this.emitExpandKeys)
                    }
                    if (!!this.autoExpandParent && !!treeNode.parent && treeNode.parent.key) {
                        await this.expand(treeNode.parent.key)
                    }
                })
            },
            /**
             * 折叠树节点
             * @author  韦胜健
             * @date    2020/3/30 18:58
             */
            async collapse(keys: string | string[]) {
                await this.handleKeys(keys, async (key: string) => {
                    const treeNode = this.findTreeNodeByKey(key)
                    if (!treeNode) return
                    if (treeNode.isExpand) {
                        treeNode.expand(false)
                        await this.$plain.nextTick()
                        this.emitCollapse(treeNode)
                        this.emitExpandChange(this.emitExpandKeys)
                    }
                })
            },
            /**
             * 根据树节点当前的展开状态，反向展开或者收起内容
             * @author  韦胜健
             * @date    2020/3/30 19:19
             */
            toggleExpand(key: string) {
                const treeNode = this.findTreeNodeByKey(key)
                if (!treeNode) return
                if (treeNode.isExpand) {
                    this.collapse(key)
                } else {
                    this.expand(key)
                }
            },
            expandAll() {
                this.iterateAll(this.formatData, treeNode => this.expand(treeNode.key))
            },
            collapseAll() {
                this.treeMark.expandMap = {}
            },

            /*check*/

            /**
             * 根据key选中树节点
             * @author  韦胜健
             * @date    2020/3/31 17:33
             */
            async check(keys: string | string[]) {
                await this.handleKeys(keys, async (key: string) => {
                    const treeNode = this.findTreeNodeByKey(key)
                    if (!treeNode) return
                    if (!treeNode.isCheck) {
                        treeNode.check(true)

                        // 父子关联模式下，改变子节点以及父节点状态
                        if (!this.checkStrictly) {
                            // 选中所有子节点
                            this.iterateAll(treeNode.children, (child) => child.check(true))
                            // 更新父节点状态，如果父节点所有的子节点都处于选中状态，则更新父节点为选中状态
                            let parent = treeNode.parent
                            while (!!parent && !!parent.key) {
                                if (parent.children.every(child => child.isCheck)) {
                                    parent.check(true)
                                    parent = parent.parent
                                } else {
                                    break
                                }
                            }
                        }

                        await this.$plain.nextTick()
                        this.emitCheck(treeNode)
                        this.emitCheckChange(this.emitCheckKeys)
                    }
                })
            },
            /**
             * 根据key取消选中树节点
             * @author  韦胜健
             * @date    2020/3/31 17:33
             */
            async uncheck(keys: string | string[]) {
                await this.handleKeys(keys, async (key: string) => {
                    const treeNode = this.findTreeNodeByKey(key)
                    if (!treeNode) return
                    if (treeNode.isCheck) {
                        treeNode.check(false)

                        // 父子关联模式下，改变子节点以及父节点状态
                        if (!this.checkStrictly) {
                            // 取消选中所有子节点
                            this.iterateAll(treeNode.children, (child) => child.check(false))
                            // 更新父节点状态，如果父节点所有的子节点都处于非选中状态，则更新父节点为非选中状态
                            let parent = treeNode.parent
                            while (!!parent && !!parent.key) {
                                if (parent.isCheck) {
                                    parent.check(false)
                                    parent = parent.parent
                                } else {
                                    break
                                }
                            }
                        }

                        await this.$plain.nextTick()
                        this.emitCheck(treeNode)
                        this.emitCheckChange(this.emitCheckKeys)
                    }
                })
            },
            /**
             * 根据key选中或者取消选中树节点
             * @author  韦胜健
             * @date    2020/3/31 17:33
             */
            toggleCheck(key) {
                const treeNode = this.findTreeNodeByKey(key)
                if (!treeNode) return
                if (!treeNode.isCheckable) return
                if (treeNode.isCheck) {
                    this.uncheck(key)
                } else {
                    this.check(key)
                }
            },
            /**
             * 选中所有节点
             * @author  韦胜健
             * @date    2020/3/31 17:33
             */
            checkAll() {
                this.iterateAll(this.formatData, (treeNode: TreeNode) => treeNode.check(true))
            },
            /**
             * 取消选中所有节点
             * @author  韦胜健
             * @date    2020/3/31 17:33
             */
            uncheckAll() {
                this.treeMark.checkMap = {}
            },
            /**
             * 获取选中的数据
             * @author  韦胜健
             * @date    2020/3/31 17:34
             */
            getCheckedData() {
                let ret: object[] = []
                this.iterateAll(this.formatData, (treeNode: TreeNode) => {
                    if (treeNode.isCheck) {
                        ret.push(treeNode.data)
                    }
                })
                return ret
            },

            /*---------------------------------------utils-------------------------------------------*/
            format({data, parent,}: { data: object, parent?: TreeNode }): TreeNode {
                return this.treeMark.getTreeNode(data, this, 1, parent)
            },
            /**
             * 处理keys
             * @author  韦胜健
             * @date    2020/3/31 15:23
             */
            async handleKeys(keys: string | string[], handler: (value: unknown, index: number, array: []) => unknown) {
                keys = Array.isArray(keys) ? keys : [keys]
                return await Promise.all(keys.map(handler))
            },
            /**
             * 遍历所有的treeNode
             * @author  韦胜健
             * @date    2020/3/30 19:30
             */
            iterateAll(treeNodes: TreeNode[], fn, iterateChildren?: Function) {
                if (!treeNodes) return
                treeNodes.forEach(treeNode => {
                    fn(treeNode)
                    if (!!treeNode.children && (!iterateChildren || iterateChildren(treeNode))) {
                        this.iterateAll(treeNode.children, fn, iterateChildren)
                    }
                })
            },
            /**
             * 检查props是否合法
             * @author  韦胜健
             * @date    2020/3/30 18:48
             */
            checkProps() {
                if (!this.keyField) {
                    console.error('pl-tree 的 keyField属性不能为空，每一条记录必须要有一个key标识')
                    return false
                }
                if (!this.childrenField) {
                    console.error('pl-tree 的 childrenKey不能为空')
                    return false
                }
                return true
            },
            /**
             * 通过 key 寻找treeNode
             * @author  韦胜健
             * @date    2020/3/30 20:52
             */
            findTreeNodeByKey(key: string): TreeNode {
                const treeNode = this.treeMark.getMark(key, TreeMarkAttr.node)
                if (!treeNode) {
                    console.warn(`无法找到treeNode：${key}`, this.treeMark.nodeMap)
                    return null
                }
                return treeNode
            },
            /**
             * 获取子节点数据异步方法
             * @author  韦胜健
             * @date    2020/3/31 15:21
             */
            getChildrenAsync(treeNode: TreeNode | null) {
                return new Promise((resolve) => {
                    if (!treeNode.key) {
                        this.p_loading = true
                    } else {
                        this.treeMark.setMark(treeNode.key, TreeMarkAttr.loading, true)
                    }
                    this.getChildren(treeNode, (...results) => {
                        if (!treeNode.key) {
                            this.p_loading = false
                        } else {
                            this.treeMark.setMark(treeNode.key, TreeMarkAttr.loading, false)
                            this.treeMark.setMark(treeNode.key, TreeMarkAttr.loaded, true)
                        }
                        resolve(...results)
                    })
                })
            },
            getTreeNodeFromEl(el: any) {
                const instance = el.__vue__
                if (!!instance.treeNode) return instance.treeNode
                if (!!instance.$parent && !!instance.$parent.treeNode) return instance.$parent.treeNode
                return null
            },
            /**
             * 刷新节点选中状态
             * @author  韦胜健
             * @date    2020/4/1 22:17
             */
            refreshCheckStatus() {
                if (!this.showCheckbox) return
                if (this.checkStrictly) return;

                const next = (treeNode: TreeNode) => {
                    let hasCheck = false
                    let hasUncheck = false

                    if (!!treeNode.children) {
                        treeNode.children.forEach(child => {
                            next(child)
                            if (child.isCheck) {
                                hasCheck = true
                            } else {
                                hasUncheck = true
                            }
                        })
                    }
                    if (hasCheck && !hasUncheck) {
                        // 所有子节点选中
                        if (!treeNode.isCheck) {
                            treeNode.check(true)
                        }
                    } else if (hasUncheck) {
                        // 有子节点未选中
                        if (treeNode.isCheck) {
                            treeNode.check(false)
                        }
                    }
                }

                this.formatData.forEach(next)
            },
            /**
             * 判断是否可以拖拽
             * @author  韦胜健
             * @date    2020/4/1 23:12
             */
            isAllowDrag(dragTreeNode: TreeNode, event: DragEvent) {
                return !this.allowDrag || this.allowDrag(dragTreeNode, event)
            },
            /**
             * 判断是否可以放置
             * @author  韦胜健
             * @date    2020/4/1 23:12
             */
            isAllowDrop(dragTreeNode: TreeNode, dropTreeNode: TreeNode, dropType: TreeDropType, event) {
                return !this.allowDrop || this.allowDrop(dragTreeNode, dropTreeNode, dropType, event)
            },

            /*---------------------------------------helper-------------------------------------------*/
            async initLazy() {
                if (!this.lazy) {
                    return
                }
                this.rootTreeNode.setChildren(await this.getChildrenAsync(this.rootTreeNode))
            },

            /*---------------------------------------handler-------------------------------------------*/
            /**
             * 处理树节点点击展开图标的动作
             * @author  韦胜健
             * @date    2020/3/30 19:02
             */
            onClickExpandIcon(e, treeNode: TreeNode): void {
                e.stopPropagation()
                this.toggleExpand(treeNode.key)
            },
            /**
             * 处理点击节点内容动作
             * @author  韦胜健
             * @date    2020/3/30 19:17
             */
            onClickNodeContent(treeNode: TreeNode): void {
                this.emitNodeClick(treeNode)
                this.setCurrent(treeNode.key)
                if (this.expandOnClickNode !== false) {
                    this.toggleExpand(treeNode.key)
                }
                if (this.checkOnClickNode == true) {
                    this.toggleCheck(treeNode.key)
                }
            },
            /**
             * 处理点击子节点 checkbox 动作
             * @author  韦胜健
             * @date    2020/3/31 15:06
             */
            onClickCheckbox(e, treeNode) {
                e.stopPropagation()
                this.toggleCheck(treeNode.key)
            },
        },
    }
</script>

<style lang="scss">
    @include themify {
        .pl-tree {
            position: relative;
            min-height: 100px;

            .pl-tree-node {
                font-size: 14px;
                line-height: 24px;
                cursor: pointer;
                display: block;

                .pl-tree-node-wrapper {
                    position: relative;
                    width: 100%;
                    transition: all $transition 300ms;

                    .pl-tree-node-operator {
                        position: absolute;
                        top: 0;
                        left: 0;
                        user-select: none;

                        .pl-tree-node-expander {
                            height: 24px;
                            width: 18px;
                            display: inline-block;
                            vertical-align: top;
                        }

                        .pl-checkbox-indeterminate {
                            user-select: none;
                        }
                    }

                    .pl-tree-node-content {
                        width: 100%;

                        .pl-tree-node-content-label {
                            padding: 0 6px;
                        }
                    }

                    &:hover {
                        background-color: rgba($colorInfo, 0.1);
                        color: $ihc;
                    }
                }

                &.pl-tree-node-expand {
                    & > .pl-tree-node-wrapper > .pl-tree-node-operator > .pl-tree-node-expander > .pl-tree-expand-icon {
                        transform: rotate(90deg);
                    }
                }

                &.pl-tree-node-drop-inner {
                    & > .pl-tree-node-wrapper > .pl-tree-node-content {
                        color: $colorPrimary;
                        font-weight: bold;
                    }
                }
            }

            .pl-icon {
                color: $icc;
                margin-right: 6px;

                &.pl-tree-expand-icon {
                    transition: all $transition 300ms;
                }
            }

            .pl-tree-node-empty-text {
                color: $disabledText;
                font-size: 12px;
                line-height: 28px;

                & > .pl-icon {
                    margin-right: 6px;
                }
            }

            .pl-tree-drag-indicator {
                position: fixed;
                z-index: 9999;
                height: 2px;
                background-color: $colorPrimary;
                display: inline-block;
            }

            &.pl-tree-highlight-current {
                .pl-tree-node.pl-tree-node-current > .pl-tree-node-wrapper {
                    background-color: rgba($colorPrimary, 0.1);
                    color: $colorPrimary;
                }
            }

            &.pl-tree-reflow {
                .pl-tree-node-list {
                    transition: none !important;
                }
            }

            &.pl-tree-virtual-scrolling {
                .pl-tree-node {
                    transition: none !important;
                }
            }

            .pl-list-move-right-enter {
                opacity: 0;
                transform: translateX(100px);
            }
        }
    }
</style>