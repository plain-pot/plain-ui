import {designComponent} from "plain-ui-composition";
import {createPlcPropOptions, PlcEmitsOptions} from "../PlTable/plc/utils/plc.utils";
import {PlcPropsDefault, PlcScopeSlotsOptions} from "../PlTable/plc/utils/plc.scope-slots";
import {useExternalPlc} from "../PlTable/plc/core/useExternalPlc";


/**
 * 操作列
 * @author  韦胜健
 * @date    2021/7/15 21:56
 */
export const PlcOperator = designComponent({
    props: {
        ...createPlcPropOptions({
            fixed: 'right',
            order: 9999,
            width: 200,
            align: 'center',
            noPadding: true,
            hideInForm: true,
        })
    },
    scopeSlots: {
        ...PlcScopeSlotsOptions,
        default: {} as PlcPropsDefault,                  // 列内容默认渲染函数
    },
    emits: {
        ...PlcEmitsOptions,
    },
    setup({props, slots, scopeSlots, event}) {
        return useExternalPlc({
            props, scopeSlots, event, slots, defaultScopeSlots: {
                head: () => '操作',
                normal: (scope) => {
                    if (scopeSlots.default.isExist()) {return scopeSlots.default(scope)}
                    return scopeSlots.normal(scope)
                },
                summary: () => '',
            }
        })
    },
})

export default PlcOperator
