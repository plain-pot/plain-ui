import {TableNode} from "../../PlTable/table/use/useTableNode";
import {deepcopy} from "plain-utils/object/deepcopy";

export function cloneTableNode(node: TableNode) {
    return deepcopy(node)
}