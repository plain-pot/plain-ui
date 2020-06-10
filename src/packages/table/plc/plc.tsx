import {computed, defineComponent} from "@vue/composition-api";
import {PLC_COLLECTOR, PlcComponentType, PlcProps} from "@/packages/table/plc/plc-utils";
import {useCollectChild} from "@/use/useCollect";
import {useRefer} from "@/use/useRefer";
import {FormatPropsType, useProps} from "@/use/useProps";
import {ExtractPropTypes} from "@vue/composition-api/dist/component/componentProps";
import {getReturnType} from "@/util/util";

function plcSetup(props: ExtractPropTypes<typeof PlcProps>) {

    useCollectChild({provideString: PLC_COLLECTOR})

    const propsState = useProps(props, {
        width: FormatPropsType.number,
        fit: FormatPropsType.number,
        order: FormatPropsType.number,
    })

    const targetProps = computed(() => ({
        ...props,
        ...propsState,
    }))

    const refer = {
        type: PlcComponentType.PLC,
        /*这里之所以强制做类型变化，是因为经过了collector的计算属性转化，在使用的时候是没有Ref这一层的*/
        // @ts-ignore
        props: targetProps as ExtractPropTypes<typeof PlcProps>,
    }

    useRefer(refer)
    useRefer({refer})

    return refer
}

const PlcSetupValue = getReturnType(plcSetup)
export type PlcType = typeof PlcSetupValue

export default defineComponent({
    name: 'plc',
    props: {
        ...PlcProps,
    },
    setup(props) {

        plcSetup(props)

        return () => (<div class="plc" field={props.field} title={props.title}/>)
    },
})