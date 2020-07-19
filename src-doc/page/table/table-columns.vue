<template>
    <div class="table-columns">
        <demo-row>
            <pl-button-group :disabled="editNodes.length === 0">
                <pl-button @click="saveEdit">保存编辑</pl-button>
                <pl-button @click="cancelEdit">取消编辑</pl-button>
            </pl-button-group>
        </demo-row>
        <pl-table :data="data"
                  @dblclick-row="onDblClickRow"
        >
            <plc field="id" title="普通文本列"/>
            <plc-input field="name" title="文本框"/>
            <plc-number field="size" title="数字框"/>
            <plc field="date" title="日期"/>
            <plc field="color" title="颜色"/>

            <plc field="star" title="评分"/>
        </pl-table>
    </div>
</template>

<script>
    import data from "../data/data-1.json";


    export default {
        name: "table-columns",
        data() {
            return {
                data,
                editNodes: [],
            }
        },
        methods: {
            onDblClickRow(tableNode) {
                if (!tableNode.isEdit) {
                    tableNode.enableEdit()
                    this.editNodes.push(tableNode)
                }
            },
            saveEdit() {
                this.editNodes.forEach(tableNode => {
                    tableNode.saveEdit()
                    tableNode.closeEdit()
                })
            },
            cancelEdit() {
                this.editNodes.forEach(tableNode => {
                    tableNode.cancelEdit()
                })
            },
        }
    }
</script>

<style lang="scss">

</style>