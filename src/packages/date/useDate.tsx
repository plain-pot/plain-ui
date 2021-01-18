import {computed, inject, reactive, provide} from 'vue';
import {DateEmitRangeType, DateItemData, DatePublicPropsType, DateView, SlideTransitionDirection} from "./date.utils";
import {PDate, plainDate} from "./plainDate";
import {useModel} from "../../use/useModel";

/**
 * 日期子组件注入父组件提供的值的时候的唯一标识
 * @author  韦胜健
 * @date    2020/12/7 20:43
 */
export const DATE_PANEL_PROVIDER = '@@DATE_PANEL_PROVIDER'

export enum UseDateJudgementView {
    'Y' = 'Y',
    'YM' = 'YM',
    'YMD' = 'YMD',
}

export type UseDateType = {
    parent: UseDateType | null,
    today: PDate,
    jdView: UseDateJudgementView,

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
    },

    setSelectDate: (pd: PDate) => void,
    getStatus: (pd?: PDate | null | undefined) => {
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
        emit,
        jdView,
    }: {
        props: DatePublicPropsType,
        emit: {
            onUpdateModelValue: (val?: string | string[], rangeType?: DateEmitRangeType) => void,
            onUpdateStart: (val?: string) => void,
            onUpdateEnd: (val?: string) => void,
            onUpdateView: (val: DateView) => void,
        },
        jdView: UseDateJudgementView,
    }): UseDateType {

    /**
     * 顶层父面板
     * @author  韦胜健
     * @date    2020/12/7 20:48
     */
    const parent = inject<UseDateType | null>(DATE_PANEL_PROVIDER, null)

    const innerUtils = {
        createPd: (val?: string) => plainDate(val, {displayFormat: props.displayFormat, valueFormat: props.valueFormat})
    }

    const today = !!parent ? parent.today : plainDate.today(props.displayFormat, props.valueFormat)

    const model = useModel(() => props.modelValue, emit.onUpdateModelValue)
    const startModel = (!props.range || !!parent) ? model as { value?: string } : useModel(() => props.start, emit.onUpdateStart)
    const endModel = (!props.range || !!parent) ? model as { value?: string } : useModel(() => props.end, emit.onUpdateEnd)
    const viewModel = useModel(() => props.view, emit.onUpdateView)

    const pd = computed(() => {
        let vpd: null | PDate | PDate[];
        if (!props.multiple) {
            vpd = !model.value ? null : innerUtils.createPd(model.value as string)
        } else {
            vpd = !model.value ? null : (model.value as string[]).map(item => innerUtils.createPd(item))
        }
        return {
            vpd,
            spd: (!props.range || !!parent) ? null : (!startModel.value ? null : innerUtils.createPd(startModel.value)),
            epd: (!props.range || !!parent) ? null : (!endModel.value ? null : innerUtils.createPd(endModel.value)),
        }
    })

    const state = reactive({
        pd,
        selectDate: (() => {
            let selectDate = props.selectDate
            if (!selectDate) {
                const {vpd, spd} = pd.value
                if (!props.range) {
                    if (props.multiple) {
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

    })

    const handler = {
        onClick: (did: DateItemData) => {
            const display = did.pd.getDisplay()
            if (!parent) {
                /*
                *  没有父面板，表明当前面板为顶层面板
                */
                if (props.multiple) {
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
                        model.value = display
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
                            const [spd, epd] = state.range.hover
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
                model.value = display
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
        active: (pd: PDate) => {/*todo*/},
        disabled: (pd: PDate) => {/*todo*/},
        start: (pd: PDate) => {/*todo*/},
        hover: (pd: PDate) => {/*todo*/},
        end: (pd: PDate) => {/*todo*/},
    }

    const useDateData: UseDateType = {
        parent,
        today,
        jdView,
        state,

        model,
        startModel,
        endModel,
        viewModel,

        setSelectDate: (pd) => state.selectDate = pd || today,
        getStatus: () => { return {} as any},
        handler,
    }

    /*只有最顶层日期组件才有资格控制子组件*/
    if (!parent) {
        provide(DATE_PANEL_PROVIDER, useDateData)
    }

    return useDateData
}