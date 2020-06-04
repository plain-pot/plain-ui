import {ExtractPropTypes} from "@vue/composition-api/dist/component/componentProps";
import {EmitFunc, useEvent} from "@/use/useEvent";
import {computed, inject, provide, reactive} from "@vue/composition-api";
import {PlainDate} from "@/util/PlainDate";
import {useModel} from "@/use/useModel";
import {getReturnType} from "@/util/util";
import {DATE_PANEL_PROVIDER, DatePublicProps, SlideTransitionDirection} from "@/packages/date/date-utils";

export function useDate(
    {
        props,
    }
        : {
        props: ExtractPropTypes<typeof DatePublicProps>,

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

    const datePanel = inject(DATE_PANEL_PROVIDER) as typeof ret

    /*---------------------------------------computer-------------------------------------------*/

    const firstDatePanel = computed(() => {
        let parent = datePanel
        while (!!parent && parent.datePanel) {
            parent = parent.datePanel
        }
        return parent
    })

    const panelItemParam = computed(() => {
        let {value, max, min, range} = props
        return {
            max: new PlainDate(max, displayFormat.value, valueFormat.value),
            min: new PlainDate(min, displayFormat.value, valueFormat.value),
            value: new PlainDate(value, displayFormat.value, valueFormat.value),
            hoverRange: state.hoverRange,
            valueRange: state.valueRange,
            range,
        }
    })

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
        panelItemParam,
        setSelectDate,
        emit,
    }

    provide(DATE_PANEL_PROVIDER, ret)

    return ret
}

const useDateValue = getReturnType(useDate)

export type UseDateType = typeof useDateValue