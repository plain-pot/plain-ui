<template>
    <pl-dialog v-model="show" confirmButton cancelButton @confirm="pl_confirm" @cancel="pl_cancel" width="400px" maxHeight="500px">
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
                const ret = {}
                this.cols.forEach(col => {
                    if (!col.editable) {
                        ret[col.field] = false
                    } else {
                        ret[col.field] = (!col.editableFunc ? true : col.editableFunc(this.dataRow))
                    }
                })
                return ret
            },
            required() {
                if (!this.cols || this.cols.length === 0) return {}
                const ret = {}
                this.cols.forEach(col => {
                    const editable = this.editable[col.field]
                    if (editable === false) {
                        ret[col.field] = false
                    } else {
                        ret[col.field] = (!col.requiredFunc ? true : col.requiredFunc(this.dataRow))
                    }
                })
                return ret
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
    .plain-table-form-dialog-form {

        .pl-form-column {
            width: 100%;
            margin-right: 0 !important;
        }

        .pl-form-item {
            display: flex !important;
            width: 100%;
            height: 30px;
            align-items: center;
            margin-bottom: 12px !important;

            .pl-base-table-cell-watcher {
                flex: 1;

                .pl-input, .pl-date, .pl-time {
                    width: 100% !important;
                }
            }
        }
    }
</style>
