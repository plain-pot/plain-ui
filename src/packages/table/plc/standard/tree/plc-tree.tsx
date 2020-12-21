import {designPlc} from "../../core/designPlc";
import {PropType} from 'vue';
import {TableNode} from "../../../core/useTableNode";
import {TreeDropType} from "../../../../tree/utils/tree-constant";
import {injectPlainTable} from "../../../table";

/*只显示展开收起按钮的时候的基本宽度，不算content宽度*/
const size = 30

export default designPlc({
    name: 'plc-tree',
    standardProps: {
        autoFixedLeft: {default: true},
        noPadding: {default: true},
        order: {default: -9996},
        width: {default: size},
    },
    externalProps: {
        contentWidth: {type: Number, default: 100},                         // 显示的内容宽度
        showCheckbox: {type: Boolean},                                      // 是否显示复选框
        rowDraggable: {type: Boolean},                                      // 行是否可以拖拽排序
        allowRowDraggable: {type: Function as PropType<(node: TableNode) => boolean>},// 行是否可以被拖拽放置到其他位置
        allowRowDroppable: {type: Function as PropType<(startNode: TableNode, moveNode: TableNode, dropType: TreeDropType) => boolean>},// 行是否可以被放置（放到子节点中，放到前面，放到后面）
    },
    setup(props) {
        const {} = injectPlainTable()

    },
})