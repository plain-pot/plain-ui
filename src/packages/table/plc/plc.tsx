import {defineComponent} from "@vue/composition-api";
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

    const refer = {
        type: PlcComponentType.PLC,
        propsState,
        props,
    }

    useRefer(refer)

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

        return () => (
            <div class="plc">{props.field}-{props.title}</div>
        )
    },
})