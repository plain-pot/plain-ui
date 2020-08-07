import {definePlc, getBinding} from "@/packages/table/plc-components/register";

export default definePlc({
    name: 'plc-color-picker',
    props: {
        width: {default: 150},
        edit: {
            type: Function,
            default: function ({plc, row}) {
                return (
                    <pl-color-picker {...getBinding(row, plc.props.field!)}/>
                )
            }
        },
    },
})