import {designComponent,InheritHtmlElement, inject, useModel, useRefs} from "plain-ui-composition"
import {EditProps, useEdit} from "../../use/useEdit";
import {DEFAULT_STATUS, StyleProps, useStyle} from "../../use/useStyle";
import {CheckboxStatus} from "../../utils/constant";

export const PlRadioGroup = designComponent({
    name: 'pl-radio-group',
    props: {
        ...EditProps,
        ...StyleProps,

        modelValue: {},
        itemWidth: {type: [String, Number]},                       // 每一个单选框的宽度
    },
    slots: ['default'],
    emits: {
        onUpdateModelValue: (val: any) => true
    },
    inheritPropsType: InheritHtmlElement,
    provideRefer: true,
    setup({props, slots, event: {emit}}) {

        const {refs, onRef} = useRefs({el: HTMLDivElement})
        const formItem = inject('@@pl-form-item', null)

        useEdit()
        useStyle({status: DEFAULT_STATUS})
        const model = useModel(() => props.modelValue, emit.onUpdateModelValue)

        const handler = {
            onClickRadio: (val: any) => {
                model.value = val
            },
        }
        const utils = {
            getCheckStatus: (val: any) => {
                return val === model.value ? CheckboxStatus.check : CheckboxStatus.uncheck
            }
        }
        return {
            refer: {
                refs,
                props,
                handler,
                utils,
            },
            render: () => !formItem ? slots.default() : (
                <div class="pl-radio-group" ref={onRef.el}>
                    {slots.default()}
                </div>
            )
        }
    },
})

export default PlRadioGroup
