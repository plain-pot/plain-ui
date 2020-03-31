<template>
    <li class="pl-tree-node" :class="{'pl-tree-node-expand':isExpand,'pl-tree-node-current':treeNode.key === plTree.p_currentKey}">
        <div class="pl-tree-node-content" :style="contentStyles" @click="plTree.onClickNodeContent(treeNode)">
            <pl-icon :icon="plTree.expandIcon || 'el-icon-arrow-right'"
                     v-if="!isLeaf"
                     @click.stop="plTree.onClickExpandIcon(treeNode)"
                     class="pl-tree-expand-icon"/>
            <span class="pl-tree-node-content-label">{{treeNode.label}}</span>
        </div>
        <pl-collapse-transition>
            <ul class="pl-tree-node-list"
                v-if="!!treeNode.children && treeNode.children.length>0 && init"
                v-show="isExpand && show">
                <pl-tree-node v-for="(item,index) in  treeNode.children" :key="index" :tree-node="item" :level="level+1"/>
            </ul>
        </pl-collapse-transition>
    </li>
</template>

<script lang="ts">
    export default {
        name: "pl-tree-node",
        props: {
            treeNode: {type: Object},
            level: {type: Number, default: 0},
        },
        inject: {
            plTree: {default: null},
        },
        data() {
            const init = !this.plTree.renderAfterExpand
            const show = init
            return {
                init,
                show,
            }
        },
        computed: {
            /**
             * content节点style
             * @author  韦胜健
             * @date    2020/3/31 9:32
             */
            contentStyles() {
                return {
                    paddingLeft: `${this.plTree.intent * this.level}px`
                }
            },
            /**
             * 当前是否已经展开
             * @author  韦胜健
             * @date    2020/3/31 9:32
             */
            isExpand() {
                let isExpand = this.treeNode.isExpand
                if (!this.init && !!isExpand) {
                    this.init = true
                    this.$nextTick(() => this.show = true)
                }
                return isExpand
            },
            /**
             * 当前是否为叶子节点
             * @author  韦胜健
             * @date    2020/3/31 9:32
             */
            isLeaf() {
                const {lazy, isLeft} = this.plTree
                if (!!lazy && !!isLeft) {
                    return isLeft(this.treeNode)
                } else {
                    return !this.treeNode.children || this.treeNode.children.length === 0
                }
            },
        },
        methods: {},
    }
</script>

<style lang="scss">
</style>