import {reactive, useRefs} from "plain-design-composition";
import {PlainObject, tTableOptionConfig} from "../../createUseTableOption.utils";
import {tTableOptionHooks} from "../use.hooks";

import {eTableProStatus, tTableOptionConfirm} from "../use.confirm";
import useMessage from "../../../useMessage";
import PlcProCheck from './PlcProCheck'
import {tTableOptionCommand} from "../use.command";
import {defer} from "plain-utils/utils/defer";

export function useTableOptionCheck({hooks, config, confirm, command}: {
    hooks: tTableOptionHooks,
    config: tTableOptionConfig,
    confirm: tTableOptionConfirm,
    command: tTableOptionCommand,
}) {

    const $message = useMessage()

    const state = reactive({
        showCheck: false,
    })
    const {refs, onRef} = useRefs({check: PlcProCheck})

    command.on('ctrl+a', (e) => {
        if (confirm.state.status === eTableProStatus.select) {
            e.stopPropagation()
            e.preventDefault()
            checkAll()
        }
    })

    hooks.onColumns.use((content) => {
        if (!state.showCheck) {
            return content
        }
        return <>
            <PlcProCheck
                ref={onRef.check}
                key="pro-checkbox"
                toggleOnClickRow
                keyField={config.keyField}/>
            {content}
        </>
    })

    const showCheckbox = () => {state.showCheck = true}
    const hideCheckbox = () => {state.showCheck = false}

    const clear = () => {
        console.log('清空选择')
    }
    const check = () => {console.log('选中某行')}
    const checkAll = () => {refs.check?.checkAll()}
    const uncheck = () => {console.log('取消选中某行')}
    const uncheckAll = () => {console.log('取消选中当前页')}
    const reverse = () => {console.log('反选当前页')}
    const toggle = () => {console.log('切换选中状态')}
    const openToCheck = () => {
        const dfd = defer<PlainObject[]>()
        showCheckbox()
        confirm.open(eTableProStatus.select, {
            confirmText: '确定',
            onConfirm: () => {
                const selectedRows = refs.check!.getSelected()
                if (selectedRows.length === 0) {
                    throw $message.warn('请至少选中一行数据！')
                }
                dfd.resolve(selectedRows)
                hideCheckbox()
            },
            onCancel: () => {
                console.log('取消选择')
                hideCheckbox()
            },
        })
        return dfd.promise
    }

    return {
        open,
        close,
        clear,
        check,
        checkAll,
        uncheck,
        uncheckAll,
        reverse,
        toggle,
        openToCheck,
    }
}

export type tTableOptionCheck = ReturnType<typeof useTableOptionCheck>
