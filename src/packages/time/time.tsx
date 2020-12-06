import {designComponent} from "../../use/designComponent";
import {StyleProps} from "../../use/useStyle";
import {EditProps} from "../../use/useEdit";
import {TimePanelProps} from "./panel/time-panel";
import {useModel} from "../../use/useModel";
import {computed} from 'vue';
import {PlainDate} from "../../utils/PlainDate";
import {useEditPopperAgent} from "../popper/edit/useEditPopperAgent";
import {TimeServiceGetter} from "./servce/time-service";
import {useRefs} from "../../use/useRefs";
import Input from '../input'
import {TimeRangePanelType} from "./panel/time-range-panel";
import {delay} from "plain-utils/utils/delay";

export default designComponent({
    name: 'pl-time',
    props: {
        ...StyleProps,
        ...EditProps,
        ...TimePanelProps,
    },
    emits: {
        updateModelValue: (val?: string) => true,
        updateStart: (val?: string) => true,
        updateEnd: (val?: string) => true,
        blur: (e: Event) => true,
        focus: (e: Event) => true,
    },
    setup({props, event: {emit}}) {

        const {refs} = useRefs({
            input: Input,
        })

        const model = useModel(() => props.modelValue, emit.updateModelValue)
        const startModel = useModel(() => props.start, emit.updateStart)
        const endModel = useModel(() => props.end, emit.updateEnd)

        const formatData = computed(() => ({
            value: new PlainDate(model.value, props.displayFormat, props.valueFormat),
            start: new PlainDate(startModel.value, props.displayFormat, props.valueFormat),
            end: new PlainDate(endModel.value, props.displayFormat, props.valueFormat),
        }))

        const handler = {
            onServiceChange: (val: string | undefined, type?: TimeRangePanelType) => {
                if (!props.range) {
                    model.value = val
                } else {
                    if (type === TimeRangePanelType.start) {
                        startModel.value = val
                    } else {
                        endModel.value = val
                    }
                }
            },
            mousedownBasePanel: () => {
                agentState.state.focusCounter++
                delay(0)
                // refs.valueInput.methods.focus()
            }
        }

        const agentState = useEditPopperAgent({
            event: {emit},
            serviceGetter: TimeServiceGetter,
            option: {
                reference: () => refs.input as any,
                renderAttrs: () => ({
                    ...(Object.keys(TimePanelProps).reduce((ret: any, key) => {
                        ret[key] = (props as any)[key]
                        return ret
                    }, {})),
                    modelValue: model.value,
                    start: startModel.value,
                    end: endModel.value,

                    onChange: handler.onServiceChange,
                })
            },
        })

        return {
            render: () => (
                <div>
                    time
                </div>
            )
        }
    },
})