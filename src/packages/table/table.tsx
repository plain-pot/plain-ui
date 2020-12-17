import {designComponent} from "../../use/designComponent";
import {useSlots} from "../../use/useSlots";
import './table.scss'
import {TableProps} from "./table.utils";
import PlcCollector from './plc-core/plc-collector'
import {useRefs} from "../../use/useRefs";
import {computed, onMounted, reactive} from 'vue';
import {formatPlc} from "./plc-format/formatPlc";
import {useNumber} from "../../use/useNumber";

export default designComponent({
    name: 'pl-table',
    props: {
        ...TableProps,
    },
    setup({props}) {

        const {slots} = useSlots()
        const {refs} = useRefs({
            collector: PlcCollector,
            el: HTMLDivElement,
        })
        const state = reactive({
            tableWidth: null as null | number,                  // mounted的时候表格的宽度
        })
        const {numberState} = useNumber(props, ['bodyRowHeight', 'headRowHeight'])

        const plcData = computed(() => {
            if (!state.tableWidth) {
                return null
            }
            return formatPlc({
                plcList: refs.collector!.children,
                config: props.config,
                tableWidth: state.tableWidth!,
                bodyRowHeight: numberState.bodyRowHeight,
                headRowHeight: numberState.headRowHeight,
            })
        })

        onMounted(() => {
            state.tableWidth = refs.el.offsetWidth
            console.log(plcData.value)
        })

        return {
            render: () => {
                return (
                    <div class="pl-table" ref="el">
                        <PlcCollector ref="collector">{slots.default()}</PlcCollector>
                    </div>
                )
            }
        }
    },
})