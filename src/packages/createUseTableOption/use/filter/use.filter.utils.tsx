import {iFilterOption, iFilterTargetOption} from "../../../PlFilter/FilterConfig";
import {tPlc} from "../../../PlTable/plc/utils/plc.type";
import {PlainObject} from "../../createUseTableOption.utils";
import PlForm from "../../../PlForm";
import PlFormItem from "../../../PlFormItem";
import PlFilter from "../../../PlFilter";
import {VueNode} from "plain-ui-composition";

export type iFilterStateDataMap = Record<string, iFilterOption>
export type iFilterCacheData = Omit<iFilterOption, 'filterConfig' | 'plc'>
export type iFilterCacheDataMap = Record<string, iFilterCacheData>

export function createFilterOptionByPlc(plc: tPlc): iFilterOption {
    return {
        label: plc.props.title!,
        field: plc.props.field!,
        handlerName: plc.props.filterHandler,
        filterName: plc.props.filterName,
        value: null,
        plc: plc,
        filterConfig: plc.props.filterConfig,
    }
}

export const renderFtoForm = (
    {
        ftoArr,
        formData,
        formAttrs,
        onConfirm,
    }: {
        ftoArr: iFilterTargetOption[],
        formData: PlainObject,
        formAttrs?: PlainObject,
        onConfirm: () => void,
    }): VueNode => {

    return (
        <PlForm
            modelValue={formData}
            {...{
                column: 3,
                contentWidth: 260,
                labelAlign: 'right',
                ...formAttrs,
                style: {padding: '0 24px 0 8px'},
            }}>
            {ftoArr.map((fto, index) => (
                <PlFormItem label={fto.option.label} key={index}>
                    <PlFilter
                        fto={fto}
                        key={fto.filter.filterName + fto.handler.handlerName}
                        hideSearchButton
                        block
                        onConfirm={onConfirm}
                    />
                </PlFormItem>
            ))}
        </PlForm>
    )
}
