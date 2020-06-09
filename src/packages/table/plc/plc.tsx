import {defineComponent} from "@vue/composition-api";
import {PLC_COLLECTOR, PlcProps, PlcType} from "@/packages/table/plc/plc-utils";
import {useCollectChild} from "@/use/useCollect";
import {useRefer} from "@/use/useRefer";

export default defineComponent({
    name: 'plc',
    props: {
        ...PlcProps,
    },
    setup(props) {

        useCollectChild({provideString: PLC_COLLECTOR})

        useRefer({
            type: PlcType.PLC
        })

        return () => (
            <div class="plc">{props.field}-{props.title}</div>
        )
    },
})