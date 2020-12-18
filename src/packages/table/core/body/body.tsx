import {designComponent} from "../../../../use/designComponent";
import {PlainTable} from "../../table";
import {PltRow} from "./row";
import {useStyles} from "../../../../use/useStyles";
import {VirtualTable} from "../../virtual-table";
import {SimpleObject} from "../../../../shims";
import {renderColgroup} from "../../plc/core/renderColgroup";

export const PltBody = designComponent({
    name: 'plt-head',
    props: {
        table: {type: PlainTable, required: true},
    },
    setup({props}) {

        return {
            render: () => (
                <VirtualTable
                    width={props.table.plcData.value!.targetTableWidth!}
                    size={props.table.numberState.bodyRowHeight}
                    data={props.table.dataModel.value}
                    height={props.table.props.showRows * props.table.numberState.bodyRowHeight + 12}
                    v-slots={{
                        default: ({item, index}: { item: SimpleObject, index: number }) => (
                            <PltRow
                                {...{vid: index}}
                                key={index}
                                table={props.table}
                                node={item}
                            />
                        ),
                        colgroup: () => renderColgroup(props.table.plcData.value!.flatPlcList)
                    }}
                />
            )
        }
    },
})