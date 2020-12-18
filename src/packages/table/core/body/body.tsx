import {designComponent} from "../../../../use/designComponent";
import {PlainTable} from "../../table";
import {PltRow} from "./row";
import {VirtualTable} from "../../virtual-table";
import {SimpleObject} from "../../../../shims";
import {renderColgroup} from "../../plc/core/renderColgroup";
import {useRefs} from "../../../../use/useRefs";
import {TableHoverPart} from "../table.utils";

export const PltBody = designComponent({
    name: 'plt-head',
    props: {
        table: {type: PlainTable, required: true},
    },
    setup({props}) {

        const {refs} = useRefs({
            virtual: VirtualTable,
        })
        /*表头表体联动滚动*/
        const bindScroll = props.table.bindScroll(
            TableHoverPart.body,
            (scrollLeft, part) => part !== TableHoverPart.body && refs.virtual!.refs.scroll!.methods.scroll({x: scrollLeft}, {noEmitScroll: true})
        );
        /*表体支持alt+鼠标滚动联动滚动*/
        const onMousewheel = (e: MouseWheelEvent) => {
            const {deltaX, deltaY} = e
            if (e.altKey && Math.abs(deltaY) > Math.abs(deltaX)) {
                e.preventDefault()
                e.stopPropagation()
                refs.virtual!.refs.scroll!.refs.wrapper.scrollLeft = refs.virtual!.refs.scroll!.refs.wrapper.scrollLeft + deltaY / 3
            }
        }

        return {
            render: () => (
                <VirtualTable
                    ref="virtual"
                    width={props.table.plcData.value!.targetTableWidth!}
                    size={props.table.numberState.bodyRowHeight}
                    data={props.table.dataModel.value}
                    height={props.table.props.showRows * props.table.numberState.bodyRowHeight + 12}
                    {...bindScroll}
                    {...{onMousewheel}}
                    v-slots={{
                        default: ({item, index}: { item: SimpleObject, index: number }) => (
                            <PltRow
                                {...{vid: index}}
                                key={index}
                                table={props.table}
                                node={item}
                            />
                        ),
                        colgroup: () => renderColgroup(props.table.plcData.value!.flatPlcList)
                    }}
                />
            )
        }
    },
})