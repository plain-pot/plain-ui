import {designComponent} from "../../../../use/designComponent";
import {renderColgroup} from "../../plc-format/renderColgroup";
import {useStyles} from "../../../../use/useStyles";
import {VirtualTable} from "../../virtual-table";
import {TableNode} from "../node";
import {PltRow} from "./row";
import {PlainTable} from "../../table";
import {PropType} from 'vue';

export const PltBody = designComponent({
    name: 'plt-body',
    props: {
        table: {type: Object as PropType<PlainTable>, required: true}
    },
    setup({props}) {
        const table = props.table
        const styles = useStyles(style => {style.height = `${table.numberState.bodyRowHeight * table.props.showRows + 12}px`})

        return {
            render: () => (
                <div class="plt-body" style={styles.value}>
                    <VirtualTable
                        key={table.props.virtual ? 'enable-virtual' : 'disable-virtual'}
                        ref="virtualTable"
                        width={table.totalContentWidth}
                        data={table.node.flatList}
                        size={table.numberState.bodyRowHeight}
                        disabled={table.isDisabledVirtualScroll}
                        v-slots={{
                            colgroup: () => renderColgroup(table.plcData!.flatPlcList),
                            default: ({item}: { item: TableNode }) => table.plcData!.plcListHasRenderAfterRow.length > 0 ?
                                <>
                                    <PltRow key={`${item.key}_${item.index}`} vid={item.index} node={item} table={props.table}/>
                                    {table.plcData!.plcListHasRenderAfterRow.map((plc) => (plc.props.renderAfterRow!({plc, node: item})))}
                                </> :
                                <PltRow key={`${item.key}_${item.index}`} vid={item.index} node={item} table={props.table}/>
                        }}
                    />
                </div>
            )
        }
    },
})