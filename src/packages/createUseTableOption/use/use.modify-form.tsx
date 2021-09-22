import useDialog from "../../useDialog";
import {computed, reactive, useRefs} from "plain-ui-composition";
import PlForm from "../../PlForm";
import {tPlc} from "../../PlTable/plc/utils/plc.type";
import {TableNode} from "../../PlTable/table/use/useTableNode";
import {tFormPropRules} from "../../PlForm/form.validate";
import PlFormItem from "../../PlFormItem";
import {renderBodyCell} from "../../PlTable/plc/utils/render";

import PlButton from "../../PlButton";
import PlButtonGroup from "../../PlButtonGroup";
import PlDropdown from "../../PlDropdown";
import PlIcon from "../../PlIcon";
import PlDropdownMenu from "../../PlDropdownMenu";
import PlDropdownOption from "../../PlDropdownOption";

export function useTableOptionModifyForm() {

    const $dialog = useDialog()
    const {refs, onRef} = useRefs({form: PlForm})

    const modify = ({modifyNode, title, plcList, onConfirm, onCancel, rules}: {
        modifyNode: TableNode,
        title: string,
        plcList: tPlc[],
        onConfirm: (node: TableNode) => void,
        onCancel?: () => void,
        rules?: tFormPropRules,
    }) => {
        plcList = plcList.filter(i => !i.props.hideInForm && !!i.props.field)
        const state = reactive({
            editPlcArr: [plcList[0]] as tPlc[],
            toBeAddPlc: plcList[1] as tPlc | undefined,
            node: {
                ...modifyNode,
                editRow: modifyNode.data,
                edit: true,
            },
        })

        const addPlcList = computed(() => plcList.filter(i => i !== state.toBeAddPlc && state.editPlcArr.indexOf(i) === -1))

        const handler = {
            changeAddPlc: (e: MouseEvent, plc: tPlc) => {
                e.stopPropagation()
                state.toBeAddPlc = plc
            },
            addPlc: () => {
                !!state.toBeAddPlc && state.editPlcArr.push(state.toBeAddPlc)
                state.toBeAddPlc = addPlcList.value[0]
            },
            rmPlc: (plc: tPlc, index: number) => {
                state.editPlcArr.length > 1 && state.editPlcArr.splice(index, 1)
                state.toBeAddPlc = addPlcList.value[0]
                delete state.node.editRow[plc.props.field!]
            },
        }

        const dialog = $dialog({
            status: null,
            dialogProps: {
                wrapperPadding: false,
                horizontal: 'end',
                fullHeight: true,
                transition: 'pl-transition-dialog-right',
                width: null as any,
                destroyOnClose: false,
                closeOnCancel: false,
                closeOnConfirm: false,
                footAlign: 'flex-start',
            },
            title,
            render() {
                return (
                    <div>
                        <PlForm
                            ref={onRef.form}
                            column={1}
                            width={'100%'}
                            centerWhenSingleColumn={false}
                            modelValue={state.node.editRow}
                            rules={rules}
                            style={{overflow: 'hidden'}}
                        >
                            {state.editPlcArr.map((plc, index) => (
                                <PlFormItem
                                    key={index}
                                    label={plc.props.title}
                                    required={plc.props.required}
                                    rules={plc.props.rules}
                                    field={plc.props.field}
                                    contentAlign="space-between"
                                >
                                    {{
                                        default: renderBodyCell({node: state.node, plc, formEdit: true}).body,
                                        suffix: <PlButton icon="el-icon-minus" mode="stroke" onClick={() => handler.rmPlc(plc, index)}/>
                                    }}
                                </PlFormItem>
                            ))}
                            {addPlcList.value.length > 0 && <PlFormItem>
                                <PlButtonGroup>
                                    <PlDropdown placement="bottom-start" width={null as any} v-slots={{
                                        reference: ({open}) => (
                                            <PlButton mode="stroke">
                                                <span>{!!state.toBeAddPlc && state.toBeAddPlc.props.title}</span>
                                                <PlIcon icon={'el-icon-arrow-down'} style={{
                                                    transition: 'transform 200ms linear',
                                                    transform: `rotateX(${open ? 180 : 0}deg)`,
                                                }}/>
                                            </PlButton>
                                        ),
                                        popper: () => <PlDropdownMenu>
                                            {addPlcList.value.map((plc, index) => (
                                                <PlDropdownOption label={plc.props.title} key={index} onClick={e => handler.changeAddPlc(e, plc)}/>
                                            ))}
                                        </PlDropdownMenu>
                                    }}/>
                                    <PlButton label={'新增编辑字段'} icon="el-icon-plus" onClick={handler.addPlc}/>
                                </PlButtonGroup>
                            </PlFormItem>}
                        </PlForm>
                    </div>
                )
            },
            onConfirm: async () => {
                await refs.form!.validate()
                dialog.close()
                onConfirm(state.node)
            },
            onCancel: () => {
                dialog.close()
                !!onCancel && onCancel()
            },
            confirmButton: true,
            cancelButton: true,
        })
    }

    return {modify}
}
