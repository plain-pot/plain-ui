import {getCellClass, TableComponentMixin} from "./table-utils";
import {Plc, PlcFixedType} from "../plc/plc-utils";

export default {
    name: 'plt-body-cell',
    mixins: [
        TableComponentMixin,
    ],
    inject: {
        pltBodyItem: {default: null}
    },
    props: {
        plc: {type: Object},
        rowData: {type: Object},
    },
    render(h) {
        const plc = this.plc as Plc

        if (this.pltBodyItem.fixed !== PlcFixedType.center && plc.actualProps.fixed !== this.pltBodyItem.fixed) return null

        return (
            <td class={this.classes} colspan={1} rowspan={1} style={this.styles}>
                {this.pltBodyItem.fixed === this.plc.actualProps.fixed ? this.rowData.row[plc.props.field]: null}
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