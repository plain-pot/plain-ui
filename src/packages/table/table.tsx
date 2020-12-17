import {designComponent} from "../../use/designComponent";
import {useSlots} from "../../use/useSlots";
import PlcCollector from './plc/core/plc-collector'

const Table = designComponent({
    name: 'pl-table',
    props: {},
    setup({props}) {

        const {slots} = useSlots()

        return {
            render: () => (
                <div>
                    <PlcCollector>{slots.default()}</PlcCollector>
                </div>
            )
        }
    },
})

export default Table