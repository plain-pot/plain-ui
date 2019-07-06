<template>
    <pl-dialog v-model="p_value" v-bind="option" @confirm="pl_confirm" @cancel="pl_cancel">
        <div class="pl-dialog-service-edit-wrapper" v-if="option.editType!=null">
            <pl-input v-if="option.editType === 'input'" v-model="option.message" :readonly="option.editReadonly === true"/>
            <pl-textarea v-if="option.editType === 'textarea'" v-model="option.message" :readonly="option.editReadonly === true"/>
        </div>
        <pl-render-func v-else-if="!!option.render" :render-func="option.render"/>
        <span v-else>{{option.message}}</span>
    </pl-dialog>
</template>

<script>
    import PlDialog from "./pl-dialog";
    import {ValueMixin} from "../../mixin/component-mixin";
    import PlRenderFunc from "../render/pl-render-func";
    import PlInput from "../pl-input";
    import PlTextarea from "../pl-textarea";

    export default {
        name: "pl-dialog-service",
        components: {PlTextarea, PlInput, PlRenderFunc, PlDialog},
        mixins: [ValueMixin],
        data() {

            const defaultProps = Object.keys(PlDialog.props).reduce((ret, key) => {
                const prop = PlDialog.props[key]
                if (!!prop.default) {
                    ret[key] = this.$plain.$utils.typeOf(prop.default) === 'function' ? prop.default() : prop.default
                } else {
                    ret[key] = null
                }
                return ret
            }, {})

            Object.assign(defaultProps, {
                message: null,
                editType: null,
                editReadonly: false,
                render: null,
                onConfirm: null,
                onCancel: null,
            })

            return {
                defaultProps,
                option: this.$plain.$utils.deepCopy(defaultProps),
            }
        },
        methods: {
            show(message, option) {
                option = option || {}
                switch (this.$plain.$utils.typeOf(message)) {
                    case 'string':
                        option.message = message
                        break
                    case 'object':
                        option = message
                        break;
                }
                Object.assign(this.option, this.defaultProps, option)
                this.p_value = true
            },
            pl_confirm() {
                !!this.option.onConfirm && this.option.onConfirm(this.option.message)
            },
            pl_cancel() {
                !!this.option.onCancel && this.option.onCancel()
            },
        },
    }
</script>

<style lang="scss">

</style>
