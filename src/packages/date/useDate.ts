
import {EmitFunc, useEvent} from "@/use/useEvent";
import {computed, inject, provide, reactive, Ref} from "@vue/composition-api";
import {PlainDate} from "@/util/PlainDate";
import {useModel} from "@/use/useModel";
import {DATE_PANEL_PROVIDER, DatePublicProps, DateView, PanelItemParam, PanelItemParamType, SlideTransitionDirection} from "@/packages/date/date-utils";

export function getFormatString(formatString: string | undefined, datetime: boolean | undefined) {
    if (!!formatString) return formatString
    return datetime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'
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

        modelAutoEmit,
        startModelAutoEmit,
        endModelAutoEmit,

        onModelChange,
        onStartChange,
        onEndChange,
    }
        : {
        props: ExtractPropTypes<typeof DatePublicProps>,
        getProvideData: (panelItemParam: PanelItemParam) => {
            year: PanelItemParamType,
            month?: PanelItemParamType,
            date?: PanelItemParamType,
        },
        injectView: DateView,
        getChildDisabled?: (ipd: PlainDate | number, view: DateView) => boolean,
        getChildActive?: (ipd: PlainDate, view: DateView) => boolean,
        getChildHoverStart?: (ipd: PlainDate, view: DateView) => boolean,
        getChildHover?: (ipd: PlainDate, view: DateView) => boolean,
        getChildHoverEnd?: (ipd: PlainDate, view: DateView) => boolean,

        modelAutoEmit?: boolean
        onModelChange?: (val: string | undefined) => void,

        startModelAutoEmit?: boolean
        onStartChange?: (val: string | undefined) => void,

        endModelAutoEmit?: boolean
        onEndChange?: (val: string | undefined) => void,
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

    const displayFormat = computed(() => getFormatString(props.displayFormat, props.datetime))

    const valueFormat = computed(() => getFormatString(props.valueFormat, props.datetime))

    /*---------------------------------------state-------------------------------------------*/

    const today = PlainDate.today(displayFormat.value, valueFormat.value)
    const vpd = new PlainDate(props.value, displayFormat.value, valueFormat.value)
    const startPd = new PlainDate(props.start, displayFormat.value, valueFormat.value)
    const endPd = new PlainDate(props.end, displayFormat.value, valueFormat.value)
    const tempPd = vpd.copy()

    const model = useModel(() => props.value, emit.input, modelAutoEmit, undefined, onModelChange)
    const startModel = useModel(() => props.start, emit.updateStart, startModelAutoEmit, undefined, onStartChange)
    const endModel = useModel(() => props.end, emit.updateEnd, endModelAutoEmit, undefined, onEndChange)
    const viewModel = useModel(() => props.view, emit.updateView)

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
        let {max, min, range} = props
        return {
            max: new PlainDate(max, displayFormat.value, valueFormat.value),
            min: new PlainDate(min, displayFormat.value, valueFormat.value),
            value: new PlainDate(model.value, displayFormat.value, valueFormat.value),
            hoverRange: state.hoverRange,
            valueRange: state.valueRange,
            range,
        }
    }) as Ref<PanelItemParam>

    const provideData = computed(() => getProvideData(panelItemParam.value))

    const targetPanelItemParam = computed(() => {
        if (!!firstDatePanel.value && firstDatePanel.value!.provideData.value && firstDatePanel.value!.provideData.value[injectView]) {
            return firstDatePanel.value!.provideData.value[injectView]
        } else {
            return panelItemParam.value
        }
    }) as Ref<PanelItemParamType>

    function setSelectDate(selectDate: PlainDate) {
        state.selectDate = selectDate.copy()
    }

    const ret = {
        displayFormat,
        valueFormat,

        model,
        startModel,
        endModel,
        viewModel,

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

export type UseDateType = ReturnType<typeof useDate>