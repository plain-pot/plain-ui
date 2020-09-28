import {computed, defineComponent} from "@vue/composition-api";
import {TimePanelProps} from "@/packages/time/time-panel";
import {EmitFunc, useEvent} from "@/use/useEvent";
import {useModel} from "@/use/useModel";
import {PlainDate} from "@/util/PlainDate";
import {$plain} from "@/packages/base";
import {useDateTime} from "@/packages/date-time-input/useDateTime";
import {EditProps} from "@/use/useEdit";
import {StyleProps} from "@/use/useStyle";
import {useEditPopperAgent} from "@/packages/popper/agent/useEditPopperAgent";
import {$time} from "@/packages/time/$time";

export default defineComponent({
    name: 'pl-time',
    props: {
        ...StyleProps,
        ...EditProps,
        ...TimePanelProps,
    },
    setup(props) {

        const {emit} = useEvent({
            input: EmitFunc,
            blur: EmitFunc,
            focus: EmitFunc,
            updateStart: EmitFunc,
            updateEnd: EmitFunc,
        })

        const value = useModel(() => props.value, emit.input)
        const start = useModel(() => props.start, emit.updateStart)
        const end = useModel(() => props.end, emit.updateEnd)

        const formatData = computed(() => ({
            value: new PlainDate(value.value, props.displayFormat, props.valueFormat),
            start: new PlainDate(start.value, props.displayFormat, props.valueFormat),
            end: new PlainDate(end.value, props.displayFormat, props.valueFormat),
        }))

        const agentState = useEditPopperAgent(() => $time(() => ({
            reference: () => refs.$el,
            props: {
                ...(Object.keys(TimePanelProps).reduce((ret, key) => {
                    ret[key] = props[key]
                    return ret
                }, {})),
                value: value.value,
                start: start.value,
                end: end.value,
            },
            listener: {
                change: (val, type) => {
                    if (!props.range) {
                        value.value = val
                    } else {
                        if (type === 'start') {
                            start.value = val
                        } else {
                            end.value = val
                        }
                    }
                },
                'mousedown-base-panel': async () => {
                    agentState.state.focusCounter++
                    await $plain.utils.delay(0)
                    refs.valueInput.methods.focus()
                },
                'mousedown-start-panel': async () => {
                    agentState.state.focusCounter++
                    await $plain.utils.delay(0)
                    refs.startInput.methods.focus()
                },
                'mousedown-end-panel': async () => {
                    agentState.state.focusCounter++
                    await $plain.utils.delay(0)
                    refs.endInput.methods.focus()
                },
            }
        })))

        const {
            refs,
            handler,
            inputValue,
        } = useDateTime({
            value,
            start,
            end,
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
                            value.value = undefined
                            return;
                        }
                        if (valuePd.format(valuePd.parseDisplayString(val)) != val) {
                            return;
                        }

                        valuePd.setDisplayValue(val)
                        value.value = valuePd.valueString as string

                        break
                    case "start":
                        if (!val) {
                            return;
                        }
                        if (startPd.format(startPd.parseDisplayString(val)) != val) {
                            return;
                        }

                        startPd.setDisplayValue(val)
                        start.value = startPd.valueString as string

                        if (endPd.isNull || startPd.Hms! > endPd.Hms!) {
                            end.value = start.value
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
                        end.value = endPd.valueString as string

                        if (startPd.isNull || endPd.Hms! < startPd.Hms!) {
                            start.value = end.value
                        }

                        break
                }
            },
        }

        return () => (
            <pl-input
                class="pl-time pl-input-custom"
                value={inputValue.value}
                suffixIcon="el-icon-time"
                clearIcon
                isFocus={agentState.state.focusCounter > 0}
                width={null}
                inputInnerTabindex={null}
                clearHandler={handler.clearHandler}
                {...{
                    on: {
                        'click-input': handler.clickInput,
                        'keydown': handler.keydown,
                    }
                }}
            >
                <div class="pl-input-custom-inner" range={props.range}>
                    {
                        !props.range ? (
                            <pl-date-time-input value={formatData.value.value.displayString}
                                                displayFormat={props.displayFormat}
                                                ref="valueInput"
                                                {...{
                                                    on: {
                                                        change: val => customHandler.change(val, 'value'),
                                                        focus: handler.customInputFocus,
                                                        blur: handler.customInputBlur,
                                                    }
                                                }}
                            />
                        ) : (
                            [
                                <pl-date-time-input width="100"
                                                    value={formatData.value.start.displayString}
                                                    displayFormat={props.displayFormat}
                                                    ref="startInput"
                                                    {...{
                                                        on: {
                                                            change: val => customHandler.change(val, 'start'),
                                                            focus: handler.customInputFocus,
                                                            blur: handler.customInputBlur,
                                                        }
                                                    }}/>,
                                <span>~</span>,
                                <pl-date-time-input width="100"
                                                    value={formatData.value.end.displayString}
                                                    displayFormat={props.displayFormat}
                                                    ref="endInput"
                                                    {...{
                                                        on: {
                                                            change: val => customHandler.change(val, 'end'),
                                                            focus: handler.customInputFocus,
                                                            blur: handler.customInputBlur,
                                                        }
                                                    }}/>,
                            ]
                        )
                    }
                </div>
            </pl-input>
        )
    },
})