import {computed, defineComponent} from "@vue/composition-api";
import {PLC_COLLECTOR, PlcComponentType, PlcGroupProps} from "@/packages/table/plc/plc-utils";
import {useSlots} from "@/use/useSlots";
import {useCollectChild, useCollectParent} from "@/use/useCollect";
import {useRefer} from "@/use/useRefer";
import {ExtractPropTypes} from "@vue/composition-api/dist/component/componentProps";
import {getReturnType} from "@/util/util";
import {FormatPropsType, useProps} from "@/use/useProps";

function plcGroupSetup(props: ExtractPropTypes<typeof PlcGroupProps>) {
    useCollectChild({provideString: PLC_COLLECTOR})
    const items = useCollectParent({sort: true, provideString: PLC_COLLECTOR})

    const propsState = useProps(props, {
        order: FormatPropsType.number,
    })

    const targetProps = computed(() => ({
        ...props,
        ...propsState
    }))

    const refer = {
        type: PlcComponentType.GROUP,
        /*这里之所以强制做类型变化，是因为经过了collector的计算属性转化，在使用的时候是没有Ref这一层的*/
        // @ts-ignore
        props: targetProps as ExtractPropTypes<typeof PlcGroupProps>,
        items,
    }

    useRefer(refer)
    useRefer({refer})

    return refer
}

const PlcGroupSetupValue = getReturnType(plcGroupSetup)
export type PlcGroupType = typeof PlcGroupSetupValue

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