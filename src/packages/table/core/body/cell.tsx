import {designComponent} from "../../../../use/designComponent";
import {PlainTable} from "../../table";
import {PropType} from 'vue';
import {Plc} from "../../plc/core/plc.type";
import {TableNode} from "../useTableNode";
import {renderBodyCell} from "../../plc/core/render";

export const PltCell = designComponent({
    name: 'plt-cell',
    props: {
        table: {type: PlainTable, required: true},
        node: {type: Object as PropType<TableNode>, required: true},
        plc: {type: Object as PropType<Plc>, required: true},
    },
    setup({props}) {
        return {
            render: () => {
                const {body, editable} = renderBodyCell({node: props.node, plc: props.plc})
                return (
                    <td
                        colspan={1}
                        rowspan={1}
                        class={[
                            props.plc.classes.body,
                            {
                                'plt-cell-editing': editable,
                            }
                        ]}
                        style={props.plc.styles.body as any}>
                        {body}
                    </td>
                )
            }
        }
    },
})