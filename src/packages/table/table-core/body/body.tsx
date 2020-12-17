import {designComponent} from "../../../../use/designComponent";
import Table from "../../table";
import {SimpleObject} from "../../../../shims";

export const PltBody = designComponent({
    name: 'plt-body',
    setup() {

        const table = Table.use.inject()

        return {
            render: () => (
                <div class="plt-body">
                    <table>
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