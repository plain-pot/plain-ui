import {designComponent} from "../../../../use/designComponent";
import {PropType} from 'vue';
import {PlainTable} from "../../table";
import Scroll from '../../../scroll'
import {renderColgroup} from "../../plc/core/renderColgroup";

export const PltHead = designComponent({
    name: 'plt-head',
    props: {
        table: {type: Object as PropType<PlainTable>, required: true},
    },
    setup({props}) {
        return {
            render: () => (
                <div>
                    <Scroll scrollX>
                        <table>
                            {renderColgroup(props.table.plcData.value!.flatPlcList)}
                            <tr>
                                {props.table.plcData.value!.flatPlcList.map((plc) => (
                                    <td>
                                        {plc.props.title}
                                    </td>
                                ))}
                            </tr>
                        </table>
                    </Scroll>
                </div>
            )
        }
    },
})