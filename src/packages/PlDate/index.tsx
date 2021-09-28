import './date.scss'
import {computed, designComponent, PropType, useModel} from "plain-design-composition";
import {StyleProps} from "../../use/useStyle";
import {EditProps} from "../../use/useEdit";
import {DateCommonUtils, DateEmitRangeType, DatePanel, DatePublicEmits, DatePublicProps, getDefaultDateFormatter} from "./date.utils";
import {PDate, plainDate} from "../../utils/plainDate";
import {delay} from "plain-utils/utils/delay";
import {useEditPopperAgent} from "../useEditPopperAgent/useEditPopperAgent";
import {useDate} from "./useDate";
import {useDateTime} from "../PlDateTimeInput/useDateTime";
import {PlDateTimeInput} from "../PlDateTimeInput";
import {PlInputInnerTags} from "../PlInput/PlInputInnertags";
import PlIcon from "../PlIcon";
import {PlInput} from "../PlInput";
import {unit} from "plain-utils/string/unit";
import PlPopper from "../PlPopper";
import {classnames} from "plain-utils/dom/classnames";

export const PlDate = designComponent({
    name: 'pl-date',
    props: {
        ...StyleProps,
        ...EditProps,
        ...DatePublicProps,
        panel: {type: String as PropType<keyof typeof DatePanel>, default: DatePanel.date},
        collapseTags: {type: Boolean, default: true},
        popperAttrs: {type: Object as PropType<Partial<typeof PlPopper.use.props>>},
        inputAttrs: {type: Object as PropType<Partial<typeof PlInput.use.props>>},
        maxTags: {type: Number},
    },
    emits: {
        ...DatePublicEmits,
        onBlur: (e: FocusEvent) => true,
        onFocus: (e: FocusEvent) => true,
    },
    expose: {
        plainDate,
        ...DateCommonUtils,
    },
    slots: ['foot'],
    setup({props, slots, event: {emit}, attrs}) {

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
            serviceGetter: useDate,
            option: {
                reference: () => refs.plInput?.refs.input,
                popperAttrs: props.popperAttrs as any,
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
                    foot: slots.foot.isExist() ? slots.foot : undefined,
                })
            },
        })

        const {
            refs,
            onRef,
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
                class: classnames([
                    'pl-date',
                    {
                        'pl-input-custom': !isDates,
                        'pl-input-tags': isDates,
                    },
                ]),
                modelValue: Array.isArray(inputValue.value) ? inputValue.value.join('') : inputValue.value,
                suffixIcon: 'el-icon-date',
                clearIcon: true,
                isFocus: agentState.state.focusCounter > 0,
                width: attrs.width != null ? unit(attrs.width) : (isDates ? undefined : null),
                inputInnerTabindex: isDates ? 0 : null,
                clearHandler: handler.clearHandler,

                ...agentState.inputHandler,
                onClickInput: handler.clickInput,
                ...props.inputAttrs,
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
                    <PlInput ref={onRef.plInput} {...inputAttrs.value as any}>
                        <div {...{class: 'pl-input-custom-inner', range: String(props.range)}}>
                            {props.multiple && (<PlInputInnerTags
                                data={formatData.value.vpds || []}
                                maxTags={props.maxTags}
                                collapseTags={props.collapseTags} v-slots={{
                                default: ({item, index}: { item: PDate, index: number }) => (<>
                                    <span>{item.getDisplay()}</span>
                                    <PlIcon icon="el-icon-close" {...{onClick: (e: any) => customHandler.onClickItemCloseIcon(index, e)}}/>
                                </>)
                            }}
                            />)}

                            {!props.multiple && (
                                !props.range ? (<PlDateTimeInput
                                        modelValue={formatData.value.vpd ? formatData.value.vpd.getDisplay() : undefined}
                                        ref={onRef.valueInput}
                                        onChange={(val ?: string) => customHandler.onInputChange(val, 'value')}
                                        displayFormat={format.value.displayFormat}
                                        onFocus={handler.customInputFocus}
                                        onBlur={handler.customInputBlur}
                                    />) :
                                    <>
                                        <PlDateTimeInput
                                            width="100"
                                            modelValue={formatData.value.spd ? formatData.value.spd.getDisplay() : undefined}
                                            ref={onRef.startInput}
                                            displayFormat={format.value.displayFormat}
                                            onChange={(val?: string) => customHandler.onInputChange(val, 'start')}
                                            onFocus={handler.customInputFocus}
                                            onBlur={handler.customInputBlur}
                                        />
                                        <span>~</span>
                                        <PlDateTimeInput
                                            width="100"
                                            modelValue={formatData.value.epd ? formatData.value.epd.getDisplay() : undefined}
                                            ref={onRef.endInput}
                                            onChange={(val?: string) => customHandler.onInputChange(val, 'end')}
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

export default PlDate
