import {computed, designComponent, PropType, useModel} from 'plain-design-composition'
import './time.scss'
import {StyleProps} from "../../use/useStyle";
import {EditProps} from "../../use/useEdit";
import {TimePanelProps} from "./panel/PlTimePanel";
import {plainDate} from "../../utils/plainDate";
import {TimeRangePanelType} from "./panel/PlTimeRangePanel";
import {delay} from "plain-utils/utils/delay";
import {useEditPopperAgent} from '../useEditPopperAgent/useEditPopperAgent';
import {useTime} from "./useTime";
import {PlInput} from "../PlInput";
import {useDateTime} from "../PlDateTimeInput/useDateTime";
import {PlDateTimeInput} from "../PlDateTimeInput";
import {unit} from "plain-utils/string/unit";
import PlPopper from "../PlPopper";

export const PlTime = designComponent({
    name: 'pl-time',
    props: {
        ...StyleProps,
        ...EditProps,
        ...TimePanelProps,
        popperAttrs: {type: Object as PropType<Partial<typeof PlPopper.use.props>>},
    },
    emits: {
        onUpdateModelValue: (val?: string) => true,
        onUpdateStart: (val?: string) => true,
        onUpdateEnd: (val?: string) => true,
        onBlur: (e: FocusEvent) => true,
        onFocus: (e: FocusEvent) => true,
    },
    slots: ['foot'],
    expose: {plainDate},
    inheritPropsType: PlInput,
    setup({props, slots, event: {emit}, attrs}) {

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
            serviceGetter: useTime,
            option: {
                reference: () => refs.plInput?.refs.input,
                popperAttrs: props.popperAttrs as any,
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
            onRef,
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
                    ref={onRef.plInput}
                    class="pl-time pl-input-custom"
                    modelValue={inputValue.value}
                    placeholder={props.placeholder}
                    suffixIcon="el-icon-time"
                    clearIcon
                    isFocus={agentState.state.focusCounter > 0}
                    width={attrs.width != null ? unit(attrs.width) : null as any}
                    inputInnerTabindex={null as any}
                    clearHandler={handler.clearHandler}
                    onClickInput={handler.clickInput}
                    onKeydown={handler.keydown}>
                    <div class='pl-input-custom-inner' {...{range: String(props.range)}}>
                        {!props.range ? (
                            <PlDateTimeInput
                                ref={onRef.valueInput}
                                modelValue={!formatData.value.value ? undefined : formatData.value.value.getDisplay()}
                                displayFormat={props.displayFormat}
                                onChange={(val: string | undefined) => customHandler.change(val, 'value')}
                                onFocus={handler.customInputFocus}
                                onBlur={handler.customInputBlur}/>
                        ) : (
                            <>
                                <PlDateTimeInput
                                    ref={onRef.startInput}
                                    width="100"
                                    modelValue={!formatData.value.start ? undefined : formatData.value.start.getDisplay()}
                                    displayFormat={props.displayFormat}
                                    onChange={(val: string | undefined) => customHandler.change(val, 'start')}
                                    onFocus={handler.customInputFocus}
                                    onBlur={handler.customInputBlur}/>
                                <span>~</span>
                                <PlDateTimeInput
                                    ref={onRef.endInput}
                                    width="100"
                                    modelValue={!formatData.value.end ? undefined : formatData.value.end.getDisplay()}
                                    displayFormat={props.displayFormat}
                                    onChange={(val: string | undefined) => customHandler.change(val, 'end')}
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

export default PlTime
