<template>
    <div class="table-columns">
        <pl-form>
            <pl-form-item label="是否开启虚拟滚动">
                <pl-toggle v-model="virtualFlag"/>
            </pl-form-item>
            <pl-form-item>
                <pl-button-group :disabled="editNodes.length === 0">
                    <pl-button @click="saveEdit">保存编辑</pl-button>
                    <pl-button @click="cancelEdit">取消编辑</pl-button>
                </pl-button-group>
            </pl-form-item>
        </pl-form>
        <pl-table
                :data="data"
                :virtual="virtualFlag"
                @dblclick-row="onDblClickRow">
            <plc field="id" title="普通文本列"/>
            <plc-input field="name" title="文本框" required/>
            <plc-number field="size" title="数字框"/>
            <plc-date field="date" title="日期" required/>
            <plc-color-picker field="color" title="颜色"/>

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
                virtualFlag: true,
            }
        },
        methods: {
            onDblClickRow(tableNode) {
                if (!tableNode.isEdit) {
                    tableNode.enableEdit()
                    this.editNodes.push(tableNode)
                }
            },
            async saveEdit() {
                const validates = (await Promise.all(this.editNodes.map(node => node.validate()))).filter(Boolean)
                if (validates.length > 0) {
                    const {message, rowData} = validates[0]
                    this.$message.error(`第${rowData.index + 1}条记录校验不通过，${message}`)
                    return
                }
                // todo 网络保存逻辑
                this.editNodes.forEach(tableNode => tableNode.saveEdit())
                this.editNodes.forEach(tableNode => tableNode.closeEdit())
                this.editNodes = []
            },
            cancelEdit() {
                this.editNodes.forEach(tableNode => {
                    tableNode.cancelEdit()
                })
                this.editNodes = []
            },
        }
    }
</script>

<style lang="scss">

</style>