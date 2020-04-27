import {TreeMarkAttr} from "./tree";
<template>
    <div class="pl-tree" :class="classes" v-loading="loading || state.loading">
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
    import {TreeMark, TreeMarkAttr, TreeNode} from "./tree";
    import TreeDraggableMixin from "./TreeDraggableMixin";

    export default {
        name: 'pl-tree',
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
            const state = {
                currentKey: this.currentKey,
                loading: false,
                virtualScrollFlag: false,
            }
            const treeMark = new TreeMark(this)
            const rootTreeNode = new TreeNode(null, this, 0, null, treeMark)

            return {
                state,
                treeMark,
                rootTreeNode,
            }
        },
        mounted() {
            // console.log(this.formatData)
        },
        computed: {
            formatData(): TreeNode[] {
                const {treeMark, rootTreeNode} = this
                return (this.data || []).map(item => this.format({
                    row: item,
                    parent: rootTreeNode,
                    treeMark,
                }))
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
                        'pl-tree-virtual-scrolling': this.state.virtualScrollFlag,
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

            /*---------------------------------------utils-------------------------------------------*/
            format({
                       row,
                       parent,
                       level = 1,
                       treeMark,
                   }: {
                row: object,
                parent?: TreeNode,
                level?: number,
                treeMark: TreeMark
            })
                : TreeNode {
                return new TreeNode(row, this, level, parent, treeMark)
            }
        },
    }
</script>

<style lang="scss">
    @include themify {
        .pl-tree {

        }
    }
</style>