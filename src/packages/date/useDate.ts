import {DatePublicPropsType, DateView, SlideTransitionDirection} from "./date.utils";
import {computed, inject, reactive, markRaw, provide} from 'vue';
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

type UseDateJudgement = {
    disabled?: (val: PlainDateType, view: DateView) => boolean,
    active?: (val: PlainDateType, view: DateView) => boolean,
    hoverStart?: (val: PlainDateType, view: DateView) => boolean,
    hover?: (val: PlainDateType, view: DateView) => boolean,
    hoverEnd: (val: PlainDateType, view: DateView) => boolean,
}

export type UseDateType = {
    /*当前组件的直接父组件*/
    parent?: UseDateType,
    /*当前组件接收的props属性对象*/
    props: DatePublicPropsType,
    /*当前组件自己的judgement*/
    judgement: UseDateJudgement,
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
    },
}

export function useDate(
    {
        props,
        judgement,
        emit,
        useModelConfig,
    }: {
        props: DatePublicPropsType,
        judgement: UseDateJudgement,
        emit: {
            updateModelValue: (val?: string) => void,
            updateStart: (val?: string) => void,
            updateEnd: (val?: string) => void,
            updateView: (val: DateView) => void,
        },
        useModelConfig: {
            model: UseModelConfig,
            start: UseModelConfig,
            end: UseModelConfig,
        },
    }
): UseDateType {

    /**
     * 邻近父组件
     * @author  韦胜健
     * @date    2020/12/7 20:48
     */
    const parent = inject<UseDateType>(DATE_PANEL_PROVIDER)

    /*---------------------------------------state-------------------------------------------*/

    const displayFormat = getFormatString(props.displayFormat, props.datetime)
    const valueFormat = getFormatString(props.valueFormat, props.datetime)

    const today = !!parent ? parent.today : PlainDate.today(displayFormat, valueFormat)
    const vpd = new PlainDate(props.modelValue, displayFormat, valueFormat)
    const startPd = !!parent || !props.range ? today : new PlainDate(props.start, displayFormat, valueFormat)
    const endPd = !!parent || !props.range ? today : new PlainDate(props.end, displayFormat, valueFormat)
    const tempPd = vpd.copy()

    const hoverRange: [PlainDateType, PlainDateType] | null = null
    const valueRange: [PlainDateType, PlainDateType] = [startPd, endPd]

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
    })

    /*---------------------------------------provide-------------------------------------------*/

    const provideData: UseDateType = {
        props,
        parent,
        judgement,
        displayFormat,
        valueFormat,

        today,
        tempPd,

        model,
        startModel,
        endModel,
        viewModel,

        state,
    }

    /*只有最顶层日期组件才有资格控制子组件*/
    if (!parent) {
        provide(DATE_PANEL_PROVIDER, provideData)
    }

    return provideData

}