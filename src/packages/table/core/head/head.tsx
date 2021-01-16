import {designComponent} from "../../../../use/designComponent";
import {PlainTable} from "../../table";
import {PlScroll} from '../../../scroll'
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
        /*Scroll的父节点需要固定高度*/
        const styles = useStyles(style => {
            style.height = `${props.table.plcData.value!.headPlcListArray.length * (props.table.numberState.headRowHeight + 1)}px`
        })
        /*当总的列宽度大于表格宽度时，设置宽度*/
        const tableStyles = useStyles(style => {
            const {targetTableWidth} = props.table.plcData.value!
            if (!!targetTableWidth) {
                style.width = `${targetTableWidth}px`
            }
        })
        /*表头表体联动滚动*/
        const bindScroll = props.table.bindScroll(
            TableHoverPart.head,
            (scrollLeft, part) => part !== TableHoverPart.head && refs.scroll!.methods.scroll({x: scrollLeft}, {noEmitScroll: true})
        )
        /*表头支持鼠标滚动横向滚动*/
        const onMousewheel = (e: WheelEvent) => {
            const {deltaX, deltaY} = e
            if (Math.abs(deltaY) > Math.abs(deltaX)) {
                e.preventDefault()
                e.stopPropagation()
                refs.scroll!.refs.wrapper.scrollLeft = refs.scroll!.refs.wrapper.scrollLeft + deltaY / 3
            }
        }
        const scrollRef = () => refs.scroll!

        return {
            render: () => (
                <div class="plt-head" style={styles.value} onMouseenter={bindScroll.onMouseenter}>
                    <Scroll hideScrollbar scrollX refreshState={props.table.plcData.value!.targetTableWidth} onScroll={bindScroll.onScroll} ref="scroll">
                        <table {...{
                            cellspacing: 0,
                            cellpadding: 0,
                            border: 0,
                            style: tableStyles.value,
                            onMousewheel: onMousewheel,
                            key: props.table.plcData.value!.plcKeyString,
                        }}>
                            {renderColgroup(props.table.plcData.value!.flatPlcList)}
                            {props.table.plcData.value!.headPlcListArray.map((array, arrayIndex) => (
                                <tr style={`height:${props.table.numberState.headRowHeight}px`} key={arrayIndex}>
                                    {array.map((plc) => <PltHeadCell table={props.table} tablePlc={plc} scroll={scrollRef}/>)}
                                </tr>
                            ))}
                        </table>
                    </Scroll>
                </div>
            )
        }
    },
})