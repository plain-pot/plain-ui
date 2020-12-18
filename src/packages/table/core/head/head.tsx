import {designComponent} from "../../../../use/designComponent";
import {PlainTable} from "../../table";
import Scroll from '../../../scroll'
import {renderColgroup} from "../../plc/core/renderColgroup";
import {PltHeadCell} from "./head-cell";
import {useStyles} from "../../../../use/useStyles";

export const PltHead = designComponent({
    name: 'plt-head',
    props: {
        table: {type: PlainTable, required: true},
    },
    setup({props}) {

        const styles = useStyles(style => {
            style.height = `${props.table.plcData.value!.headPlcListArray.length * (props.table.numberState.headRowHeight + 1)}px`
        })
        const tableStyles = useStyles(style => {
            const {targetTableWidth} = props.table.plcData.value!
            if (!!targetTableWidth) {
                style.width = `${targetTableWidth}px`
            }
        })

        return {
            render: () => (
                <div class="plt-head" style={styles.value}>
                    <Scroll scrollX refreshState={props.table.plcData.value!.targetTableWidth}>
                        <table {...{cellspacing: 0, cellpadding: 0, border: 0, style: tableStyles.value}}>
                            {renderColgroup(props.table.plcData.value!.flatPlcList)}
                            {props.table.plcData.value!.headPlcListArray.map((array, arrayIndex) => (
                                <tr style={`height:${props.table.numberState.headRowHeight}px`} key={arrayIndex}>
                                    {array.map((plc) => <PltHeadCell table={props.table} tablePlc={plc}/>)}
                                </tr>
                            ))}
                        </table>
                    </Scroll>
                </div>
            )
        }
    },
})