import {defineComponent, getCurrentInstance, inject, onBeforeUnmount} from "@vue/composition-api";
import {EmitFunc, useEvent} from "@/use/useEvent";
import {useModel} from "@/use/useModel";
import {COLLAPSE_GROUP_PROVIDER} from "@/packages/collapse/collapse-group";
import {useRefer} from "@/use/useRefer";
import {SlotFunc, useSlots} from "@/use/useSlots";

export default defineComponent({
    name: 'pl-collapse',
    props: {
        title: {type: String},
        value: {type: Boolean},
        noIcon: {type: Boolean},
        iconColor: {type: String},
        disabledClickHead: {type: Boolean},
    },
    setup(props) {

        const {slots} = useSlots({
            head: SlotFunc,
        })

        const {emit} = useEvent({
            open: EmitFunc,
            close: EmitFunc,
            input: EmitFunc,
            clickHeader: EmitFunc,
        })

        const ctx = getCurrentInstance()

        const model = useModel(() => props.value, emit.input)

        const methods = {
            open: () => {
                if (model.value) return
                model.value = true
                emit.open()
            },
            close: () => {
                if (!model.value) return
                model.value = false
                emit.close()
            },
            toggle: () => {
                model.value ? methods.close() : methods.open()
            },
        }

        const handler = {
            clickHeader: () => {
                if (props.disabledClickHead) return
                emit.clickHeader(ctx)
                if (!!collapseGroup) {
                    collapseGroup.handler.clickItem(ctx)
                } else {
                    methods.toggle()
                }
            },
        }

        useRefer({
            methods,
            model,
            props,
        })

        const collapseGroup = inject(COLLAPSE_GROUP_PROVIDER) as any
        if (!!collapseGroup) {
            collapseGroup.methods.addItem(ctx)
        }

        onBeforeUnmount(() => {
            if (!!collapseGroup) {
                collapseGroup.methods.removeItem(ctx)
            }
        })

        return () => (
            <div class={['pl-collapse', {'pl-collapse-active': model.value}]}>
                <div class="pl-collapse-head" onClick={handler.clickHeader}>
                    {slots.head(
                        !!props.title ? <span>{props.title}</span> : null
                    )}
                    {
                        !props.noIcon && (
                            <div class="pl-collapse-head-icon-wrapper">
                                <pl-icon icon="el-icon-arrow-down" color={props.iconColor}/>
                            </div>
                        )
                    }

                </div>
                <pl-collapse-transition>
                    <div class="pl-collapse-body" {...{directives: [{name: 'show', value: model.value}]}}>
                        {slots.default()}
                    </div>
                </pl-collapse-transition>
            </div>
        )
    },
})