import {designComponent} from "../../use/designComponent";
import {useSlots} from "../../use/useSlots";
import './table.scss'
import {TableHoverPart, TableProps} from "./table.utils";
import PlcCollector from './plc-core/plc-collector'
import {useRefs} from "../../use/useRefs";
import {computed, onMounted, reactive} from 'vue';
import {formatPlc} from "./plc-format/formatPlc";
import {useNumber} from "../../use/useNumber";
import {PltHead} from "./table-core/head/head";
import {PltBody} from "./table-core/body/body";

export default designComponent({
    name: 'pl-table',
    props: {
        ...TableProps,
    },
    provideRefer: true,
    emits: {
        onScrollLeft: (e: Event, part: TableHoverPart) => true,
    },
    setup({props, event: {emit, on}}) {

        /*---------------------------------------base-------------------------------------------*/

        const {slots} = useSlots()
        const {refs} = useRefs({
            collector: PlcCollector,
            el: HTMLDivElement,
        })

        /*---------------------------------------state-------------------------------------------*/

        const freeState = {
            hoverPart: null as null | TableHoverPart,
        }
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

        /*---------------------------------------utils-------------------------------------------*/

        /**
         * 表头表体横向联动滚动
         * @author  韦胜健
         * @date    2020/12/17 15:07
         */
        const bindScroll = ({part, update,}: { part: TableHoverPart, update: (scrollLeft: number, part: TableHoverPart) => void, }) => {
            on.onScrollLeft((e, part) => update((e.target as HTMLElement).scrollLeft, part))
            return {
                onMouseenter: () => freeState.hoverPart = part,
                onScroll: (e: Event) => freeState.hoverPart === part && emit.onScrollLeft(e, part)
            }
        }

        /*---------------------------------------lifecycle-------------------------------------------*/

        onMounted(() => {
            state.tableWidth = refs.el.offsetWidth
        })

        const refer = reactive({
            props,
            plcData,
        })

        return {
            refer,
            render: () => {
                return (
                    <div class="pl-table" ref="el">
                        <PlcCollector ref="collector">{slots.default()}</PlcCollector>
                        {!!refer.plcData && (
                            <>
                                <PltHead/>
                                <PltBody/>
                            </>
                        )}
                    </div>
                )
            }
        }
    },
})