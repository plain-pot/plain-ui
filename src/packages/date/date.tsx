import {computed, defineComponent, Ref} from "@vue/composition-api";
import {EditProps} from "@/use/useEdit";
import {DatePublicProps, DefaultFormatString} from "@/packages/date/date-utils";
import {EmitFunc, useEvent} from "@/use/useEvent";
import {useModel} from "@/use/useModel";
import {PlainDate} from "@/util/PlainDate";
import {usePopperAgentEditor} from "@/packages/popper/service/PopperAgent";
import {$plain} from "@/packages/base";
import {TimePanelProps} from "@/packages/time/time-panel";
import {useDateTime} from "@/packages/date-time-input/useDateTime";
import {StyleProps} from "@/use/useStyle";
import {$date} from "@/packages/date/$date";
import {useEditPopperAgent} from "@/packages/popper/agent/useEditPopperAgent";

export default defineComponent({
    name: 'pl-date',
    props: {
        ...StyleProps,
        ...EditProps,
        ...DatePublicProps,

        panel: {type: String, default: 'date'},
        collapseTags: {type: Boolean, default: true},
    },
    setup(props) {

        const {emit} = useEvent({
            input: EmitFunc,
            blur: EmitFunc,
            focus: EmitFunc,
            updateStart: EmitFunc,
            updateEnd: EmitFunc,
        })

        const model = useModel(() => props.value, emit.input)
        const startModel = useModel(() => props.start, emit.updateStart)
        const endModel = useModel(() => props.end, emit.updateEnd)

        const agentState = useEditPopperAgent(() => $date(() => ({
            reference: () => refs.$el,
            props: {
                ...(Object.keys(TimePanelProps).reduce((ret, key) => {
                    ret[key] = props[key]
                    return ret
                }, {})),
                panel: props.panel,
                value: model.value,
                start: startModel.value,
                end: endModel.value,
            },
            listener: {
                change: (val, type) => {
                    if (!props.range) {
                        model.value = val
                    } else {
                        if (type === 'start') {
                            startModel.value = val
                        } else {
                            endModel.value = val
                        }
                    }
                },
                'mousedown-panel': async (e, type) => {
                    agentState.state.focusCounter++
                    await $plain.utils.delay(0)

                    if (props.panel === 'dates') {
                        refs.plInput.methods.focus()
                    } else if (!props.range) {
                        refs.valueInput.methods.focus()
                    } else {
                        if (type === 'start') {
                            refs.startInput.methods.focus()
                        } else {
                            refs.endInput.methods.focus()
                        }
                    }
                },
            }
        })))

        const {
            refs,
            handler,
            inputValue,
            editComputed,
        } = useDateTime({
            value: model,
            start: startModel,
            end: endModel,
            props,
            agentState,
            emit,
        })

        /*---------------------------------------:computer:format-------------------------------------------*/

        const displayFormat = computed(() => props.displayFormat || DefaultFormatString[props.panel] as string) as Ref<string>
        const valueFormat = computed(() => props.valueFormat || DefaultFormatString[props.panel] as string) as Ref<string>

        /*---------------------------------------computer-------------------------------------------*/

        const formatData = computed(() => {

            if (props.panel === 'dates') {
                let value = (model.value || []) as string[]
                const valuePds = value.map(item => new PlainDate(item, displayFormat.value, valueFormat.value))
                const datesString = valuePds.map(item => item.displayString)
                return {
                    value: valuePds,
                    datesString,
                }
            }

            const value = new PlainDate(model.value, displayFormat.value, valueFormat.value)
            const start = new PlainDate(startModel.value, displayFormat.value, valueFormat.value)
            const end = new PlainDate(endModel.value, displayFormat.value, valueFormat.value)

            return {
                value, start, end
            }
        })

        const inputBinding = computed(() => {
            const {panel} = props
            const isDates = panel === 'dates'
            return {
                class: [
                    'pl-date',
                    {
                        'pl-input-custom': !isDates,
                        'pl-input-tags': isDates,
                    },
                ],
                props: {
                    value: inputValue.value,
                    suffixIcon: 'el-icon-date',
                    clearIcon: true,
                    isFocus: agentState.state.focusCounter > 0,
                    width: isDates ? undefined : null,
                    inputInnerTabindex: isDates ? 0 : null,
                    clearHandler: handler.clearHandler,
                },
                on: {
                    'click-input': handler.clickInput,
                    focus: agentState.handler.focus,
                    blur: agentState.handler.blur,
                },
            }
        })

        const customHandler = {
            onInputChange(val, type) {
                const {value, start, end} = formatData.value as { value: PlainDate, start: PlainDate, end: PlainDate }

                if (props.panel === 'dates') {
                    model.value = val
                }

                switch (type) {
                    case 'value':

                        if (!val) {
                            value.setValue(undefined)
                            model.value = undefined
                            return;
                        }
                        if (value.format(value.parseDisplayString(val)) != val) {
                            return;
                        }

                        value.setDisplayValue(val)
                        model.value = value.valueString!

                        break
                    case 'start':

                        if (!val) {
                            return;
                        }
                        if (start.format(start.parseDisplayString(val)) != val) {
                            return;
                        }

                        start.setDisplayValue(val)
                        startModel.value = start.valueString!

                        if (end.isNull || (!!props.datetime ? start.YMDHms! > end.YMDHms! : start.YMD! > end.YMD!)) {
                            endModel.value = start.valueString!
                        }

                        break
                    case 'end':

                        if (!val) {
                            return;
                        }
                        if (end.format(end.parseDisplayString(val)) != val) {
                            return;
                        }

                        end.setDisplayValue(val)
                        endModel.value = end.valueString!

                        if (start.isNull || (!!props.datetime ? start.YMDHms! > end.YMDHms! : start.YMD! > end.YMD!)) {
                            startModel.value = end.valueString!
                        }

                        break
                }
            },
            onClickItemCloseIcon(item, index, e: MouseEvent) {
                e.stopPropagation()
                e.preventDefault()

                if (!editComputed.value.editable) {
                    return
                }
                // @ts-ignore
                const value = model.value as string[]
                value.splice(index, 1)
                // @ts-ignore
                model.value = [...value]
            },
        }

        return () => (
            <pl-input
                ref="plInput"
                {...inputBinding.value}
            >
                <div class="pl-input-custom-inner" range={props.range}>
                    {
                        props.panel === 'dates' ?
                            (
                                <pl-input-inner-tags
                                    data={formatData.value.datesString || []}
                                    collapseTags={props.collapseTags}
                                    {...{
                                        scopedSlots: {
                                            default: ({item, index}) => [
                                                <span>{item}</span>,
                                                <pl-icon icon="el-icon-close" onClick={(e) => customHandler.onClickItemCloseIcon(item, index, e)}/>
                                            ]
                                        }
                                    }}
                                />
                            ) :
                            (
                                !props.range ?
                                    (
                                        <pl-date-time-input value={(formatData.value.value as PlainDate).displayString}
                                                            ref="valueInput"
                                                            onChange={val => customHandler.onInputChange(val, 'value')}
                                                            displayFormat={displayFormat.value}
                                                            onFocus={handler.customInputFocus}
                                                            onBlur={handler.customInputBlur}
                                        />
                                    ) :
                                    (
                                        [
                                            <pl-date-time-input
                                                width="100"
                                                value={formatData.value.start!.displayString}
                                                ref="startInput"
                                                displayFormat={displayFormat.value}

                                                onChange={val => customHandler.onInputChange(val, 'start')}
                                                onFocus={handler.customInputFocus}
                                                onBlur={handler.customInputBlur}
                                            />,
                                            <span>~</span>,
                                            <pl-date-time-input
                                                width="100"
                                                value={formatData.value.end!.displayString}
                                                ref="endInput"
                                                onChange={val => customHandler.onInputChange(val, 'end')}
                                                displayFormat={displayFormat.value}
                                                onFocus={handler.customInputFocus}
                                                onBlur={handler.customInputBlur}
                                            />,
                                        ]
                                    )
                            )
                    }
                </div>
            </pl-input>
        )
    },
})