
import {tTableOption} from "../createUseTableOption";
import useDialog, {DialogServiceFormatOption} from "../useDialog";
import PlTablePro from "../PlTablePro";
import PlcPick from "../PlcPick";
import {designPage, onBeforeUnmount, useRefs} from "plain-ui-composition";
import PlcCheckRow from "../PlcCheckRow";
import useMessage from "../useMessage";
import {PlainObject} from "plain-utils/utils/event";
import {defer} from "plain-utils/utils/defer";

export interface ObjectServiceOption {
    option: tTableOption,
    selected?: PlainObject | PlainObject[],
    readonly?: boolean,
    beforeConfirm?: (data: PlainObject | PlainObject[]) => void | Promise<void>,
    beforeCancel?: () => void | Promise<void>,
}

interface ObjectService {
    (option: ObjectServiceOption): Promise<PlainObject>,

    (option: ObjectServiceOption, multiple: true): Promise<PlainObject[]>,
}

export function useObject() {

    const $dialog = useDialog()
    const $message = useMessage()
    const {refs, onRef} = useRefs({
        check: null as null | typeof PlcPick.use.class | typeof PlcCheckRow.use.class
    })

    const $object: ObjectService = (option: ObjectServiceOption, multiple?: true) => {
        const dfd = defer<PlainObject | PlainObject[]>()
        const {option: tableOption, beforeCancel, beforeConfirm} = option

        const onConfirm = async () => {
            if (option.readonly) {return }

            if (!refs.check) {
                dfd.reject(new Error('选择失败，内部异常！'))
            } else {
                const data = !multiple ? refs.check.getSelected()! : refs.check.getSelected()
                if (!data || (Array.isArray(data) && data.length === 0)) {
                    return void $message.error('请选择一行数据！')
                }
                !!beforeConfirm && await beforeConfirm(data)
                dfd.resolve(data)
            }
            onRef.check(null)
            dlgOpt.close!()
        }

        const Content = designPage(() => {
            if (!multiple) {onBeforeUnmount(tableOption.hooks.onDblClickCell.use(onConfirm))}

            return () => <>
                <PlTablePro option={tableOption}>
                    {multiple && <PlcCheckRow toggleOnClickRow ref={onRef.check} selected={option.selected as PlainObject[]}/>}
                    {!multiple && <PlcPick toggleOnClickRow ref={onRef.check} selected={option.selected as PlainObject}/>}
                </PlTablePro>
            </>
        })

        const dlgOpt: Partial<DialogServiceFormatOption> = {
            title: tableOption.config.title,
            status: null,
            render: () => <Content/>,
            dialogProps: {
                closeOnConfirm: false,
                width: '75vw',
                vertical: 'center',
            },
            confirmButton: !option.readonly,
            cancelButton: true,
            onConfirm,
            onCancel: async () => {
                !!beforeCancel && await beforeCancel()
                onRef.check(null)
                dlgOpt.close!()
            },
        }
        $dialog(dlgOpt)
        return dfd.promise as any
    }

    return {$object}
}

export default useObject
