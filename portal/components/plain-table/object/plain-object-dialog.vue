<template>
    <pl-dialog title="请选择一行记录"
               v-model="show"
               confirmButton
               cancelButton
               @confirm="pl_confirm"
               @cancel="pl_cancel"
               disabledHideOnConfirm
               :width="p_width"
               :height="p_height">
        <plain-table :option="option" v-if="init" ref="table" class="plain-table-service" @dblclickRow="pl_dblclickRow"/>
    </pl-dialog>
</template>

<script>
    export default {
        name: "plain-object-dialog",
        data() {
            return {
                show: false,
                init: false,

                option: null,
                onConfirm: null,
                onCancel: null,
                width: null,
                height: null,
            }
        },
        computed: {
            p_width() {
                if (!this.option) return '600px'
                if (!!this.width) return this.width
                let width = 600
                if (!!this.option.insertable) width += 120
                if (!!this.option.deleteable) width += 80
                return width + 'px'
            },
            p_height() {
                return this.height
            },
        },
        methods: {
            async pick(option, onConfirm, onCancel) {
                option.pl_loadDefaultOption('service')
                Object.assign(this, {option, onConfirm, onCancel})
                this.init = true
                this.show = true
                option.simpleFilters = null
                option.reload()
                await this.$plain.nextTick()
                this.$refs.table.clearSelected()
                this.$refs.table.refresh()
            },
            pl_dblclickRow() {
                if (this.option.updateable || this.option.multiSelect) return
                else {
                    this.pl_confirm()
                }
            },
            async pl_confirm() {
                const dataRow = await this.$refs.table.getSelected()
                if (!dataRow || dataRow.length === 0) {
                    const msg = '请至少选择一行数据！'
                    this.$dialog.show(msg)
                    throw msg
                }
                !!this.onConfirm && this.onConfirm(dataRow)
                this.show = false
                this.pl_destroy()
            },
            pl_cancel() {
                !!this.onCancel && this.onCancel()
                this.pl_destroy()
            },
            async pl_destroy() {
                await this.$plain.$utils.delay(200)
                this.init = false
                this.option = null
                this.onConfirm = null
                this.onCancel = null
                this.width = null
                this.height = null
            },
        }
    }
</script>

<style lang="scss">
    .plain-table-service {
        .pl-pagination-operation {
            .pl-pagination-operate-icon:first-child {
                margin-right: 6px !important;
            }
        }
    }
</style>
