import {designComponent} from "../../use/designComponent";
import {useSlots} from "../../use/useSlots";
import PlcCollector from './plc/core/plc-collector'
import {PltHead} from "./core/head/head";
import {PltBody} from "./core/body/body";
import './table.scss'
import {TableProps} from './core/table.utils';
import {usePlc} from "./plc/format/usePlc";
import {PropType} from 'vue';

const Table = designComponent({
    name: 'pl-table',
    props: {
        ...TableProps,
    },
    setup({props}) {

        const {slots} = useSlots()

        const {numberState, plcData} = usePlc({props})

        const refer = {
            props,
            numberState,
            plcData,
        }

        return {
            refer,
            render: () => (
                <div class="pl-table" ref="el">
                    <PlcCollector ref="collector">{slots.default()}</PlcCollector>
                    {!!plcData.value && <>
                        <PltHead table={refer}/>
                        <PltBody table={refer}/>
                    </>}
                </div>
            )
        }
    },
})

export const PlainTable = Object as PropType<typeof Table.use.class>

export default Table