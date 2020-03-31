<template>
    <li class="pl-tree-node" :class="{'pl-tree-node-expand':isExpand,'pl-tree-node-current':treeNode.key === plTree.p_currentKey}">
        <div class="pl-tree-node-content" :style="contentStyles" @click="plTree.onClickNodeContent(treeNode)">
            <div class="pl-tree-node-content-expand-wrapper">
                <pl-loading v-if="isLoading" type="beta"/>
                <pl-icon :icon="plTree.expandIcon || 'el-icon-arrow-right'"
                         v-else-if="!treeNode.isLeaf"
                         @click.stop="plTree.onClickExpandIcon(treeNode)"
                         class="pl-tree-expand-icon"/>
            </div>

            <span class="pl-tree-node-content-label">{{treeNode.label}}</span>
        </div>
        <pl-collapse-transition>
            <ul class="pl-tree-node-list"
                v-if="!treeNode.isLeaf && init"
                v-show="isExpand && show">
                <template v-if="!!treeNode.children && treeNode.children.length>0">
                    <pl-tree-node v-for="(item,index) in  treeNode.children" :key="index" :tree-node="item" :level="level+1"/>
                </template>
                <li v-else class="pl-tree-node-empty-text" :style="emptyTextStyles">
                    <pl-icon icon="el-icon-reading"/>
                    <span>{{plTree.emptyText}}</span>
                </li>
            </ul>
        </pl-collapse-transition>
    </li>
</template>

<script lang="ts">
    import {TreeMark} from "./tree";

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
                    paddingLeft: `${this.plTree.intent * this.level + 6}px`
                }
            },
            emptyTextStyles() {
                return {
                    paddingLeft: `${this.plTree.intent * this.level + 6 + 6 + 14}px`
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
             * 当前节点是否处于加载状态
             * @author  韦胜健
             * @date    2020/3/31 10:54
             */
            isLoading() {
                return this.plTree.getMark(this.treeNode.key, TreeMark.loading)
            },
        },
        methods: {},
    }
</script>

<style lang="scss">
</style>