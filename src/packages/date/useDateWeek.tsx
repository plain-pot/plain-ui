import {PDate} from "./plainDate";
import {useDate, UseDateEmit, UseDateJudgementView} from "./useDate";
import {DateItemData, DatePublicPropsType} from "./date.utils";
import {toArray} from "../../utils/toArray";
import {reactive, computed} from 'vue';

export function useDateWeek(
    {
        props, emit,
        getDateData,
    }: {
        props: DatePublicPropsType,
        emit: UseDateEmit,
        getDateData: (pd: PDate) => [PDate, PDate],
    }) {

    const useDateData = useDate({
        props,
        emit,
        jdView: UseDateJudgementView.YMD,
        customStatus: {
            active: () => {
                let ret: PDate[] = []
                if (!props.range) {
                    if (!!dateData.value.value) {
                        dateData.value.value.forEach((item) => ret.push(...item))
                    }
                } else {
                    if (!!dateData.value.range.value) {
                        ret.push(...dateData.value.range.value.start)
                        ret.push(...dateData.value.range.value.end)
                    }
                }
                return ret
            },
            disabled: () => maxmin.value,
            start: () => {
                let ret: PDate[] = []
                if (!props.range) {
                    if (!!dateData.value.current) {
                        ret.push(dateData.value.current[0])
                    }
                    if (!!dateData.value.value) {
                        dateData.value.value.forEach(([spd]) => ret.push(spd))
                    }
                } else {
                    if (!!dateData.value.range.value) {
                        ret.push(dateData.value.range.value.start[0])
                        ret.push(dateData.value.range.value.end[0])
                    } else if (!!dateData.value.range.hover) {
                        ret.push(dateData.value.range.hover.start[0])
                        ret.push(dateData.value.range.hover.end[0])
                    }
                }
                return ret
            },
            end: () => {
                let ret: PDate[] = []
                if (!props.range) {
                    if (!!dateData.value.current) {
                        ret.push(dateData.value.current[1])
                    }
                    if (!!dateData.value.value) {
                        dateData.value.value.forEach(([, epd]) => ret.push(epd))
                    }
                } else {
                    if (!!dateData.value.range.value) {
                        ret.push(dateData.value.range.value.start[1])
                        ret.push(dateData.value.range.value.end[1])
                    } else if (!!dateData.value.range.hover) {
                        ret.push(dateData.value.range.hover.start[1])
                        ret.push(dateData.value.range.hover.end[1])
                    }
                }
                return ret
            },
            hover: () => {
                let ret: [PDate, PDate][] = []
                if (!props.range) {
                    if (!!dateData.value.current) {
                        ret.push(dateData.value.current)
                    }
                    if (!!dateData.value.value) {
                        dateData.value.value.forEach((item) => ret.push(item))
                    }
                } else {
                    if (!!dateData.value.range.value) {
                        ret.push([dateData.value.range.value.start[0], dateData.value.range.value.end[1]])
                    } else if (!!dateData.value.range.hover) {
                        ret.push([dateData.value.range.hover.start[0], dateData.value.range.hover.end[1]])
                    }
                }
                return ret
            },
        },
    })

    const {state, handler} = useDateData

    const externalState = reactive({
        current: null as null | DateItemData,
    })

    const maxmin = computed(() => {
        return {
            max: !state.topState.max ? null : getDateData(state.topState.max)[1],
            min: !state.topState.min ? null : getDateData(state.topState.min)[0],
        }
    })

    const dateData = computed(() => {
        return {
            value: !state.pd.vpd ? null : toArray(state.pd.vpd).map(item => getDateData(item)),
            range: {
                hover: !state.topState.range.hover ? null : {
                    start: getDateData(state.topState.range.hover[0]),
                    end: getDateData(state.topState.range.hover[1]),
                },
                value: !(!state.topState.range.hover && (!!state.pd.spd && !!state.pd.epd)) ? null : {
                    start: getDateData(state.pd.spd),
                    end: getDateData(state.pd.epd),
                },
            },
            current: !!externalState.current ? getDateData(externalState.current.pd) : null,
        }
    })

    const externalHandler = {
        onClick: (did: DateItemData) => {
            const [spd] = getDateData(did.pd)
            handler.onClick({...did, pd: spd})
        },
        onMouseenter: (did: DateItemData) => {
            if (!props.range) {
                externalState.current = did
            } else {
                handler.onMouseenter(did)
            }
        },
        onMouseleaveDateList: () => externalState.current = null,
    }

    return {
        useDateData,
        externalHandler,
    }
}