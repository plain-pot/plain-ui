import {designComponent} from "../../use/designComponent";
import {StyleProps} from "../../use/useStyle";
import {EditProps} from "../../use/useEdit";
import {TimePanelProps} from "./panel/time-panel";
import {useModel} from "../../use/useModel";
import {computed} from 'vue';
import {PlainDate} from "../../utils/PlainDate";
import {useEditPopperAgent} from "../popper/edit/useEditPopperAgent";
import {TimeServiceGetter} from "./servce/time-service";
import {TimeRangePanelType} from "./panel/time-range-panel";
import {delay} from "plain-utils/utils/delay";
import {useDateTime} from "../date-time-input/useDateTime";
import './time.scss'

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

        const model = useModel(() => props.modelValue, emit.updateModelValue)
        const startModel = useModel(() => props.start, emit.updateStart)
        const endModel = useModel(() => props.end, emit.updateEnd)

        const formatData = computed(() => ({
            value: new PlainDate(model.value, props.displayFormat, props.valueFormat),
            start: new PlainDate(startModel.value, props.displayFormat, props.valueFormat),
            end: new PlainDate(endModel.value, props.displayFormat, props.valueFormat),
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
            change: (val: string, type: 'start' | 'end' | 'value') => {
                const {value: valuePd, start: startPd, end: endPd} = formatData.value

                switch (type) {
                    case "value":
                        if (!val) {
                            valuePd.setValue(undefined)
                            model.value = undefined
                            return;
                        }
                        if (valuePd.format(valuePd.parseDisplayString(val)) != val) {
                            return;
                        }

                        valuePd.setDisplayValue(val)
                        model.value = valuePd.valueString!

                        break
                    case "start":
                        if (!val) {
                            return;
                        }
                        if (startPd.format(startPd.parseDisplayString(val)) != val) {
                            return;
                        }

                        startPd.setDisplayValue(val)
                        startModel.value = startPd.valueString as string

                        if (endPd.isNull || startPd.Hms! > endPd.Hms) {
                            endModel.value = startModel.value
                        }

                        break

                    case "end":
                        if (!val) {
                            return;
                        }
                        if (endPd.format(endPd.parseDisplayString(val)) != val) {
                            return;
                        }

                        endPd.setDisplayValue(val)
                        endModel.value = endPd.valueString as string

                        if (startPd.isNull || endPd.Hms! < startPd.Hms) {
                            startModel.value = endModel.value
                        }

                        break
                }
            },
        }

        return {
            render: () => (
                <pl-input
                    ref="plInput"
                    class="pl-time pl-input-custom"
                    modelValue={inputValue.value}
                    suffixIcon="el-icon-time"
                    clearIcon
                    isFocus={agentState.state.focusCounter > 0}
                    width={null}
                    inputInnerTabindex={null}
                    clearHandler={handler.clearHandler}
                    onClickInput={handler.clickInput}
                    onKeydown={handler.keydown}>
                    <div{...{class: 'pl-input-custom-inner', range: String(props.range)}}>
                        {!props.range ? (
                            <pl-date-time-input
                                ref="valueInput"
                                modelValue={formatData.value.value.displayString}
                                displayFormat={props.displayFormat}
                                onChange={(val: string) => customHandler.change(val, 'value')}
                                onFocus={handler.customInputFocus}
                                onBlur={handler.customInputBlur}/>
                        ) : (
                            <>
                                <pl-date-time-input
                                    ref="startInput"
                                    width="100"
                                    modelValue={formatData.value.start.displayString}
                                    displayFormat={props.displayFormat}
                                    onChange={(val: string) => customHandler.change(val, 'start')}
                                    onFocus={handler.customInputFocus}
                                    onBlur={handler.customInputBlur}/>
                                <span>~</span>
                                <pl-date-time-input
                                    ref="endInput"
                                    width="100"
                                    modelValue={formatData.value.end.displayString}
                                    displayFormat={props.displayFormat}
                                    onChange={(val: string) => customHandler.change(val, 'end')}
                                    onFocus={handler.customInputFocus}
                                    onBlur={handler.customInputBlur}/>
                            </>)
                        }
                    </div>
                </pl-input>
            )
        }
    },
})