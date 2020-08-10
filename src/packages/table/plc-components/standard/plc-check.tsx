import {definePlc} from "@/packages/table/plc-components/register";
import {TableRenderData} from "@/packages/table/plc/plc";

export default definePlc({
    name: 'plc-check',

    props: {
        // custom
        keyField: {type: String, default: 'id'},                // 行对象中唯一标识的字段

        //standard
        autoFixedLeft: {default: true},
        order: {default: -9999},
        width: {default: 60},
        align: {default: 'center'},
        summary: {
            type: Function,
            default: function () {return null}
        },
        head: {
            type: Function,
            default: function () {
                return <pl-checkbox-indeterminate/>
            }
        },
        default: {
            type: Function,
            default: function ({row, plc}: TableRenderData) {
                const plcInstance = plc.ctx as any
                // @ts-ignore
                return <pl-checkbox readonly value={plcInstance.isChecked(row)} size={'normal'} onClick={() => plcInstance.onClickCheckbox(row)}/>
            }
        },
    },
    data() {
        return {
            selected: [],
        }
    },
    computed: {
        selectedKeys() {
            // @ts-ignore
            return this.selected.map(item => item[this.keyField])
        },
    },
    methods: {
        checkboxStatus() {
            // @ts-ignore
            if (this.selected.length === 0) return 'uncheck'

        },
        isChecked(row: any): boolean {
            // @ts-ignore
            return this.selectedKeys.indexOf(row[this.keyField]) > -1
        },
        onClickCheckbox(row) {
            // @ts-ignore
            const index = this.selectedKeys.indexOf(row[this.keyField])
            if (index > -1) {
                // @ts-ignore
                this.selected.splice(index, 1)
            } else {
                // @ts-ignore
                this.selected.push(row)
            }
        },
        getSelected() {
            // @ts-ignore
            return this.selected || []
        },
    }
})