import {DatePublicPropsType, DateView, SlideTransitionDirection} from "./date.utils";
import {computed, inject, provide, reactive} from 'vue';
import {PlainDate, PlainDateType} from "../../utils/PlainDate";
import {useModel, UseModelConfig} from "../../use/useModel";

/**
 * 日期子组件注入父组件提供的值的时候的唯一标识
 * @author  韦胜健
 * @date    2020/12/7 20:43
 */
export const DATE_PANEL_PROVIDER = '@@DATE_PANEL_PROVIDER'

/**
 * 获取默认的格式化字符串
 * @author  韦胜健
 * @date    2020/12/7 20:42
 */
export function getFormatString(formatString: string | undefined, datetime: boolean | undefined) {
    if (!!formatString) return formatString
    return datetime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'
}

export enum UseDateJudgementView {
    'Y' = 'Y',
    'YM' = 'YM',
    'YMD' = 'YMD',
}

type UseDateJudgement = {
    active?: (ipd: PlainDateType, view: UseDateJudgementView) => boolean,
    disabled?: (ipd: PlainDateType, view: UseDateJudgementView) => boolean,
    hoverStart?: (ipd: PlainDateType, view: UseDateJudgementView) => boolean,
    hover?: (ipd: PlainDateType, view: UseDateJudgementView) => boolean,
    hoverEnd?: (ipd: PlainDateType, view: UseDateJudgementView) => boolean,
}

type UseDateTopState = {
    max?: PlainDateType,
    min?: PlainDateType,
    vpd?: PlainDateType,
    hoverRange: [PlainDateType, PlainDateType] | null | undefined,
    valueRange: [PlainDateType, PlainDateType],
    range?: boolean,
}

export type UseDateType = {
    /*当前组件的直接父组件*/
    parent: UseDateType | null,
    /*当前组件接收的props属性对象*/
    props: DatePublicPropsType,
    /*当前组件自己的judgement(提供给后代使用的judgement)*/
    judgementForChild?: UseDateJudgement,
    /*当前组件的显示值格式化字符串*/
    displayFormat: string,
    /*当前组件的值格式化字符串*/
    valueFormat: string,

    /*---------------------------------------state-------------------------------------------*/

    today: PlainDateType,
    tempPd: PlainDateType,

    model: { value?: string },
    startModel: { value?: string },
    endModel: { value?: string },
    viewModel: { value: DateView },

    state: {
        hoverRange: [PlainDateType, PlainDateType] | null,
        valueRange: [PlainDateType, PlainDateType],
        selectDate: PlainDateType,
        slide: SlideTransitionDirection,
        topState: UseDateTopState,
    },

    setSelectDate: (pd: PlainDateType) => void,
    getStatus: (ipd: PlainDateType) => {
        now: boolean,
        disabled: boolean,
        active: boolean,
        hoverStart: boolean,
        hoverEnd: boolean,
        hover: boolean,
        range: boolean,
        clickable: boolean,
    },
    jdView: UseDateJudgementView,
}

