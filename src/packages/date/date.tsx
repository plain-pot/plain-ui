import {designComponent} from "../../use/designComponent";
import './date.scss'
import {StyleProps} from "../../use/useStyle";
import {EditProps} from "../../use/useEdit";
import {DateEmitRangeType, DatePublicEmits, DatePublicProps, DefaultDateFormatString, WeekUtils} from "./date.utils";
import {useModel} from "../../use/useModel";
import {useEditPopperAgent} from "../popper/edit/useEditPopperAgent";
import {DateServiceGetter} from "./service/date-service";
import {useDateTime} from "../date-time-input/useDateTime";
import {delay} from "plain-utils/utils/delay";
import {computed, PropType} from 'vue';
import {DatePanelType} from "./panel/date-panel";
import {PlainDate, PlainDateType} from "../../utils/PlainDate";
import {PlInput} from '../input/input';
import {PlInputInnerTags} from "../input/input-inner-tags";
import {PlIcon} from "../icon/icon";
import {PlDateTimeInput} from "../date-time-input/date-time-input";

export const PlDate = designComponent({
    name: 'pl-date',
    props: {
        ...StyleProps,
        ...EditProps,
        ...DatePublicProps,
        modelValue: {},
        panel: {type: String, default: 'date'},
        collapseTags: {type: Boolean, default: true},
        customWeekString: {type: Function as PropType<(data: { week: number, year: number }) => string>},
    },
    emits: {
        ...DatePublicEmits,
        onBlur: (e: Event) => true,
        onFocus: (e: Event) => true,
    },
    setup({props, event: {emit}}) {

        const model = useModel(() => props.modelValue as any, emit.onUpdateModelValue)
        const startModel = useModel(() => props.start, emit.onUpdateStart)
        const endModel = useModel(() => props.end, emit.onUpdateEnd)

        const serviceHandler = {
            onChange: (val: string | undefined, type: DateEmitRangeType) => {
                if (!props.range) {
                    model.value = val
                } else {
                    if (type === 'start') {
                        startModel.value = val
                    } else {
                        endModel.value = val
                        if (props.panel !== DatePanelType.datetime) {
                            agentState.methods.hide()
                        }
                    }
                }
            },
            onMousedown: async (e: MouseEvent, type: DateEmitRangeType) => {
                agentState.state.focusCounter++
                await delay(0)
                if (props.panel === 'dates') {
                    refs.plInput!.methods.focus()
                } else if (!props.range) {
                    refs.valueInput!.methods.focus()
                } else {
                    if (type === 'start') {
                        refs.startInput!.methods.focus()
                    } else {
                        refs.endInput!.methods.focus()
                    }
                }
            },
        }

        const agentState = useEditPopperAgent({
            event: {emit},
            serviceGetter: DateServiceGetter,
            option: {
                reference: () => refs.plInput as any,
                renderAttrs: () => ({
                    ...(Object.keys(DatePublicProps).reduce((ret: any, key) => {
                        ret[key] = (props as any)[key]
                        return ret
                    }, {})),
                    panel: props.panel,
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

        /*---------------------------------------computed-------------------------------------------*/

        const displayFormat = computed(() => props.displayFormat || DefaultDateFormatString[props.panel as DatePanelType])
        const valueFormat = computed(() => props.valueFormat || DefaultDateFormatString[props.panel as DatePanelType])

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

        const inputAttrs = computed(() => {
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
                modelValue: Array.isArray(inputValue.value) ? inputValue.value.join('') : inputValue.value,
                suffixIcon: 'el-icon-date',
                clearIcon: true,
                isFocus: agentState.state.focusCounter > 0,
                width: isDates ? undefined : null,
                inputInnerTabindex: isDates ? 0 : null,
                clearHandler: handler.clearHandler,

                ...agentState.inputHandler,
                onClickInput: handler.clickInput,
            }
        })

        const displayString = computed(() => {

            if (props.panel !== DatePanelType.week) {
                return {
                    value: (formatData.value.value as PlainDateType).displayString,
                    start: formatData.value.start!.displayString,
                    end: formatData.value.end!.displayString,
                }
            } else {

                if (!props.range) {
                    const value = WeekUtils.getWeekNumber((formatData.value.value as PlainDateType).valueString!, {valueFormat: valueFormat.value, firstWeekDay: props.firstWeekDay})
                    return {
                        value: !value.year ? '' : !!props.customWeekString ? props.customWeekString(value as any) : `${value.year}年 第${value.week}周`
                    }
                } else {
                    const start = WeekUtils.getWeekNumber((formatData.value.start!).valueString!, {valueFormat: valueFormat.value, firstWeekDay: props.firstWeekDay})
                    const end = WeekUtils.getWeekNumber((formatData.value.end!).valueString!, {valueFormat: valueFormat.value, firstWeekDay: props.firstWeekDay})
                    return {
                        start: !start.year ? '' : !!props.customWeekString ? props.customWeekString(start as any) : `${start.year}年 第${start.week}周`,
                        end: !end.year ? '' : !!props.customWeekString ? props.customWeekString(end as any) : `${end.year}年 第${end.week}周`,
                    }
                }
            }
        })

        /*---------------------------------------custom handler-------------------------------------------*/

        const customHandler = {
            onInputChange(val: string | undefined, type: 'value' | 'start' | 'end') {
                if (props.panel === 'dates') {
                    model.value = val
                }
                const {value, start, end} = formatData.value as { value: PlainDateType, start: PlainDateType, end: PlainDateType }
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
            onClickItemCloseIcon(item: string, index: number, e: MouseEvent) {
                e.stopPropagation()
                e.preventDefault()

                if (!agentState.editComputed.value.editable) {
                    return
                }
                const value = model.value as any as string[]
                value.splice(index, 1)
                model.value = [...value] as any
            },
        }

        return {
            render: () => {
                return (
                    <PlInput ref="plInput"{...inputAttrs.value as any}>
                        <div {...{class: 'pl-input-custom-inner', range: props.range}}>

                            {props.panel === DatePanelType.dates && (<PlInputInnerTags
                                data={formatData.value.datesString}
                                collapseTags={props.collapseTags}
                                v-slots={{
                                    default: ({item, index}: { item: string, index: number }) => (<>
                                        <span>{item}</span>
                                        <PlIcon icon="el-icon-close" {...{onClick: (e: MouseEvent) => customHandler.onClickItemCloseIcon(item, index, e)}}/>
                                    </>)
                                }}
                            />)}

                            {props.panel !== DatePanelType.dates && (
                                !props.range ? (<PlDateTimeInput
                                        modelValue={displayString.value.value!}
                                        ref="valueInput"
                                        {...{onChange: (val: string) => customHandler.onInputChange(val, 'value')}}
                                        displayFormat={displayFormat.value}
                                        onFocus={handler.customInputFocus}
                                        onBlur={handler.customInputBlur}
                                    />) :
                                    <>
                                        <PlDateTimeInput
                                            width="100"
                                            modelValue={displayString.value.start!}
                                            ref="startInput"
                                            displayFormat={displayFormat.value}
                                            {...{onChange: (val: string) => customHandler.onInputChange(val, 'start')}}
                                            onFocus={handler.customInputFocus}
                                            onBlur={handler.customInputBlur}
                                        />
                                        <span>~</span>
                                        <PlDateTimeInput
                                            width="100"
                                            modelValue={displayString.value.end!}
                                            ref="endInput"
                                            {...{onChange: (val: string) => customHandler.onInputChange(val, 'end')}}
                                            displayFormat={displayFormat.value}
                                            onFocus={handler.customInputFocus}
                                            onBlur={handler.customInputBlur}
                                        />
                                    </>
                            )}

                        </div>
                    </PlInput>
                )
            }
        }
    },
})