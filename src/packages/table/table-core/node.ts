import {TreeNode} from "../../tree/core/type";
import {FormValidate, FormValidateResult, FormValidateReturn} from "../../form/form.validate";
import {SimpleObject} from "../../../shims";

export type TableNode = TreeNode & {
    isSummaryData: boolean,                         // 当前是否为合计行数据
    edit: boolean,                                  // 当前是否处于可编辑状态
    editRow: SimpleObject,                          // 编辑行对象
    validateResult: FormValidateResult,             // 当前行的校验结果
    getRules: () => FormValidate,                   // 获取校验规则

    openEdit: () => void,
    closeEdit: () => void,
    enableEdit: () => void,
    cancelEdit: () => void,
    validate: () => Promise<FormValidateReturn>,
    saveEdit: () => void,
}
