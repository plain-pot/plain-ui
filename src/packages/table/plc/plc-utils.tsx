import {PlcType} from "@/packages/table/plc/plc";
import {PlcGroupType} from "@/packages/table/plc/plc-group";
import {$plain} from "@/packages/base";
import {TableNode} from "@/packages/table/table/TableNode";

export const PlcGroupProps = {
    title: {type: String},                                                  // 列标题
    align: {type: String, default: 'left'},                                 // 非编辑状态下文本对其方式

    hide: {type: Boolean},                                                  // 是否隐藏
    order: {type: Number},                                                  // 列排序
    fixed: {type: String, default: 'center'},                               // 冻结列位置：left、right、undefined
    autoFixedLeft: {type: Boolean},                                         // 当出现左固定列的时候，是否自动设置为左固定列
    autoFixedRight: {type: Boolean},                                        // 当出现右固定列的时候，是否自动设置为右固定列
}

export const PlcProps = {

    // 基础属性
    ...PlcGroupProps,
    field: {type: String},                                                  // 列绑定字段
    width: {type: [String, Number], default: '120'},                        // 列宽度
    fit: {type: Number, default: 0},                                        // 当列不满表格宽度时，该列所占剩下宽度的权重
    notFitVirtual: {type: Boolean},                                         // 是否不兼容表格的虚拟滚动功能

    // 渲染函数
    head: {type: Function},                                                 // 列标题渲染函数
    default: {type: Function},                                              // 列内容默认渲染函数
    summary: {type: Function},                                              // 列内容在合计行上的渲染函数
    edit: {type: Function},                                                 // 列内容在编辑状态下的渲染函数

    // 编辑相关
    required: {type: Boolean},                                              // 是否必填
    rules: {type: [Object, Array]},                                         // 校验规则
    editable: {type: [Boolean, Function], default: true},                   // 是否可编辑
    addEditPadding: {type: Boolean},                                        // 处于编辑状态的时候，是否添加内编辑，只有当行状态为编辑状态，并且列有edit渲染函数或者作用域插槽时，才符合“处于编辑状态”的条件

    // search: {type: Boolean, default: true},                              // 可查询
    // searchType: {type: String, default: 'input'},                        // 查询类型
    // searchField: {type: String},                                         // 查询字段
    // sort: {type: Boolean, default: true},                                // 可排序
    // sortField: {type: String},                                           // 排序字段

    // formatter: {type: Function},                                         // 文本格式化函数，支持异步格式化
    // linkText: {type: Boolean},                                           // 是否以超链接的形式展示文本，并且点击的时候回派发事件
}

export const PLC_COLLECTOR = '@@PLC_COLLECTOR'

export const enum PlcComponentType {
    PLC = 'PLC',
    GROUP = 'GROUP',
}

export const enum PlcFixedType {
    left = 'left',
    center = 'center',
    right = 'right',
}

export const enum PlcAlign {
    left = 'left',
    center = 'center',
    right = 'right'
}

const enum HandlePlcType {
    remove = 'remove',
    nothing = 'nothing'
}

export const PlcComponentPublicData = {
    level: 0,
    rowspan: 1,
    colspan: 1,
} as {
    level?: number,
    rowspan?: number,
    colspan?: number
}

function copyPlcList(items: (PlcType | PlcGroupType)[]) {
    const newItems: (PlcType | PlcGroupType)[] = []
    items.forEach((item) => {
        const newItem = {...item}
        if (item.type === PlcComponentType.GROUP) {
            (newItem as PlcGroupType).items.value = copyPlcList((newItem as PlcGroupType).items.value)
        }
        newItems.push(newItem)
    })

    return newItems
}

function getPlcOrder(item: PlcType | PlcGroupType): number {
    let order = item.props.order || 0
    if (item.props.fixed === PlcFixedType.left) {
        order -= 9999
    } else if (item.props.fixed === PlcFixedType.right) {
        order += 9999
    }
    return Number(order)
}

/**
 * 遍历plc数组
 * @author  韦胜健
 * @date    2020/6/9 20:58
 */
function iteratePlc({list, handlePlc, handleGroup}: {
    list: (PlcType | PlcGroupType)[] | null,
    handlePlc: (plc: PlcType) => HandlePlcType,
    handleGroup: (group: PlcGroupType) => HandlePlcType,
}): void {

    list = list || [];

    for (let i = 0; i < list.length; i++) {
        let item = list[i];

        switch (item.type) {
            case PlcComponentType.PLC:
                item = item as PlcType
                const handlePlcResult = handlePlc(item)
                if (handlePlcResult === HandlePlcType.remove) {
                    list.splice(i, 1)
                    i--
                }
                break
            case PlcComponentType.GROUP:
                item = item as PlcGroupType
                const handlePlcGroupResult = handleGroup(item)
                if (handlePlcGroupResult === HandlePlcType.remove) {
                    list.splice(i, 1)
                    i--
                } else {
                    iteratePlc({list: item.items.value, handlePlc, handleGroup})

                    // 当这个分组没有列的时候（可能都隐藏了），自动删除这个分组
                    if (item.items.value.length === 0) {
                        list.splice(i, 1)
                        i--
                    }
                }
                break
            default:
                console.warn(item)
                throw new Error(`can't recognise plc type:${item.type}`)
        }
    }
}

/**
 * 合并 props，config以及state，优先级依次增大
 * @author  韦胜健
 * @date    2020/6/10 14:32
 */
