import {definePlc} from "@/packages/table/plc-components/register";
import {set} from "@vue/composition-api";

export default definePlc({
    name: 'plc-input',
    props: {
        edit: {
            type: Function,
            default: function (h, {plc, row}) {
                // console.log(this)
                return (
                    <pl-input value={row[plc.props.field]} onInput={val => set(row, plc.props.field, val)}/>
                )
            }
        },
    },
})