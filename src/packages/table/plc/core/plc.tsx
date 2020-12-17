import {designComponent} from "../../../../use/designComponent";
import {PlcProps} from "./plc.utils";
import {TablePlcCollector} from './plc-collector';
import {Plc} from "./plc.type";

export default designComponent({
    name: 'plc',
    props: {
        ...PlcProps,
    },
    setup({props}) {
        TablePlcCollector.useChild()

        const plc: Plc = {
            group: false,
        }

        return {
            refer: plc,
            render: () => (
                <div>
                    plc-{props.title}-{props.field}
                </div>
            )
        }
    },
})