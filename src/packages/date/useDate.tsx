import {computed, inject, provide, reactive, watch} from 'vue';
import {DateEmitRangeType, DateItemData, DatePublicPropsType, DateView, DefaultDateFormatString, SlideTransitionDirection} from "./date.utils";
import {PDate, plainDate} from "./plainDate";
import {useModel} from "../../use/useModel";
import {toArray} from "../../utils/toArray";

/**
 * 日期子组件注入父组件提供的值的时候的唯一标识
 * @author  韦胜健
 * @date    2020/12/7 20:43
 */
export const DATE_PANEL_PROVIDER = '@@DATE_PANEL_PROVIDER'

/**
 * 判断对比类型
 * @author  韦胜健
 * @date    2021/1/19 9:22
 */
export enum UseDateJudgementView {
    'Y' = 'Y',
    'YM' = 'YM',
    'YMD' = 'YMD',
}

type DateCustomStatus = {
    active: () => PDate[],
    start: () => PDate[],
    end: () => PDate[],
    hover: () => [PDate, PDate][],
}

/**
 * 顶层父面板向下提供的数据
 * @author  韦胜健
 * @date    2021/1/19 9:23
 */
type UseDateTopState = {
    max: PDate | null,
    min: PDate | null,
    vpd: PDate | PDate[] | null,
    range: {
        hover: null | [PDate, PDate],
        value: null | [PDate, PDate],
    },
    isRange: boolean,
    customStatus?: DateCustomStatus,
}

/**
 * useDate得到的数据对象
 * @author  韦胜健
 * @date    2021/1/19 9:23
 */
export type UseDateType = {
    parent: UseDateType | null,
    jdView: UseDateJudgementView,
    today: PDate,
    displayFormat: string,
    valueFormat: string,

    model: { value?: string | string[] },
    startModel: { value?: string },
    endModel: { value?: string },
    viewModel: { value: DateView },

    state: {
        pd: {
            vpd: null | PDate | PDate[],
            spd: null | PDate,
            epd: null | PDate,
        },
        selectDate: PDate,
        range: {
            hover: null | [PDate, PDate],
            value: null | [PDate, PDate],
        },
        slide: SlideTransitionDirection,
        topState: UseDateTopState,
    },

    setSelectDate: (pd: PDate) => void,
    getStatus: (pd: PDate) => {
        now: boolean,
        disabled: boolean,
        active: boolean,
        start: boolean,
        end: boolean,
        hover: boolean,
        range: boolean,
        clickable: boolean,
    },
    handler: {
        onClick: (did: DateItemData) => void,
        onMouseenter: (did: DateItemData) => void,
    },
}