export function handlePlcConfigAndState(items: (PlcType | PlcGroupType)[], config: Function | undefined, tableWidth: number) {

    items = copyPlcList(items)

    const configData = !!config ? config(items) : {}            // 通过 table.props.config 得到的列配置信息对象
    let notFitVirtualPlcList: PlcType[] = []                    // 是否不兼容虚拟滚动的列
    const autoFixedLeftPlcList: PlcType[] = []                  // 需要自动做固定的plc
    const autoFixedRightPlcList: PlcType[] = []                 // 需要自动右固定的plc
    let hasFixedLeft = false                                    // 是否存在左固定列
    let hasFixedRight = false                                   // 是否存在右固定列

    /**
     * - 根基plc的config，计算plc的属性。
     * - 计算出需要自动左固定的plc，自动右固定的plc，左固定的plc，右固定的plc；以及计算出不兼容虚拟滚动的plc；
     * - 如果group设置了自动左右固定或者左右固定，那么他的子组件plc或者group也要改成和父group一致的值；
     * - 将隐藏的plc从group的子节点数据中移除
     * @author  韦胜健
     * @date    2020/8/12 10:24
     */
    iteratePlc({
        list: items,
        handlePlc: (plc) => {

            // config
            const configPlc = configData[`${plc.props.field || ''}_${plc.props.title}`]
            if (!!configPlc) {
                Object.keys(configPlc).forEach(key => {
                    if (configPlc[key] != null) plc.props[key] = configPlc[key]
                })
            }
            // state
            Object.keys(plc.state).forEach(key => {
                if (plc.state[key] != null) plc.props[key] = plc.state[key]
            })

            // 如果是隐藏的列，则删除这一列
            if (plc.props.hide) {
                return HandlePlcType.remove
            }

            if (plc.props.notFitVirtual) notFitVirtualPlcList.push(plc)
            if (plc.props.autoFixedLeft) autoFixedLeftPlcList.push(plc)
            if (plc.props.autoFixedRight) autoFixedRightPlcList.push(plc)
            if (plc.props.fixed === PlcFixedType.left) hasFixedLeft = true
            if (plc.props.fixed === PlcFixedType.right) hasFixedRight = true

            return HandlePlcType.nothing
        },
        handleGroup: (group) => {

            if (group.props.hide) {
                return HandlePlcType.remove
            }

            // 表头分组，子节点的固定方式，以及左固定、右固定随父节点控制
            group.items.value.forEach(item => {
                if (item.type === PlcComponentType.PLC) {
                    const plc = item as PlcType
                    plc.props.fixed = group.props.fixed
                    plc.props.autoFixedLeft = group.props.autoFixedLeft
                    plc.props.autoFixedRight = group.props.autoFixedRight
                } else {
                    const plcGroup = item as PlcGroupType
                    plcGroup.props.fixed = group.props.fixed
                    plcGroup.props.autoFixedLeft = group.props.autoFixedLeft
                    plcGroup.props.autoFixedRight = group.props.autoFixedRight
                }
            })

            return HandlePlcType.nothing
        },
    })

    // hasFixedLeft 以及 hasFixedLeft仅支持 plc，group不支持
    if (hasFixedLeft) autoFixedLeftPlcList.forEach(plc => plc.props.fixed = PlcFixedType.left)
    if (hasFixedRight) autoFixedRightPlcList.forEach(plc => plc.props.fixed = PlcFixedType.right)

    const flatPlcList: PlcType[] = []                           // 平级的plc对象数组，不包含group，顺序严格按照 plc在代码中的位置-plc的props.order-plc.props.fixed顺序确定
    const fitPlcList: PlcType[] = []                            // 需要自适应宽度的 plc对象数组
    let totalFits: number = 0                                   // 填充宽度分配总份数
    let externalWidth = tableWidth                              // 剩余的列宽

    /**
     * - 根据 order、fixed排序
     * - 算出总的fit、剩余的externalWidth宽度
     * @author  韦胜健
     * @date    2020/8/12 10:26
     */
    iteratePlc({
        list: [{type: PlcComponentType.GROUP, items: {value: items}} as any],
        handlePlc: (plc) => {
            flatPlcList.push(plc)

            if (!!plc.props.fit) {
                totalFits += plc.props.fit
                fitPlcList.push(plc)
            } else {
                externalWidth -= plc.props.width as number
            }

            return HandlePlcType.nothing
        },
        handleGroup: (group) => {
            $plain.utils.insertSort(group.items.value, (a, b) => getPlcOrder(a) > getPlcOrder(b))
            return HandlePlcType.nothing
        }
    })

    // 剩余宽度还大于0
    if (externalWidth > 0) {
        // 如果没有自适应宽度的列，则默认最后一列自适应宽度
        if (totalFits === 0) {
            totalFits = 1
            const lastPlc = flatPlcList[flatPlcList.length - 1]
            fitPlcList.push(lastPlc)
            externalWidth += lastPlc.props.width as number
        }
        const fitBlockWidth = Math.floor(externalWidth / totalFits)
        fitPlcList.forEach((plc, index) => {
            if (index === fitPlcList.length - 1) {
                // 如果是最后一个，用完剩下的宽度
                plc.props.width = externalWidth - 1
                externalWidth = 0
            } else {
                // 根据fit分配宽度
                const newWidth = plc.props.fit * fitBlockWidth
                plc.props.width = newWidth
                externalWidth -= newWidth
            }
        })
    }

    return {
        notFitVirtualPlcList,
        plcList: items,
        flatPlcList,
        flatPlcLength: flatPlcList.length,
        hasFixedLeft,
        hasFixedRight,
    }
}

export function getCellClass(plc: PlcType, rowData?: TableNode) {
    return [
        `plt-cell-align-${plc.props.align || PlcAlign.left}`,
        {
            'pl-cell-group': plc.type === PlcComponentType.GROUP,
        }
    ]
}