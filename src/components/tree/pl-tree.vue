<template>
    <ul class="pl-tree pl-tree-node-list">
        <pl-tree-node v-for="(item,index) in formatData" :key="item.key || index" :data="item" :tree-node="item"/>
    </ul>
</template>

<script lang="ts">
    import {EmitMixin, StyleMixin} from "../../utils/mixins";
    import PlTreeNode from "./pl-tree-node.vue";
    import {TreeNode} from "./tree";

    export default {
        name: "pl-tree",
        components: {PlTreeNode},
        mixins: [
            EmitMixin,
            StyleMixin,
        ],
        provide() {
            return {
                plTree: this,
            }
        },
        props: {
            data: {type: Array},                                        // 树形结构数据

            // 部分key
            keyField: {type: String, required: true},                    // 每一个树节点用来标识的唯一树形
            labelField: {type: String},                                   // 树节点展示文本对应字段
            childrenField: {type: String},                                // 树节点对应子节点数据对应字段


            // 普通属性
            emptyText: {type: String},                                  // 没有子节点的时候展示的文本
            renderContent: {type: Function},                            // 树节点内容渲染函数
            filterNodeMethod: {type: Function},                         // 对树节点进行筛选的方法，返回true表示可以显示，返回false表示隐藏
            highlightCurrent: {type: Boolean},                          // 是否高亮当前选中节点
            currentKey: {type: String},                                 // 当前选中节点的key

            // 展开相关属性
            expandKeys: {type: Array},                                  // 默认展开的节点key数组
            autoExpandParent: {type: Boolean},                          // 是否展开节点的时候，自动展开父节点
            defaultExpandAll: {type: Boolean},                          // 是否默认展开所有节点
            expandOnClickNode: {type: Boolean, default: null},          // 是否点击树节点的时候展开子节点
            according: {type: Boolean},                                 // 是否每次只展开一个同级的树节点
            renderAfterExpand: {type: Boolean, default: true},          // 是否在第一次展开节点之后才渲染内容
            expandIcon: {type: String},                                 // 树展开图标
            intent: {type: Number, default: 14},                        // 相邻级节点水平缩进距离，默认16，单位px
            lazy: {type: Boolean},                                      // 是否懒加载子节点数据
            isLeft: {type: Function},                                   // 判断树节点是否为叶子节点的函数，仅在lazy模式有效
            getChildren: {type: Function},                              // 加载子节点数据的函数，仅当 lazy 为true时有效

            // 勾选相关属性
            checkKeys: {type: Array},                                   // 默认选中的节点key的数组
            checkableKeys: {type: String},                              // 树节点复选框是否可选对应字段，为false值会被禁用
            showCheckbox: {type: Boolean},                              // 是否展示勾选框
            checkOnClickNode: {type: Boolean},                          // 是否点击树节点的时候选中节点
            checkStrictly: {type: Boolean},                             // 在显示复选框的情况下，是否严格遵循父子互不关联的做法，默认为false
            isCheckable: {type: Function},                              // 当即将选中树节点时，判断是否可以选中该树节点

            // 拖拽属性
            draggable: {type: Boolean},                                 // 是否可拖拽
            isDraggable: {type: Function},                              // 判断节点是否可以拖拽
            isDroppable: {type: Function},                              // 判断目标节点能够被放置
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
            currentKey(val: string): void {
                this.p_currentKey = val
            },
        },
        data() {
            const p_currentKey: string = this.currentKey                // 当前选中的key
            const idMap = new WeakMap<object, string>();                // 树节点数据对象对应id的映射
            const p_expandKeys: string[] = [...(this.expandKeys || [])] // 展开的数据对象的id数组
            const p_checkKeys: string[] = [...(this.checkKeys || [])]   // 选中的数据对象的id数组
            return {
                idMap,
                p_currentKey,
                p_expandKeys,
                p_checkKeys,
            }
        },
        created(): void {
            // console.log(this.formatData)
        },
        computed: {
            /**
             * 格式化 data 树形数据
             * @author  韦胜健
             * @date    2020/3/30 17:15
             */
            formatData(): TreeNode[] {
                if (!this.checkProps()) {
                    return []
                }
                if (!this.data) {
                    return []
                }
                return this.data.map(this.formatNodeData)
            },
        },
        methods: {
            /*---------------------------------------methods-------------------------------------------*/
            /**
             * 展开树节点
             * @author  韦胜健
             * @date    2020/3/30 18:58
             */
            expand(treeNode: TreeNode) {
                let key = treeNode.key
                let index = this.p_expandKeys.indexOf(key)
                if (index === -1) {
                    this.p_expandKeys.push(key)
                    this.emitExpand(treeNode)
                    this.emitExpandChange(this.p_expandKeys)
                }
            },
            /**
             * 折叠树节点
             * @author  韦胜健
             * @date    2020/3/30 18:58
             */
            collapse(treeNode: TreeNode) {
                let key = treeNode.key
                let index = this.p_expandKeys.indexOf(key)
                if (index > -1) {
                    this.p_expandKeys.splice(index, 1)
                    this.emitCollapse(treeNode)
                    this.emitExpandChange(this.p_expandKeys)
                }
            },
            /**
             * 根据树节点当前的展开状态，反向展开或者收起内容
             * @author  韦胜健
             * @date    2020/3/30 19:19
             */
            toggleExpand(treeNode: TreeNode) {
                if (this.p_expandKeys.indexOf(treeNode.key) > -1) {
                    this.collapse(treeNode)
                } else {
                    this.expand(treeNode)
                }
            },
            /**
             * 选中树节点
             * @author  韦胜健
             * @date    2020/3/30 19:00
             */
            check(treeNode: TreeNode) {
                let key = treeNode.key
                let index = this.p_checkKeys.indexOf(key)
                if (index === -1) {
                    this.p_checkKeys.push(key)
                    this.emitCheck(treeNode)
                    this.emitCheckChange(this.p_checkKeys)
                }
            },
            /**
             * 取消选中树节点
             * @author  韦胜健
             * @date    2020/3/30 19:00
             */
            uncheck(treeNode: TreeNode) {
                let key = treeNode.key
                let index = this.p_checkKeys.indexOf(key)
                if (index > -1) {
                    this.p_checkKeys.splice(index, 1)
                    this.emitUncheck(treeNode)
                    this.emitCheckChange(this.p_checkKeys)
                }
            },
            /**
             * 根据树节点当前的选中状态，反向勾选获取取消勾选节点
             * @author  韦胜健
             * @date    2020/3/30 19:20
             */
            toggleCheck(treeNode: TreeNode) {
                if (this.p_checkKeys.indexOf(treeNode.key) > -1) {
                    this.uncheck(treeNode)
                } else {
                    this.check(treeNode)
                }
            },
            /*---------------------------------------utils-------------------------------------------*/
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
             * 格式化树节点数据
             * @author  韦胜健
             * @date    2020/3/30 17:16
             */
            formatNodeData(data): TreeNode {
                const {keyField, labelField, childrenField} = this
                const formatNodeData = new TreeNode(data, {keyField, labelField, childrenField})

                if (!!formatNodeData.children) {
                    formatNodeData.children = formatNodeData.children.map(this.formatNodeData)
                }
                return formatNodeData
            },
            /*---------------------------------------handler-------------------------------------------*/
            /**
             * 处理树节点点击展开图标的动作
             * @author  韦胜健
             * @date    2020/3/30 19:02
             */
            onClickExpandIcon(treeNode: TreeNode): void {
                this.toggleExpand(treeNode)
            },
            /**
             * 处理点击节点内容动作
             * @author  韦胜健
             * @date    2020/3/30 19:17
             */
            onClickNodeContent(treeNode: TreeNode): void {
                this.emitNodeClick(treeNode)
                if (this.expandOnClickNode !== false) {
                    this.toggleExpand(treeNode)
                }
                if (this.checkOnClickNode == true) {
                    this.toggleCheck(treeNode)
                }
            },
        },
    }
</script>

<style lang="scss">
    @include themify {
        .pl-tree {
            &, & ul {
                &.pl-tree-node-list {
                    margin: 0;
                    padding: 0;
                    list-style: none;
                }

                .pl-tree-node {
                    font-size: 14px;
                    line-height: 24px;
                    cursor: pointer;
                    user-select: none;

                    .pl-tree-node-content {
                        &:hover {
                            background-color: mix(white, $colorPrimary, 90%);
                        }
                    }

                    &.pl-tree-node-expand {
                        & > .pl-tree-node-content > .pl-tree-expand-icon {
                            transform: rotate(90deg);
                        }
                    }
                }

                .pl-icon {
                    color: $icc;
                    padding: 3px 3px;

                    &.pl-tree-expand-icon {
                        transition: all $transition 300ms;
                    }
                }
            }
        }
    }
</style>