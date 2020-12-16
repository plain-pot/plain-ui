import {designComponent} from "../../use/designComponent";
import {useSlots} from "../../use/useSlots";
import './table.scss'
import {TableProps} from "./table.utils";
import PlcCollector from './plc-core/plc-collector'
import {useRefs} from "../../use/useRefs";
import {onMounted} from 'vue';

export default designComponent({
    name: 'pl-table',
    props: {
        ...TableProps,
    },
    setup() {

        const {slots} = useSlots()

        const {refs} = useRefs({
            collector: PlcCollector,
        })

        onMounted(() => {
            console.log(refs.collector!.children)
        })

        return {
            render: () => {
                return (
                    <div class="pl-table">
                        <PlcCollector ref="collector">{slots.default()}</PlcCollector>
                    </div>
                )
            }
        }
    },
})