import {ExtractPropTypes} from "plain-design-composition";
import {PlcPropsOptions} from "../utils/plc.utils";
import {PlcScopeSlotsOptions, tPlcScopeSlots, tPlcSlots} from "../utils/plc.scope-slots";
import {TableRenderScope, tPlcEvent, tPlcType} from "../utils/plc.type";
import {useBasePlc} from "./useBasePlc";
import {PlainObject} from "plain-utils/utils/event";

type tPlcDefaultScopeSlotsOptions = Partial<typeof PlcScopeSlotsOptions>

export function useExternalPlc({props, slots, scopeSlots, event, defaultScopeSlots, externalRefer}: {
    event: tPlcEvent,
    slots: tPlcSlots,
    props: ExtractPropTypes<typeof PlcPropsOptions>,
    scopeSlots: tPlcScopeSlots,
    defaultScopeSlots?: tPlcDefaultScopeSlotsOptions,
    externalRefer?: PlainObject,
}) {

    const formatScopeSlots: tPlcScopeSlots = {
        ...scopeSlots,
        head: Object.assign((scope: { plc: tPlcType }) => {
            if (scopeSlots.head.isExist()) {
                return scopeSlots.head(scope)
            }
            if (!!defaultScopeSlots && defaultScopeSlots.head) {
                return defaultScopeSlots.head(scope)
            }
            return scope.plc.props.title
        }, {
            isExist: () => {
                if (scopeSlots.head.isExist()) {
                    return true
                }
                if (!!defaultScopeSlots && !!defaultScopeSlots.head) {
                    return true
                }
                return false
            },
        }),
        normal: Object.assign((scope: TableRenderScope) => {
            if (scopeSlots.normal.isExist()) {
                return scopeSlots.normal(scope)
            }
            if (!!defaultScopeSlots && defaultScopeSlots.normal) {
                return defaultScopeSlots.normal(scope)
            }
            return !scope.plc.props.field ? '' : scope.row[scope.plc.props.field]
        }, {
            isExist: () => {
                if (scopeSlots.normal.isExist()) {
                    return true
                }
                if (!!defaultScopeSlots && !!defaultScopeSlots.normal) {
                    return true
                }
                return false
            },
        }),
        edit: Object.assign((scope: TableRenderScope) => {
            if (scopeSlots.edit.isExist()) {
                return scopeSlots.edit(scope)
            }
            if (!!defaultScopeSlots && defaultScopeSlots.edit) {
                return defaultScopeSlots.edit(scope)
            }
            return formatScopeSlots.normal(scope)
        }, {
            isExist: () => {
                if (scopeSlots.edit.isExist()) {
                    return true
                }
                if (!!defaultScopeSlots && !!defaultScopeSlots.edit) {
                    return true
                }
                return false
            },
        }),
        form: Object.assign((scope: TableRenderScope) => {
            if (scopeSlots.form.isExist()) {
                return scopeSlots.form(scope)
            }
            if (!!defaultScopeSlots && defaultScopeSlots.form) {
                return defaultScopeSlots.form(scope)
            }
            return formatScopeSlots.edit(scope)
        }, {
            isExist: () => {
                if (scopeSlots.form.isExist() || scopeSlots.edit.isExist()) {
                    return true
                }
                if (!!defaultScopeSlots && (!!defaultScopeSlots.form || !!defaultScopeSlots.edit)) {
                    return true
                }
                return false
            },
        }),
        summary: Object.assign((scope: TableRenderScope) => {
            if (scopeSlots.summary.isExist()) {
                return scopeSlots.summary(scope)
            }
            if (!!defaultScopeSlots && defaultScopeSlots.summary) {
                return defaultScopeSlots.summary(scope)
            }
            return formatScopeSlots.normal(scope)
        }, {
            isExist: () => {
                if (scopeSlots.summary.isExist()) {
                    return true
                }
                if (!!defaultScopeSlots && !!defaultScopeSlots.summary) {
                    return true
                }
                return false
            },
        }),
    }

    const {render, refer} = useBasePlc({
        props, event, slots,
        scopeSlots: formatScopeSlots,
    })

    return {render, refer: Object.assign(refer, externalRefer)}
}
