import {designComponent} from "../../use/designComponent";
import {useSlots} from "../../use/useSlots";
import PlcCollector from './plc/core/plc-collector'
import {useRefs} from "../../use/useRefs";
import {PltHead} from "./core/head/head";
import {PltBody} from "./core/body/body";

const Table = designComponent({
    name: 'pl-table',
    props: {},
    setup({props}) {

        const {slots} = useSlots()
        const {refs} = useRefs({
            collector: PlcCollector,
        })

        return {
            render: () => (
                <div>
                    <PlcCollector ref="collector">{slots.default()}</PlcCollector>
                    <PltHead/>
                    <PltBody/>
                </div>
            )
        }
    },
})

export type PlainTable = typeof Table.use.class

export default Table