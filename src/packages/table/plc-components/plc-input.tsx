import {definePlc} from "@/packages/table/plc-components/register";
import {set} from "@vue/composition-api";
import {TableRenderData} from "@/packages/table/plc/plc";

export default definePlc({
    name: 'plc-input',
    props: {
        edit: {
            type: Function,
            default: function ({plc, row}: TableRenderData) {

                /*return (
                    <pl-input
                        value={row[plc.props.field!]}
                        onInput={val => set(row, plc.props.field, val)}
                        {...{
                            on: {
                                // @ts-ignore
                                'click-input': () => plc.ctx!.onClickItem(this, plc)
                            }
                        }}
                    />
                )*/

                return (
                    <pl-input value={row[plc.props.field!]} onInput={val => set(row, plc.props.field, val)}/>
                )
            }
        },
    },
    data() {
        return {
            selected: [
                '123',
                '4456'
            ],
        }
    },
    methods: {
        addSelected() {
            // @ts-ignore
            this.selected.push(this.selected.length)
        },
        onClickItem(bodyCell, plc) {
            // @ts-ignore
            console.log(this.selected)
            console.log({
                bodyCell, plc
            })
        },
    },
})