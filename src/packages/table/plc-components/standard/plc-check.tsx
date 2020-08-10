import {definePlc} from "@/packages/table/plc-components/register";
import {PlcType, TableRenderData} from "@/packages/table/plc/plc";
import {computed, inject, reactive} from "@vue/composition-api";
import {TABLE_PROVIDER} from "@/packages/table/table-utils";
import {PlainTable} from "@/packages/table/table/table";
import {TableNode} from "@/packages/table/table/TableNode";

export default definePlc({
    name: 'plc-check',

    props: {
        // custom
        keyField: {type: String, default: 'id'},                // 行对象中唯一标识的字段

        //standard
        autoFixedLeft: {default: true},
        order: {default: -10000},
        width: {default: 60},
        align: {default: 'center'},
        summary: {
            type: Function,
            default: function () {return null}
        },
        head: {
            type: Function,
            default: function (plc: PlcType) {
                const plcInstance = plc.ctx as any
                return <pl-checkbox-indeterminate
                    status={plcInstance.checkPlc.status.value}
                    onClick={plcInstance.checkPlc.handler.onClickHeadCheckbox}/>
            }
        },
        default: {
            type: Function,
            default: function ({row, plc}: TableRenderData) {
                const plcInstance = plc.ctx as any
                return (
                    <pl-checkbox
                        readonly
                        value={plcInstance.checkPlc.utils.isChecked(row)}
                        size={'normal'}
                        onClick={() => plcInstance.checkPlc.handler.onClickCheckbox(row)}/>
                )
            }
        },
    },
    setup(props) {

        const table = inject(TABLE_PROVIDER) as PlainTable

        // @ts-ignore
        const keyField = props.keyField as string

        const state = reactive({
            selected: [] as any[],
        })
        const selectedKeys = computed(() => {
            return state.selected.map(item => item[keyField])
        })
        const status = computed(() => {
            if (state.selected.length === 0) return 'uncheck'
            if (table.formatFlatTableData.value.every((item: TableNode) => selectedKeys.value.indexOf(item.data[keyField]) > -1)) {
                return 'check'
            } else {
                return 'minus'
            }
        })
        const checkPlc = {
            state,
            selectedKeys,
            status,
            utils: {
                isChecked: (row: any) => selectedKeys.value.indexOf(row[keyField]) > -1
            },
            handler: {
                onClickCheckbox: (row) => {
                    const index = selectedKeys.value.indexOf(row[keyField])
                    if (index > -1) {
                        state.selected.splice(index, 1)
                    } else {
                        state.selected.push(row)
                    }
                },
                onClickHeadCheckbox: () => {
                    state.selected = status.value === 'check' ? [] : table.formatFlatTableData.value.map((item: TableNode) => item.data)
                }
            }
        }

        const methods = {
            getSelected: () => {
                return state.selected
            },
        }

        return {
            ...methods,
            checkPlc,
        }
    },
})