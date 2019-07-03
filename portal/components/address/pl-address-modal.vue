<template>
    <pl-dialog dialogClass="pl-address-modal"
               v-model="show"
               width="550px"
               initialized
               noPadding
               confirmButton
               cancelButton
               @confirm="pl_confirm"
               @cancel="pl_cancel"
               disabledHideOnConfirm
               title="选择地址">
        <div class="pl-address-modal-content">
            <pl-address-modal-item type="province" :value="data.province" @click="pl_click" @dblclick="pl_dblclick" v-show="!!view.province"/>
            <pl-address-modal-item type="city" :value="data.city" @click="pl_click" @dblclick="pl_dblclick" :parent-code="data.province" v-show="!!view.city"/>
            <pl-address-modal-item type="area" :value="data.area" @click="pl_click" @dblclick="pl_dblclick" :parent-code="data.city" v-show="!!view.area"/>
        </div>
    </pl-dialog>
</template>

<script>
    import PlAddressModalItem from "./pl-address-modal-item";

    export default {
        name: "pl-address-modal",
        components: {PlAddressModalItem},
        data() {
            return {
                show: false,

                data: {
                    province: null,
                    city: null,
                    area: null,
                },

                view: {
                    province: false,
                    city: false,
                    area: false,
                },
                onConfirm: null,
                onCancel: null,
            }
        },
        methods: {
            pick({view, onConfirm, onCancel, data}) {
                Object.assign(this, {
                    view: (view || {}),
                    onConfirm: null,
                    onCancel: null,
                }, {view, onConfirm, onCancel})
                Object.assign(this.data, {
                    province: null,
                    city: null,
                    area: null,
                }, data)

                this.show = true
            },
            pl_click({val, type}) {
                this.data[type] = val.code
                if (type === 'province') {
                    this.data.city = null
                    this.data.area = null
                } else if (type === 'city') {
                    this.data.area = null
                }
            },
            async pl_dblclick({val, type}) {
                await this.$plain.nextTick()
                await this.$plain.$utils.delay(0)
                this.pl_confirm()
            },
            pl_confirm() {

                let inValidType = null
                Object.keys(this.view).forEach(type => {
                    if (!inValidType && !!this.view[type] && this.data[type] == null) {
                        inValidType = type
                    }
                })
                if (!!inValidType) {
                    const msg = `请选择${this.$address.titleMap[inValidType]}！`
                    this.$message.show(msg, {type: 'error'})
                    return
                }

                !!this.onConfirm && this.onConfirm(this.data)
                this.show = false
            },
            pl_cancel() {
                !!this.onCancel && this.onCancel()
                this.show = false
            },
        }
    }
</script>

<style lang="scss">
    .pl-address-modal {
        .pl-address-modal-content {
            padding: 6px 9px;
            box-sizing: border-box;
        }
    }
</style>
