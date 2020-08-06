import {definePlc} from "@/packages/table/plc-components/register";
import {set} from "@vue/composition-api";

export default definePlc({
    name: 'plc-number',
    props: {
        width: {default: 150},
        edit: {
            type: Function,
            default: function ({plc, row}) {
                return (
                    <pl-number value={row[plc.props.field]} onInput={val => set(row, plc.props.field, val)}/>
                )
            }
        },
    },
})