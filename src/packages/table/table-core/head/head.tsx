import {designComponent} from "../../../../use/designComponent";
import Table from '../../table'

export const PltHead = designComponent({
    name: 'plt-head',
    setup() {
        const table = Table.use.inject()
        return {
            render: () => (
                <div class="plt-head">
                    <table>
                        {table.plcData!.headCols.map((plcList) => (
                            <tr>
                                {plcList.map((plc, index) => (
                                    <td key={index} colspan={plc.colspan} rowspan={plc.rowspan}>
                                        {plc.props.title}
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