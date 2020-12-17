import {designComponent} from "../../../../use/designComponent";
import Table from "../../table";
import {SimpleObject} from "../../../../shims";
import {renderColgroup} from "../../plc-format/renderColgroup";
import {unit} from "plain-utils/string/unit";
import {useStyles} from "../../../../use/useStyles";

export const PltBody = designComponent({
    name: 'plt-body',
    setup() {
        const table = Table.use.inject()
        const tableStyles = useStyles(style => {style.width = unit(table.totalContentWidth!)})

        return {
            render: () => (
                <div class="plt-body">
                    <table style={tableStyles.value}>
                        {renderColgroup(table.plcData!.flatPlcList)}

                        {(table.props.data || []).map((item: SimpleObject, index: number) => (
                            <tr key={index}>
                                {table.plcData!.flatPlcList.map((plc, plcIndex) => (
                                    <td key={plcIndex}>
                                        {!!plc.props.field ? item[plc.props.field] : null}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </table>
                </div>
            )
        }
    },
})