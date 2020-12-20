<template>
    <div class="table-plc-editable">
        <demo-row>
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
            <pl-table :data="data"
                      :virtual="virtualFlag"
                      :associateFields="associateFields"
                      @dblclick-cell="onDblClickRow">
                <plc-index/>
                <plc field="id" title="编号" width="50"/>
                <plc field="name" title="普通文本列"/>
                <plc field="name" title="普通文本列，编辑作用域插槽" width="200" :editable="isEditable">
                    <template v-slot:edit="{row}">
                        <input type="text" v-model="row.name" style="padding-left: 8px">
                    </template>
                </plc>

                <plc-input field="name" title="禁用编辑" :editable="false"/>
                <plc-input field="name" title="文本框" required/>
                <plc-input field="size"
                           title="文本框值大于6可以编辑"
                           width="200"
                           :editable="({editRow})=>!!editRow.name && editRow.name.length>5"
                           :rules="{
                           validator:(rule,value,row)=>!!row.name && row.name.length>5?
                           (!row.size && row.size!==0)?'name 长度大于5情况下必填':null
                           :null
                       }"
                />

                <plc-number field="size" title="数字框"/>
                <plc-date field="date" title="日期"/>
                <plc-color-picker field="color" title="颜色"/>

                <plc field="star" title="评分"/>
            </pl-table>
        </demo-row>
    </div>
</template>

<script>
    import data from "../data/data-1.json";


    export default {
        name: "table-plc-editable",
        data() {
            return {
                data,
                editNodes: [],
                virtualFlag: false,
                associateFields: {
                    name: 'size',
                },
                isEditable: ({editRow}) => !!editRow.name && editRow.name.length > 5,
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