export function useDate(
    {
        props,
        jdView,
        getSlide,
        processPd,
        emit,
        customStatus,
    }: {
        props: DatePublicPropsType,
        jdView: UseDateJudgementView,
        getSlide?: (pd: PDate) => SlideTransitionDirection,
        /*process 不能处理多选的情况*/
        processPd?: {
            value?: (vpd: PDate) => PDate,
            range?: (spd: PDate, vpd: PDate) => { spd: PDate, epd: PDate },
        },
        emit: {
            onUpdateModelValue: (val?: string | string[], rangeType?: DateEmitRangeType) => void,
            onUpdateStart: (val?: string) => void,
            onUpdateEnd: (val?: string) => void,
            onUpdateView: (val: DateView) => void,
        },
        customStatus?: DateCustomStatus,
    }): UseDateType {

    const defaultFormat = (() => {
        if (jdView === UseDateJudgementView.Y) return DefaultDateFormatString.year
        if (jdView === UseDateJudgementView.YM) return DefaultDateFormatString.month
        if (jdView === UseDateJudgementView.YMD) return props.datetime ? DefaultDateFormatString.datetime : DefaultDateFormatString.date
    })();
    const displayFormat = props.displayFormat || defaultFormat!
    const valueFormat = props.valueFormat || defaultFormat!
    const createPlainDate = (val: string) => plainDate(val, {displayFormat, valueFormat})

    /**
     * 顶层父面板
     * @author  韦胜健
     * @date    2020/12/7 20:48
     */
    const parent = inject<UseDateType | null>(DATE_PANEL_PROVIDER, null)

    const today = plainDate.today(displayFormat, valueFormat)
    const model = useModel(() => props.modelValue, emit.onUpdateModelValue, {
        onChange: (val) => {
            if (!!props.selectDate) {return}
            let pd: PDate;
            if (!props.multiple) {
                const value = val as string | undefined
                pd = !value ? today : today.useValue(value)
            } else {
                const value = val as string[] | undefined
                pd = !value || value.length === 0 ? today : today.useValue(value[0])
            }
            !!getSlide && (state.slide = getSlide(pd))
            useDateData.setSelectDate(pd)
        }
    })
    const startModel = (!props.range || !!parent) ? model as { value?: string } : useModel(() => props.start, emit.onUpdateStart, {
        onChange: (val) => {
            if (!!props.selectDate) {return}
            const spd = !val ? null : today.useValue(val)
            const epd = state.pd.epd
            state.range = {
                hover: null,
                value: !!spd && !!epd ? [spd, epd] : null
            }
            !!getSlide && (state.slide = getSlide(spd || today))
            useDateData.setSelectDate(spd || today)
        }
    })
    const endModel = (!props.range || !!parent) ? model as { value?: string } : useModel(() => props.end, emit.onUpdateEnd, {
        onChange: (val) => {
            const spd = state.pd.spd
            const epd = !val ? null : today.useValue(val)
            state.range = {
                hover: null,
                value: !!spd && !!epd ? [spd, epd] : null
            }
        },
    })
    const viewModel = useModel(() => props.view, emit.onUpdateView)

    const pd = computed(() => {
        let vpd: null | PDate | PDate[];
        if (!props.multiple) {
            vpd = !model.value ? null : createPlainDate(model.value as string)
        } else {
            vpd = !model.value ? null : (model.value as string[]).map(item => createPlainDate(item))
        }
        return {
            vpd,
            spd: (!props.range || !!parent) ? null : (!startModel.value ? null : createPlainDate(startModel.value)),
            epd: (!props.range || !!parent) ? null : (!endModel.value ? null : createPlainDate(endModel.value)),
        }
    })

    const state = reactive({
        pd,
        selectDate: (() => {
            let selectDate = props.selectDate
            if (!selectDate) {
                const {vpd, spd} = pd.value
                if (!props.range) {
                    if (!props.multiple) {
                        const pd = vpd as PDate | null
                        selectDate = pd || today
                    } else {
                        const pd = vpd as PDate[] | null
                        selectDate = (!!pd && pd.length > 0) ? pd[0] : today
                    }
                } else {
                    selectDate = spd || today
                }
            }
            if (!!props.selectDate) {
                watch(() => props.selectDate, pd => {
                    if (!pd) {return}// 肯定会有值
                    !!getSlide && (state.slide = getSlide(pd!))
                    useDateData.setSelectDate(pd!)
                })
            }
            return selectDate
        })(),
        range: (() => {
            const {spd, epd} = pd.value
            return {
                hover: null as null | [PDate, PDate],
                value: (!!spd && !!epd) ? [spd, epd] as [PDate, PDate] : null,
            }
        })(),
        slide: SlideTransitionDirection.next,
        topState: computed((): UseDateTopState => {
            if (!!parent) {
                return parent.state.topState
            }
            const {vpd} = pd.value
            return {
                max: !props.max ? null : createPlainDate(props.max),
                min: !props.min ? null : createPlainDate(props.min),
                vpd,
                range: state.range,
                isRange: props.range,
                customStatus,
            }
        }),
    })

    const handler = {
        onClick: (did: DateItemData) => {
            if (!parent) {
                /*
                *  没有父面板，表明当前面板为顶层面板
                */
                if (props.multiple) {
                    const display = did.pd.getDisplay()
                    /*
                    *  多选
                    */
                    let value = model.value as string[] | undefined
                    if (!value || value.length === 0) {
                        value = [display]
                    } else {
                        const existIndex = value.findIndex((item) => item === display)
                        if (existIndex > -1) {
                            value.splice(existIndex, 1)
                        } else {
                            value.unshift(display)
                        }
                    }
                    model.value = [...value]
                } else {
                    /*
                    *  非多选
                    */
                    if (!props.range) {
                        /*
                        *  单选
                        */
                        let {pd} = did
                        if (!!processPd && !!processPd.value) pd = processPd.value(pd)
                        model.value = pd.getDisplay()
                    } else {
                        /*
                        *  范围选择
                        */
                        if (!state.range.hover) {
                            const {pd} = did
                            state.range = {
                                hover: [pd, pd],
                                value: [pd, pd],
                            }
                        } else {
                            let [spd, epd] = state.range.hover
                            if (!!processPd && !!processPd.range) {
                                const data = processPd.range(spd, epd)
                                spd = data.spd
                                epd = data.epd
                            }
                            startModel.value = spd.getDisplay()
                            endModel.value = epd.getDisplay()
                            state.range = {
                                hover: null,
                                value: [spd, epd],
                            }
                            emit.onUpdateModelValue(startModel.value, DateEmitRangeType.start)
                            emit.onUpdateModelValue(endModel.value, DateEmitRangeType.end)
                        }
                    }
                }
            } else {
                let {pd} = did
                if (!!processPd && !!processPd.value) pd = processPd.value(pd)
                model.value = pd.getDisplay()
            }
        },
        onMouseenter: (did: DateItemData) => {
            if (!!parent) {
                return
            }
            if (!!state.range.hover) {
                const {pd} = did
                const mid = state.range.value![0]!
                state.range.hover = mid[jdView] > pd[jdView] ? [pd, mid] : [mid, pd]
            }
        },
    }

    const utils = {
        active: (pd: PDate): boolean => {
            const {isRange, vpd, range} = state.topState
            let condition: PDate[] = []
            if (!!state.topState.customStatus && state.topState.customStatus.active) {
                condition = state.topState.customStatus.active()
            } else {
                if (!isRange) {
                    if (!!vpd) {condition = toArray(vpd)}
                } else {
                    if (!!range.value) {condition = [range.value[0], range.value[1]]}
                }
            }
            return !!condition.find(item => item[jdView] === pd[jdView])
        },
        disabled: (pd: PDate): boolean => {
            const {max, min} = state.topState
            if (!!max && max[jdView] < pd[jdView]) return true
            if (!!min && min[jdView] > pd[jdView]) return true
            return false
        },
        start: (pd: PDate) => {
            const {isRange, range: {hover, value}} = state.topState
            let condition: PDate[] = []
            if (!!state.topState.customStatus && !!state.topState.customStatus.start) {
                condition = state.topState.customStatus.start()
            } else {
                if (!!isRange) {
                    if (!!hover) condition.push(hover[0])
                    else if (!!value) condition.push(value[0])
                }
            }
            return condition.some(item => item[jdView] === pd[jdView])
        },
        end: (pd: PDate) => {
            const {isRange, range: {hover, value}} = state.topState
            let condition: PDate[] = []
            if (!!state.topState.customStatus && !!state.topState.customStatus.end) {
                condition = state.topState.customStatus.end()
            } else {
                if (!!isRange) {
                    if (!!hover) condition.push(hover[1])
                    else if (!!value) condition.push(value[1])
                }
            }
            return condition.some(item => item[jdView] === pd[jdView])
        },
        hover: (pd: PDate) => {
            const {isRange, range: {hover, value}} = state.topState
            let condition: [PDate, PDate][] = []
            if (!!state.topState.customStatus && !!state.topState.customStatus.hover) {
                condition = state.topState.customStatus.hover()
            } else {
                if (!!isRange) {
                    if (!!hover || !!value) {
                        condition.push((hover || value)!)
                    }
                }
            }
            return condition.some(([spd, epd]) => (spd[jdView] < pd[jdView] && epd[jdView] > pd[jdView]))
        },
    }

    const useDateData: UseDateType = {
        parent,
        jdView,
        state,
        today,
        displayFormat,
        valueFormat,

        model,
        startModel,
        endModel,
        viewModel,

        setSelectDate: (pd) => state.selectDate = pd || today,
        getStatus: (pd) => {
            const disabled = utils.disabled(pd)
            return {
                now: today[jdView] === pd[jdView],
                active: utils.active(pd),
                disabled,
                start: utils.start(pd),
                hover: utils.hover(pd),
                end: utils.end(pd),
                range: !!state.topState.range,
                clickable: (!!parent && parent.jdView !== jdView) || !disabled
            }
        },
        handler,
    }

    /*只有最顶层日期组件才有资格控制子组件*/
    if (!parent) {
        provide(DATE_PANEL_PROVIDER, useDateData)
    }

    return useDateData
}