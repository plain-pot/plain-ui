<template>
    <pl-dialog v-model="show" confirmButton cancelButton @confirm="pl_confirm" @cancel="pl_cancel" width="400px" maxHeight="500px" title="编辑">
        <pl-form class="plain-table-form-dialog-form" text-align="right">
            <pl-form-column>
                <pl-form-item v-for="(col,index) in cols" :key="index+col.field" :label="col.title+'：'">
                    <pl-base-table-cell-watcher key="normal"
                                                v-if="!editable[col.field]"
                                                :data="{...dataRow,col,prop:col.prop}"
                                                :text="dataRow.showRow[col.field]"

                                                :scope-slot-func="col.scopedSlots.default"
                                                :render-func="col.renderNormal"/>
                    <pl-base-table-cell-watcher key="edit"
                                                v-else
                                                :data="{...dataRow,col,prop:col.prop}"
                                                :text="dataRow.showRow[col.field]"
                                                :required="required[col.field]"

                                                :scope-slot-func="col.scopedSlots.edit"
                                                :render-func="col.renderEdit"/>
                </pl-form-item>
            </pl-form-column>
        </pl-form>
    </pl-dialog>
</template>

<script>
    import PlBaseTableCellWatcher from "../../../../src/components/table/pl-base-table-cell-watcher";

    export default {
        name: "plain-table-form-dialog",
        components: {PlBaseTableCellWatcher},
        data() {
            return {
                show: false,
                cols: [],
                dataRow: {},
                onConfirm: null,
                onCancel: null,
            }
        },
        computed: {
            editable() {
                if (!this.cols || this.cols.length === 0) return {}
                const data = this.cols.reduce((ret, col) => {
                    const field = col.field
                    if (col.editable === false) ret[field] = false
                    else if (!!col.editableFunc) ret[field] = col.editableFunc(this.dataRow)
                    else ret[field] = true
                    return ret
                }, {})
                return data
            },
            required() {
                if (!this.cols || this.cols.length === 0) return {}
                const data = this.cols.reduce((ret, col) => {
                    const editable = this.editable[col.field]
                    const field = col.field
                    if (editable === false) ret[field] = false
                    else if (!!col.requiredFunc) ret[field] = col.requiredFunc(this.dataRow)
                    else ret[field] = col.required
                    return ret
                }, {})
                return data
            },
        },
        methods: {
            edit({cols, dataRow, onConfirm, onCancel}) {
                this.show = true
                // console.log({cols, dataRow})
                this.onConfirm = onConfirm
                this.onCancel = onCancel
                this.cols = cols.filter(col => !!col.formEditable)
                const {check, editRow, editable, hover, id, index, row} = dataRow
                const newEditRow = this.$plain.$utils.deepCopy(editRow)
                this.dataRow = {
                    editRow: newEditRow,
                    showRow: newEditRow,
                    row,
                    check,
                    editable: true,
                    hover,
                    id,
                    index,
                }
            },
            pl_confirm() {
                !!this.onConfirm && this.onConfirm(this.dataRow)
            },
            pl_cancel() {
                !!this.onCancel && this.onCancel()
            },
        }
    }
</script>

<style lang="scss">

</style>
