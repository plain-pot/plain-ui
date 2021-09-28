import {computed, ExtractPropTypes, reactive, useNumber, useRefs} from "plain-design-composition";
import {PlcPropsOptions, PlcPublicAttrs} from "../utils/plc.utils";
import {tPlcScopeSlots, tPlcSlots} from "../utils/plc.scope-slots";
import {PlcCollector} from "./PlcGroup";
import {tPlc, tPlcEvent} from "../utils/plc.type";
import {getPropsState, usePropsState} from "../utils/usePropsState";
import PlTable from "../../index";

export function useBasePlc({props, scopeSlots, event, slots}: {
    props: ExtractPropTypes<typeof PlcPropsOptions>,
    slots: tPlcSlots,
    scopeSlots: tPlcScopeSlots,
    event: tPlcEvent,
}) {
    const table = PlTable.use.inject()
    const {refs, onRef} = useRefs({el: HTMLElement})

    /*collector收集列信息*/
    PlcCollector.child({sort: () => refs.el!})
    /*格式化props*/
    const {numberState} = useNumber(props, ['order', 'width'])

    const {propsState, state} = usePropsState(computed(() => ({
        ...props,
        ...numberState,
    }) as Omit<typeof props, 'order' | 'width'> & typeof numberState))

    const plc: tPlc = reactive({
        /*PlcPublicAttrs 在 copyPlc中会深度复制一遍，这里适配类型即可*/
        ...PlcPublicAttrs,
        group: false,
        props: propsState,
        slots,
        scopeSlots,
        event,
        refer: () => plc,
        refs,
        /*列宽发生调整*/
        setDurWidth: (durWidth: number) => plc.setPropsState({width: Number((propsState.width)) + durWidth}),
        /*对propsState的state的修改，最好都通过setPropsState来进行，这样可以出发table的onConfigPlc这个hooks*/
        setPropsState: (data: any) => {
            Object.entries(data).forEach(([key, val]) => {(propsState as any)[key] = val})
            table.emitConfigPlc()
        },
        /*有时候希望直接修改props的state，可以通过这个方法获取修改，这样的不会触发table的onConfigPlc这个hook*/
        getState: () => state as any,
    })

    return {
        refer: plc,
        render: () => (<i ref={onRef.el} {...{title: props.title, field: props.field}}/>)
    }
}
