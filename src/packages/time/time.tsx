import {designComponent} from "../../use/designComponent";
import {StyleProps} from "../../use/useStyle";
import {EditProps} from "../../use/useEdit";
import {TimePanelProps} from "./panel/time-panel";
import {useModel} from "../../use/useModel";
import {computed} from 'vue';
import {useEditPopperAgent} from "../popper/edit/useEditPopperAgent";
import {TimeServiceGetter} from "./servce/time-service";
import {TimeRangePanelType} from "./panel/time-range-panel";
import {delay} from "plain-utils/utils/delay";
import {useDateTime} from "../date-time-input/useDateTime";
import './time.scss'
import {PlInput} from "../input/input";
import {PlDateTimeInput} from "../date-time-input/date-time-input";
import {useSlots} from "../../use/useSlots";
import {plainDate} from "../date/plainDate";

export const PlTime = designComponent({
    name: 'pl-time',
    props: {
        ...StyleProps,
        ...EditProps,
        ...TimePanelProps,
    },
    emits: {
        onUpdateModelValue: (val?: string) => true,
        onUpdateStart: (val?: string) => true,
        onUpdateEnd: (val?: string) => true,
        onBlur: (e: Event) => true,
        onFocus: (e: Event) => true,
    },
    setup({props, event: {emit}}) {

        const {slots} = useSlots(['foot'], true)

        const model = useModel(() => props.modelValue, emit.onUpdateModelValue)
        const startModel = useModel(() => props.start, emit.onUpdateStart)
        const endModel = useModel(() => props.end, emit.onUpdateEnd)

        const today = plainDate.today(props.displayFormat, props.valueFormat)

        const formatData = computed(() => ({
            value: !model.value ? null : plainDate(model.value, props),
            start: !startModel.value ? null : plainDate(startModel.value, props),
            end: !endModel.value ? null : plainDate(endModel.value, props),
        }))

        const maxmin = computed(() => {
            return {
                max: !props.max ? null : plainDate(props.max, props),
                min: !props.min ? null : plainDate(props.min, props),
            }
        })

        const serviceHandler = {
            onChange: (val: string | undefined, type?: TimeRangePanelType) => {
                // console.log('service change', {val, type})
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
            onMousedownBasePanel: async () => {
                agentState.state.focusCounter++
                await delay(0)
                refs.valueInput!.methods.focus()
            },
            onMousedownStartPanel: async () => {
                agentState.state.focusCounter++
                await delay(0)
                refs.startInput!.methods.focus()
            },
            onMousedownEndPanel: async () => {
                agentState.state.focusCounter++
                await delay(0)
                refs.endInput!.methods.focus()
            }
        }

        const agentState = useEditPopperAgent({
            event: {emit},
            serviceGetter: TimeServiceGetter,
            option: {
                reference: () => refs.plInput as any,
                renderAttrs: () => ({
                    ...(Object.keys(TimePanelProps).reduce((ret: any, key) => {
                        ret[key] = (props as any)[key]
                        return ret
                    }, {})),
                    modelValue: model.value,
                    start: startModel.value,
                    end: endModel.value,
                    ...serviceHandler,
                    foot: slots.foot.isExist() ? slots.foot : undefined,
                })
            },
        })

        const {
            refs,
            handler,
            inputValue,
        } = useDateTime({
            value: model,
            start: startModel,
            end: endModel,
            props,
            agentState,
            emit,
        })

        const customHandler = {
            change: (val: string | undefined, type: 'start' | 'end' | 'value') => {

                const jdView = 'Hms'
                let {start: spd, end: epd} = formatData.value
                /*没有值的话，如果是单值则请控值，否则什么也不做*/
                if (!val) {
                    if (type === 'value') {model.value = undefined}
                    return
                }
                let pd = today.useDisplay(val)
                /*输入值格式不正确，，什么是也不做*/
                if (!pd.getDayJs().isValid()) {return;}
                /*检查最大最小值*/
                const {max, min} = maxmin.value
                if (!!max && max[jdView] < pd[jdView]) pd = max
                if (!!min && min[jdView] > pd[jdView]) pd = min

                switch (type) {
                    case 'value':
                        model.value = pd.getValue()
                        break
                    case 'start':
                        startModel.value = pd.getDisplay()
                        if (!epd || (pd[jdView] > epd[jdView])) {endModel.value = startModel.value}
                        break
                    case 'end':
                        endModel.value = pd.getDisplay()
                        if (!spd || (pd[jdView] < spd[jdView])) {startModel.value = endModel.value}
                        break
                }
            },
        }

        return {
            render: () => (
                <PlInput
                    ref="plInput"
                    class="pl-time pl-input-custom"
                    modelValue={inputValue.value}
                    suffixIcon="el-icon-time"
                    clearIcon
                    isFocus={agentState.state.focusCounter > 0}
                    width={null as any}
                    inputInnerTabindex={null as any}
                    clearHandler={handler.clearHandler}
                    onClickInput={handler.clickInput}
                    onKeydown={handler.keydown}>
                    <div{...{class: 'pl-input-custom-inner', range: String(props.range)}}>
                        {!props.range ? (
                            <PlDateTimeInput
                                ref="valueInput"
                                modelValue={!formatData.value.value ? undefined : formatData.value.value.getDisplay()}
                                displayFormat={props.displayFormat}
                                {...{onChange: (val: string) => customHandler.change(val, 'value')}}
                                onFocus={handler.customInputFocus}
                                onBlur={handler.customInputBlur}/>
                        ) : (
                            <>
                                <PlDateTimeInput
                                    ref="startInput"
                                    width="100"
                                    modelValue={!formatData.value.start ? undefined : formatData.value.start.getDisplay()}
                                    displayFormat={props.displayFormat}
                                    {...{onChange: (val: string) => customHandler.change(val, 'start')}}
                                    onFocus={handler.customInputFocus}
                                    onBlur={handler.customInputBlur}/>
                                <span>~</span>
                                <PlDateTimeInput
                                    ref="endInput"
                                    width="100"
                                    modelValue={!formatData.value.end ? undefined : formatData.value.end.getDisplay()}
                                    displayFormat={props.displayFormat}
                                    {...{onChange: (val: string) => customHandler.change(val, 'end')}}
                                    onFocus={handler.customInputFocus}
                                    onBlur={handler.customInputBlur}/>
                            </>)
                        }
                    </div>
                </PlInput>
            )
        }
    },
})