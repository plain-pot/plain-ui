import {computed, defineComponent, reactive} from "@vue/composition-api";
import {PLC_COLLECTOR, PlcComponentPublicData, PlcComponentType, PlcGroupProps, PlcProps} from "@/packages/table/plc/plc-utils";
import {useSlots} from "@/use/useSlots";
import {useCollectChild, useCollectParent} from "@/use/useCollect";
import {useRefer} from "@/use/useRefer";

import {FormatPropsType, useProps} from "@/use/useProps";
import {PlcType} from "@/packages/table/plc/plc";
import {ScopedSlotFunc, useScopedSlots} from "@/use/useScopedSlots";
import {$plain} from "@/packages/base";

function plcGroupSetup(props: ExtractPropTypes<typeof PlcGroupProps>) {

    const {$scopedSlots} = useScopedSlots({
        head: ScopedSlotFunc,
    })

    useCollectChild({provideString: PLC_COLLECTOR})
    const items = useCollectParent({sort: true, provideString: PLC_COLLECTOR}) as { value: (PlcType | PlcGroupType)[] }

    const propsState = useProps(props, {
        order: FormatPropsType.number,
    })

    const targetProps = computed(() => ({
        ...props,
        ...propsState
    }))

    // plc state：存储列动态变化的变量，优先级大于 props以及config
    const state = reactive(Object.keys(PlcProps).reduce((ret, key) => {
        ret[key] = null
        return ret
    }, {}) as PlainExtractPropTypes<typeof PlcProps> & { level: number })

    function setDurWidth(durWidth: number) {
        const itemDurWidth = Math.floor(durWidth / (items.value.length))
        items.value.forEach(item => item.setDurWidth(itemDurWidth))
    }

    const refer = {
        ...$plain.utils.deepcopy(PlcComponentPublicData),
        scopedSlots: $scopedSlots,
        _$scopedSlots: $scopedSlots,
        type: PlcComponentType.GROUP,
        /*这里之所以强制做类型变化，是因为经过了collector的计算属性转化，在使用的时候是没有Ref这一层的*/
        // @ts-ignore
        props: targetProps as PlainExtractPropTypes<typeof PlcGroupProps>,
        items,
        state,
        setDurWidth,
    }

    useRefer(refer)
    useRefer({refer})

    return refer
}

export type PlcGroupType = ReturnType<typeof plcGroupSetup>

/**
 * 判断是否为plc分组
 * @author  韦胜健
 * @date    2020/8/14 15:39
 */
export function isPlcGroup(plc: PlcType | PlcGroupType): plc is PlcGroupType {
    return plc.type === PlcComponentType.GROUP
}

export default defineComponent({
    name: 'plc-group',
    props: {
        ...PlcGroupProps,
    },
    setup(props) {

        const {slots} = useSlots()
        plcGroupSetup(props)

        return () => (
            <div class="plc-group">
                {slots.default()}
            </div>
        )
    },
})