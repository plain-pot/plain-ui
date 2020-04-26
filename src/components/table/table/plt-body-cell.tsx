import {getCellClass, TableComponentMixin} from "./table-utils";
import {Plc} from "../plc/plc-utils";

export default {
    name: 'plt-body-cell',
    mixins: [
        TableComponentMixin,
    ],
    props: {
        plc: {type: Object},
        rowData: {type: Object},
    },
    render(h) {
        const plc = this.plc as Plc
        return (
            <td class={this.classes} colspan={1} rowspan={1} style={this.styles}>
                {this.rowData.row[plc.props.field]}
            </td>
        )
    },
    computed: {
        classes() {
            return [
                'plt-body-cell',
                'plt-cell',
                ...getCellClass(this, this.plc, this.rowData),
            ]
        },
        styles() {
            const height = `${this.plTable.bodyRowHeight}px`
            const width = `${this.plc.actualProps.width}px`
            return {
                height,
                width,
            }
        },
    },
}