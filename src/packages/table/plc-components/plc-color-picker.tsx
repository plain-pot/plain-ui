import {definePlc} from "@/packages/table/plc-components/register";
import {set} from "@vue/composition-api";

export default definePlc({
    name: 'plc-color-picker',
    props: {
        width: {default: 150},
        edit: {
            type: Function,
            default: function ({plc, row}) {
                return (
                    <pl-color-picker value={row[plc.props.field]} onInput={val => set(row, plc.props.field, val)}/>
                )
            }
        },
    },
})