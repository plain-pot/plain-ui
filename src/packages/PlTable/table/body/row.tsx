import {PltCell} from "./cell";
import {TableNode} from "../use/useTableNode";
import {designComponent, PropType, useClasses} from "plain-design-composition";
import {PlainTable} from "../../index";


export const PltRow = designComponent({
    name: 'plt-row',
    props: {
        table: {type: PlainTable, required: true},
        node: {type: Object as PropType<TableNode>, required: true},
        vid: {type: [String, Number]},
    },
    setup({props}) {

        const handler = {
            onClick: (e: MouseEvent) => props.table.handler.onClickRow(e, props.node),
            onDoubleClick: (e: MouseEvent) => props.table.handler.onDblclickRow(e, props.node),
            vid: props.vid,
        }

        const classes = useClasses(() => {
            const ret = [
                'plt-row',
                {
                    'plt-row-current': props.table.current.value == props.node.key
                }
            ] as any[]
            if (!!props.table.props.rowClassFunc) {
                ret.push(props.table.props.rowClassFunc(props.node))
            }
            return ret
        })

        return {
            render: () => {
                return props.table.hooks.onRenderRow.exec({
                    content: (
                        <tr class={classes.value} style={{height: `${props.table.numberState.bodyRowHeight}px`}} {...handler}>
                            {props.table.plcData.value!.flatPlcList.map((plc, index) => <PltCell key={index} table={props.table} node={props.node} plc={plc}/>)}
                        </tr>
                    ),
                    node: props.node,
                    row: props.node.data,
                }).content
            }
        }
    },
})
