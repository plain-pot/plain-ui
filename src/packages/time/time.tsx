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

        const formatData = computed(() => ({
            value: !model.value ? null : plainDate(model.value, props),
            start: !startModel.value ? null : plainDate(startModel.value, props),
            end: !endModel.value ? null : plainDate(endModel.value, props),
        }))

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

                let {start: spd, end: epd} = formatData.value

                if (!val) {
                    /*清空值*/
                    switch (type) {
                        case "value":
                            return model.value = undefined
                        case "start":
                            return startModel.value = undefined
                        case "end":
                            return endModel.value = undefined
                    }
                }

                let vpd = plainDate.parse(val, props.displayFormat)

                if (!vpd) {
                    /*值解析失败*/
                    return
                }

                if (vpd.format(props.displayFormat) !== val) {
                    /*值格式不正确*/
                    return
                }

                switch (type) {
                    case "value":
                        return model.value = vpd.format(props.valueFormat)
                    case "start":
                        spd = plainDate(val, props)
                        startModel.value = vpd.format(props.valueFormat)
                        if (!epd || spd.Hms > epd.Hms) {
                            endModel.value = startModel.value
                        }
                        return
                    case "end":
                        epd = plainDate(val, props)
                        endModel.value = vpd.format(props.valueFormat)
                        if (!spd || epd.Hms < spd.Hms) {
                            startModel.value = endModel.value
                        }
                        return
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