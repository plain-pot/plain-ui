<template>
    <div class="virtual-tree-large-data">
        <demo-line>
            <pl-button-group>
                <pl-button label="全部展开" @click="$refs.tree1.expandAll()"/>
                <pl-button label="全部收起" @click="$refs.tree1.collapseAll()"/>
            </pl-button-group>
        </demo-line>
        <pl-virtual-tree ref="tree1"
                         :data="treeData"
                         defaultExpandAll
                         keyField="id"
                         labelField="name"
                         childrenField="subs"
                         @node-click="val=>$plain.log(val.data.name)"/>
    </div>
</template>

<script>
    export default {
        name: "virtual-tree-large-data",
        props: {},
        data() {
            function dig(path = '0', level = 2) {
                const list = [];
                for (let i = 0; i < 10; i += 1) {
                    const key = `${path}-${i}`;
                    const treeNode = {
                        name: key,
                        id: key,
                    };

                    if (level > 0) {
                        treeNode.subs = dig(key, level - 1);
                    }

                    list.push(treeNode);
                }
                return list;
            }

            const treeData = dig()

            return {
                treeData,
            }
        },
        methods: {},
    }
</script>

<style lang="scss">
</style>