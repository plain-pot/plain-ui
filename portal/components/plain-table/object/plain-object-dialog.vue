<template>
    <pl-dialog title="请选择一行记录"
               v-model="show"
               confirmButton
               cancelButton
               @confirm="pl_confirm"
               @cancel="pl_cancel"
               disabledHideOnConfirm
               width="600px">
        <plain-table :option="option" v-if="init" ref="table" class="plain-table-service"/>
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
            }
        },
        methods: {
            async pick(option, onConfirm, onCancel) {
                option.pl_loadDefaultOption('service')
                Object.assign(this, {option, onConfirm, onCancel})
                this.init = true
                option.reload()
                await this.$plain.nextTick()
                await this.$plain.$utils.delay(50)
                this.show = true
            },
            pl_confirm() {

            },
            pl_cancel() {

            },
            async pl_destroy() {
                await this.$plain.delay(200)
                this.init = false
                this.option = null
                this.onConfirm = null
                this.onCancel = null
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
