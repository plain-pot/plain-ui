<template>
    <ul :class="classes" v-loading="isLoading">
        <pl-tree-node v-for="(item,index) in formatData" :key="item.key || index" :data="item" :tree-node="item"/>
    </ul>
</template>

<script lang="ts">
    import {EmitMixin, StyleMixin} from "../../utils/mixins";
    import PlTreeNode from "./pl-tree-node.vue";
    import {TreeMark, TreeNode} from "./tree";

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
            loading: {type: Boolean},                                   // 当前是否处于loading状态

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
            expandKeys: {type: Array},                                  // 默认展开的节点key数组
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
            /**
             * expandKeys 是一个数组，比如 [1,2,3]，当变化的时候设置对应数节点展开或者收起
             * @author  韦胜健
             * @date    2020/3/30 20:08
             */
            expandKeys: {
                immediate: true,
                handler(val: string[]) {
                    if (!val) val = []
                    if (JSON.stringify(val) !== JSON.stringify(this.emitExpandKeys)) {
                        Object.values(this.mark).forEach((mark: TreeMark) => mark.expanded = val.indexOf(mark.key) > -1)
                    }
                },
            },
            checkKeys: {
                immediate: true,
                handler(val: string[]) {
                    if (!val) val = []
                    if (JSON.stringify(val) !== JSON.stringify(this.emitCheckKeys)) {
                        Object.values(this.mark).forEach((mark: TreeMark) => mark.checked = val.indexOf(mark.key) > -1)
                    }
                },
            },
            data: {
                deep: true,
                handler(val) {
                    this.p_data = val

                    this.$nextTick(() => {
                        // 清理删除的数据
                        Object.values(this.mark).forEach((mark: TreeMark) => {
                            if (mark.formatCount !== this.formatCount) {
                                this.$delete(this.mark, mark.key)
                            }
                        })
                    })
                },
            },
        },
        data() {
            const p_data = this.data;                                                           // 内置树形数据data
            const p_currentKey: string = this.currentKey                                        // 当前选中的key
            const p_loading: boolean = false                                                    //  内置，当前是否处于loading状态
            const mark: { [key: string]: TreeMark } = {}                                        // 标记映射
            const formatCount: number = 0;                                                      // 当前格式化数据的时候，数据的版本，用来清理mark中不需要保存的数据
            return {
                p_data,
                p_loading,
                p_currentKey,
                mark,
                formatCount,
            }
        },
        created(): void {
            this.initLazy()

            if (this.defaultExpandAll) {
                this.$nextTick(() => this.expandAll())
            }
        },
        computed: {
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
                        'pl-tree-highlight-current': this.highlightCurrent
                    }
                ]
            },
            /**
             * 格式化 data 树形数据
             * @author  韦胜健
             * @date    2020/3/30 17:15
             */
            formatData(): TreeNode[] {

                if (!this.checkProps()) {
                    return []
                }
                if (!this.p_data) {
                    return []
                }
                this.formatCount++
                return this.p_data.map(item => this.formatNodeData(item, this.formatCount))
            },
            /**
             * 用來派发给开发者的当前展开的keys
             * @author  韦胜健
             * @date    2020/3/30 20:14
             */
            emitExpandKeys(): string[] {
                return (Object.values(this.mark) as TreeMark[]).filter(mark => !!mark.expanded).map(mark => mark.key)
            },
            /**
             * 用来派发给开发者的当前选中的keys
             * @author  韦胜健
             * @date    2020/3/31 15:19
             */
            emitCheckKeys(): string[] {
                return (Object.values(this.mark) as TreeMark[]).filter(mark => !!mark.checked).map(mark => mark.key)
            },
            /**
             * 当前是否处于loading状态
             * @author  韦胜健
             * @date    2020/3/31 10:23
             */
            isLoading() {
                return this.loading || this.p_loading
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

            /*expand*/

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
                            !this.mark[key].loaded &&               // 未曾加载过子节点数据
                            !treeNode.isLeaf                        // 节点不是叶子节点
                        ) {
                            const children = await this.getChildrenAsync(treeNode)
                            treeNode.setChildren(children || [])
                            await this.$plain.nextTick()
                        }

                        this.setMark(treeNode.key, TreeMark.expanded, true)
                        await this.$plain.nextTick()
                        // console.log('expand ', treeNode.key)
                        this.emitExpand(treeNode)
                        this.emitExpandChange(this.emitExpandKeys)
                    }
                    if (!!this.autoExpandParent && !!treeNode.parent) {
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
                        this.setMark(treeNode.key, TreeMark.expanded, false)
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
                Object.values(this.mark).forEach((mark: TreeMark) => mark.expanded = false)
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
                        this.setMark(treeNode.key, TreeMark.checked, true)

                        // 选中所有子节点
                        this.iterateAll(treeNode.children, (child) => this.setMark(child.key, TreeMark.checked, true))
                        // 更新父节点状态，如果父节点所有的子节点都处于选中状态，则更新父节点为选中状态
                        let parent = treeNode.parent
                        while (!!parent) {
                            if (parent.children.every(child => child.isCheck)) {
                                this.setMark(parent.key, TreeMark.checked, true)
                                parent = parent.parent
                            } else {
                                break
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
                        this.setMark(treeNode.key, TreeMark.checked, false)

                        // 取消选中所有子节点
                        this.iterateAll(treeNode.children, (child) => this.setMark(child.key, TreeMark.checked, false))

                        // 更新父节点状态，如果父节点所有的子节点都处于非选中状态，则更新父节点为非选中状态
                        let parent = treeNode.parent
                        while (!!parent) {
                            if (parent.isCheck) {
                                this.setMark(parent.key, TreeMark.checked, false)
                                parent = parent.parent
                            } else {
                                break
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
                this.iterateAll(this.formatData, (treeNode: TreeNode) => this.setMark(treeNode.key, TreeMark.checked, true))
            },
            /**
             * 取消选中所有节点
             * @author  韦胜健
             * @date    2020/3/31 17:33
             */
            uncheckAll() {
                this.iterateAll(this.formatData, (treeNode: TreeNode) => this.setMark(treeNode.key, TreeMark.checked, false))
            },
            /**
             * 获取选中的数据
             * @author  韦胜健
             * @date    2020/3/31 17:34
             */
            getCheckedData() {
                let ret = []
                this.iterateAll(this.formatData, (treeNode: TreeNode) => {
                    if (treeNode.isCheck) {
                        ret.push(treeNode.data)
                    }
                })
                return ret
            },

            /*---------------------------------------utils-------------------------------------------*/
            /**
             * 设置标记属性
             * @author  韦胜健
             * @date    2020/3/31 12:20
             */
            setMark(key, attr, value) {
                let mark = this.mark[key]
                if (!mark) {
                    mark = new TreeMark(key)
                    this.$set(this.mark, key, mark)
                }
                mark[attr] = value
            },
            /**
             * 获取标记属性
             * @author  韦胜健
             * @date    2020/3/31 14:01
             */
            getMark(key, attr) {
                let mark = this.mark[key]
                if (!mark) {
                    mark = new TreeMark(key)
                    this.$set(this.mark, key, mark)
                }
                return mark[attr]
            },
            /**
             * 遍历所有的treeNode
             * @author  韦胜健
             * @date    2020/3/30 19:30
             */
            iterateAll(treeNodes: TreeNode[], fn) {
                if (!treeNodes) return
                treeNodes.forEach(treeNode => {
                    fn(treeNode)
                    if (!!treeNode.children) {
                        this.iterateAll(treeNode.children, fn)
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
             * 格式化树节点数据
             * @author  韦胜健
             * @date    2020/3/30 17:16
             */
            formatNodeData(data, formatCount: number, parent?: TreeNode, level: number = 1): TreeNode {
                const treeNode = new TreeNode(data, this, level, parent)
                this.setMark(treeNode.key, TreeMark.treeNode, treeNode)
                this.setMark(treeNode.key, TreeMark.formatCount, formatCount)
                if (!!treeNode.children) {
                    treeNode.children = treeNode.children.map(child => this.formatNodeData(child, formatCount, treeNode, level + 1))
                }
                return treeNode
            },
            /**
             * 通过 key 寻找treeNode
             * @author  韦胜健
             * @date    2020/3/30 20:52
             */
            findTreeNodeByKey(key: string): TreeNode {
                const treeNode = this.getMark(key, TreeMark.treeNode)
                if (!treeNode) {
                    console.log(`无法找到treeNode：${key}`, this.mark)
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
                    if (!treeNode) {
                        this.p_loading = true
                    } else {
                        this.setMark(treeNode.key, TreeMark.loading, true)
                    }
                    this.getChildren(treeNode, (...results) => {
                        if (!treeNode) {
                            this.p_loading = false
                        } else {
                            this.setMark(treeNode.key, TreeMark.loading, false)
                            this.setMark(treeNode.key, TreeMark.loaded, true)
                        }
                        resolve(...results)
                    })
                })
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
            /*---------------------------------------helper-------------------------------------------*/

            async initLazy() {
                if (!this.lazy) {
                    return
                }
                this.p_data = await this.getChildrenAsync(null)
            },

            /*---------------------------------------handler-------------------------------------------*/
            /**
             * 处理树节点点击展开图标的动作
             * @author  韦胜健
             * @date    2020/3/30 19:02
             */
            onClickExpandIcon(treeNode: TreeNode): void {
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

            &, & ul {
                &.pl-tree-node-list {
                    margin: 0;
                    padding: 0;
                    list-style: none;
                }
            }

            .pl-tree-node {
                font-size: 14px;
                line-height: 24px;
                cursor: pointer;
                user-select: none;

                .pl-tree-node-content {
                    padding-right: 12px;
                    display: flex;
                    align-items: center;
                    flex-wrap: nowrap;
                    transition: all $transition 300ms;

                    &:hover {
                        background-color: mix(white, $colorPrimary, 90%);
                    }

                    .pl-tree-node-content-label {
                        padding: 0 6px;
                        flex: 1;
                    }

                    .pl-checkbox-indeterminate {
                        padding-left: 6px;
                    }

                    .pl-tree-node-content-expand-wrapper {
                        position: relative;
                        display: inline-block;
                        width: 1em;
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

                &.pl-tree-node-expand {
                    & > .pl-tree-node-content > .pl-tree-node-content-expand-wrapper > .pl-tree-expand-icon {
                        transform: rotate(90deg);
                    }
                }
            }

            .pl-icon {
                color: $icc;

                &.pl-tree-expand-icon {
                    transition: all $transition 300ms;
                }
            }

            &.pl-tree-highlight-current {
                .pl-tree-node.pl-tree-node-current > .pl-tree-node-content {
                    background-color: mix(white, $colorPrimary, 90%);
                }
            }
        }
    }
</style>