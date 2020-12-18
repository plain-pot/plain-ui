import {designComponent} from "../../../../use/designComponent";
import {PlainTable} from "../../table";
import Scroll from '../../../scroll'
import {renderColgroup} from "../../plc/core/renderColgroup";
import {PltHeadCell} from "./head-cell";
import {useStyles} from "../../../../use/useStyles";
import {TableHoverPart} from "../table.utils";
import {useRefs} from "../../../../use/useRefs";

export const PltHead = designComponent({
    name: 'plt-head',
    props: {
        table: {type: PlainTable, required: true},
    },
    setup({props}) {

        const {refs} = useRefs({
            scroll: Scroll,
        })
        const styles = useStyles(style => {
            style.height = `${props.table.plcData.value!.headPlcListArray.length * (props.table.numberState.headRowHeight + 1)}px`
        })
        const tableStyles = useStyles(style => {
            const {targetTableWidth} = props.table.plcData.value!
            if (!!targetTableWidth) {
                style.width = `${targetTableWidth}px`
            }
        })
        const bindScroll = props.table.bindScroll(
            TableHoverPart.head,
            (scrollLeft, part) => part !== TableHoverPart.head && refs.scroll!.methods.scroll({x: scrollLeft}, {noEmitScroll: true})
        )

        return {
            render: () => (
                <div class="plt-head" style={styles.value} onMouseenter={bindScroll.onMouseenter}>
                    <Scroll hideScrollbar scrollX refreshState={props.table.plcData.value!.targetTableWidth} onScroll={bindScroll.onScroll} ref="scroll">
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