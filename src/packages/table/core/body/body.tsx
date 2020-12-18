import {designComponent} from "../../../../use/designComponent";
import {PlainTable} from "../../table";
import Scroll from '../../../scroll'
import {renderColgroup} from "../../plc/core/renderColgroup";

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
                                <tr key={rowIndex}>
                                    {props.table.plcData.value!.flatPlcList.map((plc, plcIndex) => (
                                        <td key={plcIndex}>
                                            {!!plc.props.field ? row[plc.props.field] : null}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </table>
                    </Scroll>
                </div>
            )
        }
    },
})