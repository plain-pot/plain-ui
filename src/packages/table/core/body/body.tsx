import {designComponent} from "../../../../use/designComponent";
import {PlainTable} from "../../table";
import Scroll from '../../../scroll'
import {renderColgroup} from "../../plc/core/renderColgroup";
import {PltRow} from "./row";

export const PltBody = designComponent({
    name: 'plt-head',
    props: {
        table: {type: PlainTable, required: true},
    },
    setup({props}) {
        return {
            render: () => (
                <div>
                    <Scroll scrollX>
                        <table>
                            {renderColgroup(props.table.plcData.value!.flatPlcList)}
                            {(props.table.props.data || []).map((row, rowIndex) => (
                                <PltRow
                                    key={rowIndex}
                                    table={props.table}
                                    node={row}
                                />
                            ))}
                        </table>
                    </Scroll>
                </div>
            )
        }
    },
})