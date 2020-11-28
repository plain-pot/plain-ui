<template>
    <div class="demo-tree">
        <demo-row title="基本用法">
            <pl-tree
                    :data="treeData"
                    keyField="id"
                    labelField="name"
                    childrenField="subs"
                    expandOnClickNode
            >

            </pl-tree>
        </demo-row>
    </div>
</template>

<script>

    import treeData from '../data/tree.data'

    export default {
        name: "tree",
        data() {
            return {
                treeData,
            }
        },
    }
</script>

<style lang="scss">

</style>