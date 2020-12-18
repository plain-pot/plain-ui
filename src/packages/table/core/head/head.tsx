import {designComponent} from "../../../../use/designComponent";
import {PlainTable} from "../../table";
import Scroll from '../../../scroll'
import {renderColgroup} from "../../plc/core/renderColgroup";
import {PltHeadCell} from "./head-cell";

export const PltHead = designComponent({
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
                            <tr>
                                {props.table.plcData.value!.flatPlcList.map((plc) => <PltHeadCell table={props.table} tablePlc={plc}/>)}
                            </tr>
                        </table>
                    </Scroll>
                </div>
            )
        }
    },
})