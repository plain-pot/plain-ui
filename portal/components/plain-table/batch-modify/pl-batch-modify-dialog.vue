<template>
    <pl-dialog dialogClass="pl-batch-modify-dialog"
               title="批量修改"
               confirmButton
               cancelButton
               v-model="show"
               width="380px"
               maxHeight="400px"
               @confirm="pl_confirm"
               @cancel="pl_cancel"
    >
        <div class="pl-batch-modify-dialog-list">
            <div class="pl-batch-modify-dialog-item" v-for="(item,index) in result" :key="item.field+index">
                <pl-select :input="{width:'120px',noClear:true}" :data="columns" labelKey="title" valueKey="field" :value="item.field" @input="val=>pl_input(val,item)"/>
                <div class="pl-batch-modify-dialog-item-edit">
                    <pl-base-table-cell-watcher key="edit"
                                                :data="{row:row,editRow:row,rowIndex:0,colIndex:0,col:item.col,prop:item.col.prop}"
                                                :scope-slot-func="item.col.scopedSlots.edit"
                                                :render-func="item.col.renderEdit"/>
                </div>
                <pl-icon icon="pad-close-circle-fill" @click.stop="pl_deleteItem(item,index)"/>
            </div>
        </div>

        <pl-button label="新增修改字段" slot="footLeft" @click="add"/>
    </pl-dialog>
</template>

<script>
    import PlBaseTableCellWatcher from "../../../../src/components/table/pl-base-table-cell-watcher";

    export default {
        name: "pl-batch-modify-dialog",
        components: {PlBaseTableCellWatcher},
        data() {
            return {
                show: false,
                onConfirm: null,
                onCancel: null,
                columns: [],

                row: {},
                result: [],
            }
        },
        computed: {
            existColFields() {
                if (!this.result || this.result.length === 0) return null
                return this.result.map(item => item.field)
            },
            leftCols() {
                if (!this.existColFields) return this.columns
                return this.columns.filter(col => this.existColFields.indexOf(col.field) === -1)
            },
        },
        methods: {
            async pick({columns, onConfirm, onCancel}) {

                this.columns = []
                this.onConfirm = null
                this.onCancel = null
                this.row = {}

                this.result = []
                await this.$plain.nextTick()

                this.columns = columns.filter(col => !!col.batchModify)
                this.onConfirm = onConfirm
                this.onCancel = onCancel

                this.add()
                this.show = true
            },
            async add() {
                if (!this.leftCols || this.leftCols.length === 0) {
                    this.$dialog.show('已经添加完所有可修改的字段！')
                    return
                }
                const col = this.leftCols[0]
                this.pl_setValue('null', col)
                this.result.push({
                    field: col.field,
                    col,
                })
            },
            pl_input(field, item) {
                if (!this.existColFields) return
                const targetCol = this.getColByField(field)
                const oldField = item.field
                item.field = null
                if (this.existColFields.indexOf(field) > -1 && field !== oldField) {
                    this.$dialog.show(`已经存在要修改的字段：${targetCol.title}`)
                    this.$nextTick(() => item.field = oldField)
                    return;
                }
                item.field = field
                item.col = targetCol
                this.pl_setValue('delete', this.getColByField(oldField))
                this.pl_setValue('null', targetCol)
            },
            getColByField(field) {
                if (!this.columns) return null
                for (let i = 0; i < this.columns.length; i++) {
                    const col = this.columns[i];
                    if (col.field === field) return col
                }
                return null
            },
            pl_deleteItem(item, index) {
                if (this.result.length === 1) {
                    this.$dialog.show('至少有一个需要修改的字段！')
                    return
                }
                this.pl_setValue('delete', item.col)
                this.result.splice(index, 1)
            },
            pl_setValue(deleteOrNull, col) {
                const deleteHandler = (field) => delete this.row[field]
                const nullHandler = (field) => this.$set(this.row, field, null)
                const handler = deleteOrNull === 'null' ? nullHandler : deleteHandler
                const fields = col.getFields(col)
                fields.forEach(field => handler(field))
            },
            async pl_confirm() {
                !!this.onConfirm && await this.onConfirm(this.row)
                this.p_show = false
            },
            pl_cancel() {
                !!this.onCancel && this.onCancel()
            },
        },
    }
</script>

<style lang="scss">
</style>
