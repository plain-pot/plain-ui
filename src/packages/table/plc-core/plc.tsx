import {designComponent} from "../../../use/designComponent";
import {PlcProps} from "./plc.utils";
import {PlcCollector} from "./plc-collector";

export default designComponent({
    name: 'plc',
    props: {
        ...PlcProps,
    },
    setup({props}) {

        PlcCollector.child()

        return {
            render: () => (
                <div>
                    {props.title}-{props.field}
                </div>
            )
        }
    },
})