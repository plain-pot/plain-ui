import {renderColgroup} from "../../plc/utils/renderColgroup";
import {PltHeadCell} from "./head-cell";
import {TableHoverPart} from "../utils/table.utils";
import {designComponent, useRefs, useStyles} from "plain-design-composition";
import {PlainTable} from "../../index";
import {PlScroll} from "../../../PlScroll";


export const PltHead = designComponent({
    name: 'plt-head',
    props: {
        table: {type: PlainTable, required: true},
    },
    setup({props}) {

        const {refs, onRef} = useRefs({
            scroll: PlScroll,
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
        const onWheel = (e: WheelEvent) => {
            const {deltaX, deltaY} = e
            if (Math.abs(deltaY) > Math.abs(deltaX)) {
                e.preventDefault()
                e.stopPropagation()
                refs.scroll!.refs.wrapper!.scrollLeft = refs.scroll!.refs.wrapper!.scrollLeft + deltaY / 3
            }
        }
        const scrollRef = () => refs.scroll!

        return {
            render: () => (
                <div class="plt-head" style={styles.value} onMouseenter={bindScroll.onMouseenter}>
                    <PlScroll hideScrollbar scrollX refreshState={props.table.plcData.value!.targetTableWidth} onScroll={bindScroll.onScroll} ref={onRef.scroll}>
                        <table {...{
                            cellSpacing: 0,
                            cellPadding: 0,
                            border: 0,
                            style: tableStyles.value,
                            onWheel,
                            key: props.table.plcData.value!.plcKeyString,
                        }}>
                            {renderColgroup(props.table.plcData.value!.flatPlcList)}
                            <thead>
                            {props.table.plcData.value!.headPlcListArray.map((array, arrayIndex) => (
                                <tr style={{height: `${props.table.numberState.headRowHeight}px`}} key={arrayIndex}>
                                    {array.map((plc, index) => <PltHeadCell key={index} table={props.table} tablePlc={plc} scroll={scrollRef}/>)}
                                </tr>
                            ))}
                            </thead>
                        </table>
                    </PlScroll>
                </div>
            )
        }
    },
})
