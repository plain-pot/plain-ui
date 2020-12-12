import {designComponent} from "../../use/designComponent";
import {EditProps, useEdit} from "../../use/useEdit";
import {StyleProps, useStyle} from "../../use/useStyle";
import {useSlots} from "../../use/useSlots";
import {CheckboxStatus, DEFAULT_STATUS} from "../../utils/constant";
import {useModel} from "../../use/useModel";
import {useProps} from "../../use/useProps";
import {inject} from 'vue';

export default designComponent({
    name: 'pl-radio-group',
    props: {
        ...EditProps,
        ...StyleProps,

        modelValue: {},
        itemWidth: {type: [String, Number]},                       // 每一个单选框的宽度
    },
    emits: {
        updateModelValue: (val: any) => true
    },
    provideRefer: true,
    setup({props, event: {emit}}) {

        const formItem = inject('@@pl-form-item', null)

        const {slots} = useSlots()
        useEdit()
        useStyle({status: DEFAULT_STATUS})
        const model = useModel(() => props.modelValue, emit.updateModelValue)
        const {propsState} = useProps(props, {
            itemWidth: useProps.NUMBER,
        })

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
                propsState,
                handler,
                utils,
            },
            render: () => !formItem ? slots.default() : (
                <div class="pl-radio-group">
                    {slots.default()}
                </div>
            )
        }
    },
})