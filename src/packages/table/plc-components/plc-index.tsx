import {definePlc} from "@/packages/table/plc-components/register";

export default definePlc({
    name: 'index',
    customProps: {
        summaryText: {type: String, default: '合计'},
    },
    standardProps: {
        autoFixedLeft: {default: true},
        order: {default: -9999},
        summary: {
            default: function (h, {plc}) {
                return plc.props.summaryText
            }
        },
        default: {
            default: function (h, {rowData, plc}) {
                return (
                    <div>
                        <pl-button onClick={() => console.log(this)}>
                            {rowData.index + 1}
                        </pl-button>
                    </div>
                )
            }
        },
        head: {
            default: function () {
                return '#'
            }
        },
    },
    mixin: {
        data() {
            return {
                items: {},
                selected: [],
            }
        },
    }
})