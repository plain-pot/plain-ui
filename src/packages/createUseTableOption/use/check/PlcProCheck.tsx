import {computed, designComponent, onBeforeUnmount, PropType, reactive} from "plain-design-composition";
import {createPlcPropOptions, PlcEmitsOptions} from "../../../PlTable/plc/utils/plc.utils";
import {TableNode} from "../../../PlTable/table/use/useTableNode";
import {PlcScopeSlotsOptions} from "../../../PlTable/plc/utils/plc.scope-slots";
import {injectPlainTable} from "../../../PlTable";
import {PlainObject} from "../../createUseTableOption.utils";
import {CheckboxStatus} from "../../../../utils/constant";
import {useExternalPlc} from "../../../PlTable/plc/core/useExternalPlc";
import {PlCheckbox} from "../../../PlCheckbox";
import PlDropdown from "../../../PlDropdown";
import PlDropdownMenu from "../../../PlDropdownMenu";
import PlDropdownOption from "../../../PlDropdownOption";


export default designComponent({
    name: 'plc-pro-check',
    props: {
        ...createPlcPropOptions({
            autoFixedLeft: true,
            order: -9998,
            width: 40,
            align: 'center',
            noPadding: true,
            hideInForm: true,
        }),
        toggleOnClickRow: {type: Boolean},                                          // 是否在点击行的时候触发点击动作
        isCheckable: {type: Function as PropType<(node: TableNode) => boolean>},    // 是否可选
        keyField: {type: String, required: true},                                   // 行标识字段
    },
    scopeSlots: PlcScopeSlotsOptions,
    emits: PlcEmitsOptions,
    setup({props, slots, scopeSlots, event}) {

        const table = injectPlainTable()
        const state = reactive({
            /*当前选中行数组*/
            selectedRows: [] as PlainObject[],
        })
        /*获取对象的key*/
        const getKey = (row: any) => row[props.keyField]
        /*选中行数组的key数组*/
        const selectedKeys = computed(() => state.selectedRows.map(row => getKey(row)))
        /*当前状态，全选，全不选还是半选*/
        const status = computed(() => {
            let hasCheck = null as null | boolean;
            let hasUncheck = null as null | boolean;

            table.flatNodes.value.forEach(node => {
                const key = getKey(node.data)
                if (selectedKeys.value.indexOf(key) > -1) {
                    hasCheck === null && (hasCheck = true)
                } else {
                    hasUncheck === null && (hasUncheck = true)
                }
            })

            if (hasCheck && !hasUncheck) {return CheckboxStatus.check}
            if (!hasCheck && hasUncheck) {return CheckboxStatus.uncheck}
            return CheckboxStatus.minus
        })
        /*是否可以选中*/
        const isCheckable = (node: TableNode) => !props.isCheckable || (props.isCheckable(node.data as any) !== false)
        /*判断是否选中*/
        const isCheck = (node: TableNode) => selectedKeys.value.indexOf(getKey(node.data)) > -1
        /*切换选中状态*/
        const toggle = (node: TableNode) => {
            const index = selectedKeys.value.indexOf(getKey(node.data))
            index > -1 ? state.selectedRows.splice(index, 1) : state.selectedRows.push(node.data)
        }
        const handler = {
            /*处理点击复选框按钮动作*/
            onClickCheckbox: (node: TableNode) => isCheckable(node) && toggle(node),
        }
        const methods = {
            /*获取选中行数据*/
            getSelected: () => state.selectedRows,
            /*清空当前也选中行*/
            clearAll: () => {
                const currentPageKeys = table.flatNodes.value.map(node => getKey(node.data))
                state.selectedRows = state.selectedRows.filter(row => currentPageKeys.indexOf(getKey(row)) === -1)
            },
            /*选中当前页*/
            checkAll: () => {
                const add = table.flatNodes.value.filter(node => selectedKeys.value.indexOf(getKey(node.data) === -1)).map(i => i.data)
                state.selectedRows.push(...add)
            },
            /*反选当前页*/
            reverse: () => {
                const add: any[] = []
                const removeKeys: string[] = []

                table.flatNodes.value.forEach(({data}) => {
                    const key = getKey(data)
                    selectedKeys.value.indexOf(key) > -1 ? removeKeys.push(key) : add.push(data)
                })
                state.selectedRows = state.selectedRows.filter(i => removeKeys.indexOf(getKey(i)) === -1).concat(add)
            },
        }
        if (props.toggleOnClickRow) {
            table.event.on.onClickCell(handler.onClickCheckbox)
            onBeforeUnmount(() => table.event.off.onClickRow(handler.onClickCheckbox))
        }

        const {refer, render} = useExternalPlc({
            props, scopeSlots, slots, event, defaultScopeSlots: {
                summary: () => null,
                normal: ({node}) => <PlCheckbox
                    customReadonly
                    modelValue={isCheck(node)}
                    onClick={() => handler.onClickCheckbox(node)}
                    disabled={!isCheckable(node)}
                />,
                head: () => (
                    <PlDropdown
                        {...{placement: 'bottom-center'}}
                        v-slots={{
                            default: () => <PlCheckbox checkStatus={status.value}/>,
                            popper: () => <PlDropdownMenu>
                                <PlDropdownOption label="全选当前页" icon="el-icon-check-bold" onClick={methods.checkAll}/>
                                <PlDropdownOption label="取消当前页" icon="el-icon-close-bold" onClick={methods.clearAll}/>
                                <PlDropdownOption label="反选当前页" icon="el-icon-refresh" onClick={methods.reverse}/>
                            </PlDropdownMenu>
                        }}
                    />
                )
            }
        })

        return {
            refer: {
                ...refer,
                isCheckable,
                isCheck,
                toggle,
                ...methods,
            },
            render,
        }
    },
})
