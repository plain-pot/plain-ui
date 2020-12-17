import {designComponent} from "../../../../use/designComponent";
import {PlcProps} from "./plc.utils";
import {TablePlcCollector} from './plc-collector';

export default designComponent({
    name: 'plc',
    props: {
        ...PlcProps,
    },
    setup({props}) {
        TablePlcCollector.useChild()
        return {
            render: () => (
                <div>
                    plc-{props.title}-{props.field}
                </div>
            )
        }
    },
})