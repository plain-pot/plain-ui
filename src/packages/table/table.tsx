import {designComponent} from "../../use/designComponent";
import {useSlots} from "../../use/useSlots";
import './table.scss'
import {TableProps} from "./table.utils";
import PlcCollector from './plc-core/plc-collector'
import {useRefs} from "../../use/useRefs";
import {computed, onMounted} from 'vue';
import {formatPlc} from "./plc-format/formatPlc";
import {useMounted} from "../../use/useMounted";

export default designComponent({
    name: 'pl-table',
    props: {
        ...TableProps,
    },
    setup() {

        const isMounted = useMounted()

        const {slots} = useSlots()

        const {refs} = useRefs({
            collector: PlcCollector,
        })

        const plcData = computed(() => {
            if (!isMounted.value) {
                return null
            }
            return formatPlc({
                plcList: refs.collector!.children
            })
        })

        onMounted(() => {
            console.log(plcData.value)
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