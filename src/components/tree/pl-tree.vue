<template>
    <div class="pl-tree">
        <pl-tree-node v-for="(item,index) in formatData" :key="item.key || index" :data="item"/>
    </div>
</template>

<script>
    import {EmitMixin, StyleMixin} from "../../utils/mixins";
    import PlTreeNode from "./pl-tree-node";

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
            nodeKey: {type: String, required: true},                    // 每一个树节点用来标识的唯一树形
            labelKey: {type: String},                                   // 树节点展示文本对应字段
            childrenKey: {type: String},                                // 树节点对应子节点数据对应字段
            checkableKey: {type: String},                               // 树节点复选框是否可选对应字段，为false值会被禁用

            // 子节点懒加载相关属性
            lazy: {type: Boolean},                                      // 是否懒加载子节点数据
            leftKey: {type: String},                                    // 树节点是否为叶子节点，仅在lazy模式有效
            getChildren: {type: Function},                              // 加载子节点数据的函数，仅当 lazy 为true时有效

            // 普通属性
            emptyText: {type: String},                                  // 没有子节点的时候展示的文本
            renderContent: {type: Function},                            // 树节点内容渲染函数
            filterNodeMethod: {type: Function},                         // 对树节点进行筛选的方法，返回true表示可以显示，返回false表示隐藏
            highlightCurrent: {type: Boolean},                          // 是否高亮当前选中节点
            currentKey: {type: String},                                 // 当前选中节点的key

            // 展开相关属性
            defaultExpandKeys: {type: Array},                           // 默认展开的节点key数组
            autoExpandParent: {type: Boolean},                          // 是否展开节点的时候，自动展开父节点
            defaultExpandAll: {type: Boolean},                          // 是否默认展开所有节点
            expandOnClickNode: {type: Boolean},                         // 是否点击树节点的时候展开子节点
            according: {type: Boolean},                                 // 是否每次只展开一个同级的树节点
            renderAfterExpand: {type: Boolean, default: true},          // 是否在第一次展开节点之后才渲染内容
            expandIcon: {type: String},                                 // 树展开图标
            intent: {type: Number},                                     // 相邻级节点水平缩进距离，默认16，单位px

            // 勾选相关属性
            showCheckbox: {type: Boolean},                              // 是否展示勾选框
            defaultCheckKeys: {type: Array},                            // 默认选中的节点key的数组
            checkOnClickNode: {type: Boolean},                          // 是否点击树节点的时候选中节点
            checkStrictly: {type: Boolean},                             // 在显示复选框的情况下，是否严格遵循父子互不关联的做法，默认为false
            isCheckable: {type: Function},                              // 当即将选中树节点时，判断是否可以选中该树节点

            // 拖拽属性
            draggable: {type: Boolean},                                 // 是否可拖拽
            isDraggable: {type: Function},                              // 判断节点是否可以拖拽
            isDroppable: {type: Function},                              // 判断目标节点能够被放置
        },
        watch: {
            currentKey(val) {
                this.p_currentKey = val
            },
        },
        data() {
            return {
                p_currentKey: this.currentKey,                          // 当前选中的key
                keyMap: {
                    nodeKey: 'key',                                     // 树节点唯一标识
                    labelKey: 'label',                                  // 树节点展示文本
                    childrenKey: 'children',                            // 树节点子节点数据
                    checkableKey: 'checkable',                          // 树节点是否可以被勾选，否则勾选框会被禁用
                    leftKey: 'left',                                    // 树节点是否为叶子节点
                },
            }
        },
        created() {
            console.log(this.formatData)
        },
        computed: {
            formatData() {
                if (!this.data) return []
                return this.data.map(this.formatNodeData)
            },
        },
        methods: {
            formatNodeData(data) {
                const formatNodeData = Object.keys(this.keyMap).reduce((ret, key) => {
                    let keyName = this.keyMap[key]
                    ret[keyName] = !!this[key] ? data[this[key]] : undefined
                    return ret
                }, {})
                formatNodeData.data = data
                if (!!formatNodeData.children) {
                    formatNodeData.children = formatNodeData.children.map(this.formatNodeData)
                }
                return formatNodeData
            },
        },
    }
</script>

<style lang="scss">
</style>