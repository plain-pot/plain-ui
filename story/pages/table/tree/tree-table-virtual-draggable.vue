<template>
    <div class="tree-table-virtual-draggable">

        <demo-line>
            <pl-button-group>
                <pl-button label="全部展开" @click="$refs.tree.treePlc.methods.expandAll()"/>
                <pl-button label="全部收起" @click="$refs.tree.treePlc.methods.collapseAll()"/>
                <pl-button label="获取选中数据" @click="$message($refs.tree.treePlc.methods.getCheckedData().map(item=>item.name).join(','))"/>
            </pl-button-group>
        </demo-line>
        <pl-table :data="tableData"
                  keyField="code"
                  childrenField="children"
                  virtual
                  showCheckbox>
            <plc-index/>
            <plc-tree ref="tree" rowDraggable>
                <template v-slot:content="{row}">
                    {{row.name}}
                </template>
            </plc-tree>
            <plc title="名称" field="id"/>
            <plc title="名称" field="name"/>
        </pl-table>
    </div>
</template>

<script>
    export default {
        name: "tree-table-virtual-draggable",
        data() {
            return {
                tableData: [],
            }
        },
        async mounted() {
            const data = (await import('../../data/address')).default
            this.tableData = [...data]
        }
    }
</script>

<style lang="scss">

</style>