export function useDate(
    {
        props,
        judgementForChild,
        emit,
        useModelConfig,
        jdView,
    }: {
        props: DatePublicPropsType,
        judgementForChild?: UseDateJudgement,
        emit: {
            updateModelValue: (val?: string) => void,
            updateStart: (val?: string) => void,
            updateEnd: (val?: string) => void,
            updateView: (val: DateView) => void,
        },
        useModelConfig?: {
            model?: UseModelConfig,
            start?: UseModelConfig,
            end?: UseModelConfig,
        },
        jdView: UseDateJudgementView,
    }
): UseDateType {

    /**
     * 邻近父组件
     * @author  韦胜健
     * @date    2020/12/7 20:48
     */
    const parent = inject<UseDateType | null>(DATE_PANEL_PROVIDER, null)

    /*---------------------------------------state-------------------------------------------*/

    const displayFormat = getFormatString(props.displayFormat, props.datetime)
    const valueFormat = getFormatString(props.valueFormat, props.datetime)

    const topState = computed((): UseDateTopState => {
        if (!!parent) {
            return parent.state.topState
        }
        return {
            max: !props.max ? undefined : new PlainDate(props.max, displayFormat, valueFormat),
            min: !props.min ? undefined : new PlainDate(props.min, displayFormat, valueFormat),
            vpd: !model.value && model.value != '0' ? undefined : new PlainDate(model.value, displayFormat, valueFormat),
            hoverRange: state.hoverRange,
            valueRange: state.valueRange,
            range: props.range,
        }
    })

    const today = !!parent ? parent.today : PlainDate.today(displayFormat, valueFormat)
    const vpd = new PlainDate(props.modelValue, displayFormat, valueFormat)
    const startPd = !!parent || !props.range ? today : new PlainDate(props.start, displayFormat, valueFormat)
    const endPd = !!parent || !props.range ? today : new PlainDate(props.end, displayFormat, valueFormat)
    const tempPd = vpd.copy()

    const hoverRange: [PlainDateType, PlainDateType] | null = null
    const valueRange: [PlainDateType, PlainDateType] = [startPd, endPd]

    useModelConfig = useModelConfig || {}
    const model = useModel(() => props.modelValue, emit.updateModelValue, useModelConfig.model)
    const startModel = !!parent || !props.range ? model : useModel(() => props.start, emit.updateStart, useModelConfig.start)
    const endModel = !!parent || !props.range ? model : useModel(() => props.end, emit.updateEnd, useModelConfig.end)
    const viewModel = useModel(() => props.view as DateView, emit.updateView)

    let selectDate = props.selectDate as (PlainDateType | undefined)
    if (!selectDate) {
        if (!props.range) {
            selectDate = !vpd.isNull ? vpd : today.copy()
        } else {
            selectDate = !startPd.isNull ? startPd : today.copy()
        }
    }

    /*响应式属性*/
    const state = reactive({
        selectDate,
        hoverRange,
        valueRange,
        slide: SlideTransitionDirection.next,
        topState,
    })

    const utils = {
        active: (ipd: PlainDateType) => {
            if (!!parent && !!parent.judgementForChild && !!parent.judgementForChild.active) {
                return parent.judgementForChild.active(ipd, jdView)
            }
            const {range, vpd, valueRange: [startPd, endPd]} = topState.value;
            return !!(
                (range ? [startPd, endPd] : [vpd])
                    .filter(i => !!i && !i.isNull)
                    .find(i => i![jdView] == ipd[jdView])
            )
        },
        disabled: (ipd: PlainDateType) => {
            if (!!parent && !!parent.judgementForChild && !!parent.judgementForChild.disabled) {
                return parent.judgementForChild.disabled(ipd, jdView)
            }
            const {max, min} = topState.value
            const val = ipd[jdView]!
            if (!!max && max[jdView]! < val) return true
            if (!!min && min[jdView]! > val) return true
            return false
        },
        hoverStart: (ipd: PlainDateType) => {
            if (!!parent && !!parent.judgementForChild && !!parent.judgementForChild.hoverStart) {
                return parent.judgementForChild.hoverStart(ipd, jdView)
            }
            if (!topState.value.range) {
                return false
            }
            const {hoverRange, valueRange} = topState.value
            const val = ipd[jdView]!
            return !!hoverRange ? (hoverRange[0][jdView] == val) : valueRange[0][jdView] == val
        },
        hover: (ipd: PlainDateType) => {
            if (!!parent && !!parent.judgementForChild && !!parent.judgementForChild.hover) {
                return parent.judgementForChild.hover(ipd, jdView)
            }
            if (!topState.value.range) {
                return false
            }
            const {hoverRange, valueRange} = topState.value
            const val = ipd[jdView]!
            return !!hoverRange ?
                (hoverRange[0][jdView]! < val && hoverRange[1][jdView]! > val) :
                ((!valueRange[0].isNull && !valueRange[1].isNull) &&
                    valueRange[0][jdView]! < val &&
                    valueRange[1][jdView]! > val)
        },
        hoverEnd: (ipd: PlainDateType) => {
            if (!!parent && !!parent.judgementForChild && !!parent.judgementForChild.hoverEnd) {
                return parent.judgementForChild.hoverEnd(ipd, jdView)
            }
            if (!topState.value.range) {
                return false
            }
            const {hoverRange, valueRange} = topState.value
            const val = ipd[jdView]!
            return !!hoverRange ? (hoverRange[1][jdView] == val) : valueRange[1][jdView] == val
        },
    }

    /*---------------------------------------provide-------------------------------------------*/

    const provideData: UseDateType = {
        props,
        parent,
        judgementForChild,
        displayFormat,
        valueFormat,

        today,
        tempPd,

        model,
        startModel,
        endModel,
        viewModel,

        state,

        setSelectDate: (pd) => state.selectDate = pd.isNull ? today.copy() : pd.copy(),
        getStatus: (ipd) => {
            const disabled = utils.disabled(ipd)
            return {
                now: today[jdView] === ipd[jdView],
                active: utils.active(ipd),
                disabled,
                hoverStart: utils.hoverStart(ipd),
                hover: utils.hover(ipd),
                hoverEnd: utils.hoverEnd(ipd),
                range: !!state.topState.range,
                clickable: (!!parent && parent.jdView !== jdView) || !disabled
            }
        },
        jdView,
    }

    /*只有最顶层日期组件才有资格控制子组件*/
    if (!parent) {
        provide(DATE_PANEL_PROVIDER, provideData)
    }

    return provideData

}