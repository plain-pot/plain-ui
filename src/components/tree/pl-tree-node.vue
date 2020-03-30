<template>
    <li class="pl-tree-node" :class="{'pl-tree-node-expand':isExpand}">
        <div class="pl-tree-node-content" :style="contentStyles" @click="plTree.onClickNodeContent(treeNode)">
            <pl-icon :icon="plTree.expandIcon || 'el-icon-arrow-right'" @click="plTree.onClickExpandIcon(treeNode)" class="pl-tree-expand-icon"/>
            <span>{{treeNode.label}}</span>
        </div>
        <pl-collapse-transition>
            <ul class="pl-tree-node-list" v-if="!!treeNode.children && treeNode.children.length>0" v-show="isExpand">
                <pl-tree-node v-for="(item,index) in  treeNode.children" :key="index" :tree-node="item" :level="level+1"/>
            </ul>
        </pl-collapse-transition>
    </li>
</template>

<script>
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
            return {}
        },
        computed: {
            isExpand() {
                return this.plTree.p_expandKeys.indexOf(this.treeNode.key) > -1
            },
            contentStyles() {
                return {
                    paddingLeft: `${this.plTree.intent * this.level}px`
                }
            },
        },
        methods: {},
    }
</script>

<style lang="scss">
</style>