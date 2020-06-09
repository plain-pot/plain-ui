import {defineComponent} from "@vue/composition-api";
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

    const refer = {
        type: PlcComponentType.GROUP,
        propsState,
        props,
        items,
    }

    useRefer(refer)

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