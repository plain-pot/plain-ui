import {designComponent} from "../../use/designComponent";
import {useSlots} from "../../use/useSlots";
import './table.scss'
import {TableProps} from "./table.utils";
import PlcCollector from './plc-core/plc-collector'

export default designComponent({
    name: 'pl-table',
    props: {
        ...TableProps,
    },
    setup() {
        const {slots} = useSlots()
        return {
            render: () => {
                return (
                    <div class="pl-table">
                        <PlcCollector>{slots.default()}</PlcCollector>
                    </div>
                )
            }
        }
    },
})