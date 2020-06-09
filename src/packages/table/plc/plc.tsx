import {defineComponent} from "@vue/composition-api";
import {PlcProps} from "@/packages/table/plc/plc-utils";

export default defineComponent({
    name: 'plc',
    props: {
        ...PlcProps,
    },
    setup(props) {
        return () => (
            <div class="plc">{props.field}-{props.title}</div>
        )
    },
})