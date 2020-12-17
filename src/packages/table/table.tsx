import {designComponent} from "../../use/designComponent";
import {useSlots} from "../../use/useSlots";
import PlcCollector from './plc/core/plc-collector'
import {useRefs} from "../../use/useRefs";
import {onMounted} from 'vue';

const Table = designComponent({
    name: 'pl-table',
    props: {},
    setup({props}) {

        const {slots} = useSlots()
        const {refs} = useRefs({
            collector: PlcCollector,
        })

        onMounted(() => {
            console.log(refs.collector!.children)
        })

        return {
            render: () => (
                <div>
                    <PlcCollector ref="collector">{slots.default()}</PlcCollector>
                </div>
            )
        }
    },
})

export default Table