import {designComponent,InheritHtmlElement, useModel, useRefs} from "plain-design-composition";

export const PlCollapseGroup = designComponent({
    name: 'pl-collapse-group',
    props: {
        modelValue: {type: [String, Array]},
        limit: {type: Number, default: 1},
        disabled: {type: Boolean},
    },
    provideRefer: true,
    emits: {
        onUpdateModelValue: (val: string | string[] | undefined) => true
    },
    inheritPropsType: InheritHtmlElement,
    slots: ['default'],
    setup({props, event: {emit}, slots}) {
        const {refs, onRef} = useRefs({el: HTMLDivElement})
        const model = useModel(() => props.modelValue as string | string[] | undefined, emit.onUpdateModelValue)

        const utils = {
            isOpen: (val: string) => {
                if (!model.value) {
                    return
                }
                if (typeof model.value === "string") {
                    return model.value == val
                } else {
                    return (model.value as string[]).indexOf(val) > -1
                }
            }
        }

        const handler = {
            clickCollapseTitle: (val: string) => {
                if (props.limit === 1) {
                    model.value = val == model.value ? undefined : val
                } else {
                    const value = (model.value as string[] | undefined) || []
                    const index = value.indexOf(val)
                    if (index > -1) {
                        value.splice(index, 1)
                    } else {
                        value.push(val)
                        if (value.length > props.limit) {
                            value.shift()
                        }
                    }
                    model.value = [...value]
                }
            },
        }

        return {
            refer: {
                utils,
                handler,
                props,
                model,
                refs,
            },
            render: () => (
                <div class="pl-collapse-group" ref={onRef.el}>
                    {slots.default()}
                </div>
            )
        }
    },
})

export default PlCollapseGroup
