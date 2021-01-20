import {designComponent} from "../../use/designComponent";
import './date.scss'
import {DateEmitRangeType, DatePanel, DatePublicEmits, DatePublicProps, getDefaultDateFormatter} from "./date.utils";
import {EditProps} from "../../use/useEdit";
import {StyleProps} from "../../use/useStyle";
import {useModel} from "../../use/useModel";
import {delay} from "plain-utils/utils/delay";
import {useEditPopperAgent} from "../popper/edit/useEditPopperAgent";
import {DateServiceGetter} from "./date.service";
import {useDateTime} from "../date-time-input/useDateTime";
import {computed, PropType} from 'vue';
import {PDate, plainDate} from "./plainDate";
import {PlInput} from "../input/input";
import {PlInputInnerTags} from "../input/input-inner-tags";
import {PlIcon} from "../icon/icon";
import {PlDateTimeInput} from "../date-time-input/date-time-input";

export const PlDate = designComponent({
    name: 'pl-date',
    props: {
        ...StyleProps,
        ...EditProps,
        ...DatePublicProps,
        panel: {type: String as PropType<DatePanel>, default: DatePanel.date},
        collapseTags: {type: Boolean, default: true},
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
                if (!props.range || props.multiple) {
                    model.value = val
                } else {
                    if (type === 'start') {
                        startModel.value = val
                    } else {
                        endModel.value = val
                        if (props.panel !== DatePanel.date || !props.datetime) {
                            agentState.methods.hide()
                        }
                    }
                }
            },
            onMousedown: async (e: MouseEvent, type: DateEmitRangeType) => {
                agentState.state.focusCounter++
                await delay(0)
                if (props.multiple) {
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
                    ...format.value,
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

        const format = computed(() => {
            const {displayFormat, valueFormat} = getDefaultDateFormatter(props.panel, props.datetime)
            return {
                displayFormat: props.displayFormat || displayFormat,
                valueFormat: props.valueFormat || valueFormat,
            }
        })

        const today = plainDate.today(format.value.displayFormat, format.value.valueFormat)

        const formatData = computed(() => {
            let vpd: PDate | null = null;
            let vpds: PDate[] | null = null;
            let spd: PDate | null = null;
            let epd: PDate | null = null;
            if (props.multiple) {
                let value = model.value as string[] | undefined
                if (!!value) {
                    vpds = value.map(item => plainDate(item, format.value))
                }
            } else {
                if (!props.range) {
                    const value = model.value as string | undefined
                    if (!!value) vpd = plainDate(value, format.value)
                } else {
                    if (!!startModel.value) spd = plainDate(startModel.value, format.value)
                    if (!!endModel.value) epd = plainDate(endModel.value, format.value)
                }
            }
            return {vpd, vpds, spd, epd}
        })

        const maxmin = computed(() => {
            return {
                max: !props.max ? null : plainDate(props.max, format.value),
                min: !props.min ? null : plainDate(props.min, format.value),
            }
        })

        const inputAttrs = computed(() => {
            const isDates = props.multiple
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

        /*---------------------------------------custom handler-------------------------------------------*/

        const customHandler = {
            onInputChange(val: string | undefined, type: 'value' | 'start' | 'end') {
                const {spd, epd} = formatData.value
                let jdView = props.datetime ? 'YMDHms' as 'YMDHms' : 'YMD' as 'YMD'
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
            onClickItemCloseIcon(index: number, e: MouseEvent) {
                e.stopPropagation()
                e.preventDefault()
                if (!agentState.editComputed.value.editable) {
                    return
                }
                const value = model.value as string[]
                value.splice(index, 1)
                model.value = [...value]
            },
        }

        return {
            render: () => {
                return (
                    <PlInput ref="plInput"{...inputAttrs.value as any}>
                        <div {...{class: 'pl-input-custom-inner', range: props.range}}>
                            {props.multiple && (<PlInputInnerTags
                                data={formatData.value.vpds || []}
                                collapseTags={props.collapseTags}
                                v-slots={{
                                    default: ({item, index}: { item: PDate, index: number }) => (<>
                                        <span>{item.getDisplay()}</span>
                                        <PlIcon icon="el-icon-close" {...{onClick: (e: MouseEvent) => customHandler.onClickItemCloseIcon(index, e)}}/>
                                    </>)
                                }}
                            />)}

                            {!props.multiple && (
                                !props.range ? (<PlDateTimeInput
                                        modelValue={formatData.value.vpd ? formatData.value.vpd.getDisplay() : undefined}
                                        ref="valueInput"
                                        {...{onChange: (val: string) => customHandler.onInputChange(val, 'value')}}
                                        displayFormat={format.value.displayFormat}
                                        onFocus={handler.customInputFocus}
                                        onBlur={handler.customInputBlur}
                                    />) :
                                    <>
                                        <PlDateTimeInput
                                            width="100"
                                            modelValue={formatData.value.spd ? formatData.value.spd.getDisplay() : undefined}
                                            ref="startInput"
                                            displayFormat={format.value.displayFormat}
                                            {...{onChange: (val: string) => customHandler.onInputChange(val, 'start')}}
                                            onFocus={handler.customInputFocus}
                                            onBlur={handler.customInputBlur}
                                        />
                                        <span>~</span>
                                        <PlDateTimeInput
                                            width="100"
                                            modelValue={formatData.value.epd ? formatData.value.epd.getDisplay() : undefined}
                                            ref="endInput"
                                            {...{onChange: (val: string) => customHandler.onInputChange(val, 'end')}}
                                            displayFormat={format.value.displayFormat}
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