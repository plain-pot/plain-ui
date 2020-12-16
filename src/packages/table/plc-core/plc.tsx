import {designComponent} from "../../../use/designComponent";
import {PlcProps} from "./plc.utils";

export default designComponent({
    name: 'plc',
    props: {
        ...PlcProps,
    },
    setup({props}) {
        return {
            render: () => (
                <div>
                    {props.title}-{props.field}
                </div>
            )
        }

    },
})