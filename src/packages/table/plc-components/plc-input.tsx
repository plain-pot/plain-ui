import {definePlc} from "@/packages/table/plc-components/register";

export default definePlc({
    name: 'input',
    standardProps: {
        edit: {
            default: function (h, {rowData, plc}) {
                return (
                    <pl-input
                        block
                        value={rowData.data[plc.props.field]}/>
                )
            }
        },
    },
})