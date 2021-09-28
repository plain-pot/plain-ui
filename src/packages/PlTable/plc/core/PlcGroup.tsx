import {PlcGroupPropsOptions, PlcPublicAttrs} from "../utils/plc.utils";
import {tPlcGroup} from "../utils/plc.type";
import {computed, designComponent, reactive, useNumber, useRefs} from "plain-design-composition";

import {useCollect} from "../../../../use/useCollect";
import Plc from "./Plc";
import {getPropsState, usePropsState} from "../utils/usePropsState";
import PlTable from "../../index";

const PlcGroup = designComponent({
    name: 'plc-group',
    props: {
        ...PlcGroupPropsOptions,
    },
    slots: ['default', 'head'],
    setup({props, slots}) {
        const table = PlTable.use.inject()
        const {refs, onRef} = useRefs({el: HTMLDivElement})
        /*collector收集列信息*/
        PlcCollector.child({sort: () => refs.el!, injectDefaultValue: null})
        const items = PlcCollector.parent(true)
        /*格式化props*/
        const {numberState} = useNumber(props, ['order'])
        const {propsState, state} = usePropsState(computed(() => ({
            ...props,
            ...numberState,
        }) as Omit<typeof props, 'order'> & typeof numberState))

        /*核心暴露对象*/
        const group: tPlcGroup = reactive({
            refs,
            /*PlcPublicAttrs 在 copyPlc中会深度复制一遍，这里适配类型即可*/
            ...PlcPublicAttrs,
            group: true,
            children: items,
            /**
             * 这里这个props是可修改的对象，别名叫做propsState，来源是props，当props
             * 中的值发生变化时，自动修正使用props中的值
             * @author  韦胜健
             * @date    2021/6/2 15:57
             */
            props: propsState,
            slots: slots as any,
            refer: () => group,
            /*分组表头宽度调整时，将放大/缩小的列宽分配给每一个子列*/
            setDurWidth: (durWidth: number) => {
                const itemDurWidth = Math.floor(durWidth / (items.value.length))
                items.value.forEach(item => item.setDurWidth(itemDurWidth))
            },
            /*对propsState的state的修改，最好都通过setPropsState来进行，这样可以出发table的onConfigPlc这个hooks*/
            setPropsState: (data: any) => {
                Object.entries(data).forEach(([key, val]) => {(propsState as any)[key] = val})
                table.emitConfigPlc()
            },
            /*有时候希望直接修改props的state，可以通过这个方法获取修改，这样的不会触发table的onConfigPlc这个hook*/
            getState: () => state as any,
        })

        return {
            refer: group,
            render: () => (
                <div ref={onRef.el}>
                    {slots.default()}
                </div>
            )
        }
    },
})

export default PlcGroup

export const PlcCollector = useCollect(() => ({
    parent: PlcGroup,
    child: Plc,
}))
