import {ExtractPropTypes} from "@vue/composition-api/dist/component/componentProps";
import {EmitFunc, useEvent} from "@/use/useEvent";
import {computed, inject, provide, reactive, Ref} from "@vue/composition-api";
import {PlainDate} from "@/util/PlainDate";
import {useModel} from "@/use/useModel";
import {getReturnType} from "@/util/util";
import {DATE_PANEL_PROVIDER, DatePublicProps, DateView, PanelItemParam, SlideTransitionDirection} from "@/packages/date/date-utils";

class PanelItemParamType {
}

export function useDate(
    {
        props,
        getProvideData,
        injectView,
        getChildDisabled,
        getChildActive,
        getChildHoverStart,
        getChildHover,
        getChildHoverEnd,
    }
        : {
        props: ExtractPropTypes<typeof DatePublicProps>,
        getProvideData: (panelItemParam: PanelItemParam) => {
            year: PanelItemParamType,
            month?: PanelItemParamType,
            date?: PanelItemParamType,
        },
        injectView: DateView,
        getChildDisabled?: (ipd: PlainDate, view: DateView) => boolean,
        getChildActive?: (ipd: PlainDate, view: DateView) => boolean,
        getChildHoverStart?: (ipd: PlainDate, view: DateView) => boolean,
        getChildHover?: (ipd: PlainDate, view: DateView) => boolean,
        getChildHoverEnd?: (ipd: PlainDate, view: DateView) => boolean,
    }
) {

    /*---------------------------------------event-------------------------------------------*/

    const {emit} = useEvent({
        input: EmitFunc,
        updateStart: EmitFunc,
        updateEnd: EmitFunc,
        updateView: EmitFunc,
    })

    /*---------------------------------------:computer:format-------------------------------------------*/

    const displayFormat = computed(() => {
        if (!!props.displayFormat) return props.displayFormat
        return props.datetime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'
    })

    const valueFormat = computed(() => {
        if (!!props.valueFormat) return props.valueFormat
        return props.datetime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'
    })

    /*---------------------------------------state-------------------------------------------*/

    const today = PlainDate.today(displayFormat.value, valueFormat.value)
    const vpd = new PlainDate(props.value, displayFormat.value, valueFormat.value)
    const startPd = new PlainDate(props.start, displayFormat.value, valueFormat.value)
    const endPd = new PlainDate(props.end, displayFormat.value, valueFormat.value)
    const tempPd = vpd.copy()

    const value = useModel(() => props.value, emit.input)
    const start = useModel(() => props.start, emit.updateStart)
    const end = useModel(() => props.end, emit.updateEnd)
    const view = useModel(() => props.view, emit.updateView)

    let selectDate = props.selectDate as (PlainDate | undefined)
    if (!selectDate) {
        if (!props.range) {
            selectDate = !vpd.isNull ? vpd : today.copy()
        } else {
            selectDate = !startPd.isNull ? startPd : today.copy()
        }
    }

    const transitionDirection: SlideTransitionDirection = SlideTransitionDirection.next

    const hoverRange: [PlainDate, PlainDate] | null = null
    const valueRange: [PlainDate, PlainDate] = [startPd, endPd]

    const state = reactive({
        today,
        selectDate,
        tempPd,

        hoverRange,
        valueRange,
        transitionDirection,
    })

    /*---------------------------------------inject-------------------------------------------*/

    const datePanel = inject(DATE_PANEL_PROVIDER) as (typeof ret | null)

    /*---------------------------------------computer-------------------------------------------*/

    const firstDatePanel = computed(() => {
        let parent = datePanel
        while (!!parent && parent.datePanel) {
            parent = parent.datePanel
        }
        return parent
    }) as Ref<typeof ret | null>

    const panelItemParam = computed(() => {

        let {value, max, min, range} = props

        return {
            max: new PlainDate(max, displayFormat.value, valueFormat.value),
            min: new PlainDate(min, displayFormat.value, valueFormat.value),
            value: new PlainDate(value, displayFormat.value, valueFormat.value),
            hoverRange: state.hoverRange,
            valueRange: state.valueRange,
            range,
        } as PanelItemParam
    })

    const provideData = computed(() => getProvideData(panelItemParam.value))

    const targetPanelItemParam = computed(() => {
        if (!!firstDatePanel.value && firstDatePanel.value!.provideData.value && firstDatePanel.value!.provideData.value[injectView]) {
            return firstDatePanel.value!.provideData.value[injectView]
        } else {
            return panelItemParam.value
        }
    }) as Ref<PanelItemParam>

    function setSelectDate(selectDate: PlainDate) {
        state.selectDate = selectDate.copy()
    }

    const ret = {
        displayFormat,
        valueFormat,

        value,
        start,
        end,
        view,

        state,

        datePanel,
        firstDatePanel,

        provideData,
        panelItemParam,
        targetPanelItemParam,

        setSelectDate,
        emit,
        props,

        getChildDisabled,
        getChildActive,
        getChildHoverStart,
        getChildHover,
        getChildHoverEnd,
    }

    provide(DATE_PANEL_PROVIDER, ret)

    return ret
}

const useDateValue = getReturnType(useDate)

export type UseDateType = typeof useDateValue