import {PltRow} from "./row";
import {TableHoverPart} from "../utils/table.utils";
import {TableNode} from "../use/useTableNode";
import {designComponent, useRefs} from "plain-design-composition";

import {PlainTable} from "../../index";
import {renderColgroup} from "../../plc/utils/renderColgroup";
import {PlainScroll} from "../../../PlScroll";
import PlVirtualTable from "../../../PlVirtualTable";

export const PltBody = designComponent({
    name: 'plt-head',
    props: {
        table: {type: PlainTable, required: true},
    },
    setup({props}) {

        const {refs, onRef} = useRefs({
            virtual: PlVirtualTable,
        })
        /*表头表体联动滚动*/
        const bindScroll = props.table.bindScroll(
            TableHoverPart.body,
            (scrollLeft, part) => part !== TableHoverPart.body && refs.virtual!.refs.scroll!.methods.scroll({x: scrollLeft}, {noEmitScroll: true})
        );

        const handler = {
            /*表体支持alt+鼠标滚动联动滚动*/
            onWheel: (e: WheelEvent) => {
                const {deltaX, deltaY} = e
                if (e.altKey && Math.abs(deltaY) > Math.abs(deltaX)) {
                    e.preventDefault()
                    e.stopPropagation()
                    refs.virtual!.refs.scroll!.refs.wrapper!.scrollLeft = refs.virtual!.refs.scroll!.refs.wrapper!.scrollLeft + deltaY / 3
                }
            },
            onMounted: () => {
                props.table.event.emit.onVirtualMounted({scroll: refs.virtual!.refs.scroll as PlainScroll})
            }
        }

        return {
            render: () => {
                // console.log('props.table.disabledVirtual.value', props.table.disabledVirtual.value)
                return (
                    <PlVirtualTable
                        class="plt-body"
                        ref={onRef.virtual}
                        key={props.table.plcData.value!.plcKeyString}
                        width={props.table.plcData.value!.targetTableWidth!}
                        size={props.table.numberState.bodyRowHeight}
                        data={props.table.flatNodes.value}
                        summaryData={props.table.summaryNodes.value || undefined}
                        height={props.table.props.showRows * props.table.numberState.bodyRowHeight + 12}
                        disabled={props.table.disabledVirtual.value}
                        {...bindScroll}
                        {...handler}>
                        {{
                            default: ({item, index}: { item: TableNode, index: number }) => (
                                <PltRow
                                    {...{vid: index}}
                                    key={index}
                                    table={props.table}
                                    node={item}
                                />
                            ),
                            colgroup: () => renderColgroup(props.table.plcData.value!.flatPlcList)
                        }}
                    </PlVirtualTable>
                )
            }
        }
    },
})
