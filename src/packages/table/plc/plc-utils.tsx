import {PlcType} from "@/packages/table/plc/plc";
import {PlcGroupType} from "@/packages/table/plc/plc-group";

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
    ...PlcGroupProps,
    field: {type: String},                                                  // 列绑定字段
    width: {type: [String, Number], default: '120'},                        // 列宽度
    fit: {type: Number, default: 0},                                        // 当列不满表格宽度时，该列所占剩下宽度的权重

    // search: {type: Boolean, default: true},                              // 可查询
    // searchType: {type: String, default: 'input'},                        // 查询类型
    // searchField: {type: String},                                         // 查询字段
    //
    // sort: {type: Boolean, default: true},                                // 可排序
    // sortField: {type: String},                                           // 排序字段
    //
    // editable: {type: Boolean, default: true},                            // 是否可编辑
    // editableFunc: {type: Function},                                      // 是否可编辑判断函数
    //
    // formatter: {type: Function},                                         // 文本格式化函数，支持异步格式化
    // tooltip: {type: Boolean},                                            // 是否tooltip显示文本
    // link: {type: Boolean},                                               // 是否以超链接的形式展示文本，并且点击的时候回派发事件
    // showInDialog: {type: Boolean},                                       // 非编辑状态下是否点击后再dialog中显示
    //
    // required: {type: Boolean},                                           // 是否必输
    // rules: {type: Array},                                                // 校验规则
    //
    // /*---------------------------------------不可配置信息-------------------------------------------*/
    // scopedSlots: {type: Object},                                         // 作用域插槽
    // renderNormal: {type: Function},                                      // 渲染函数:非编辑状态
    // renderEdit: {type: Function},                                        // 渲染函数：编辑状态
    // renderHead: {type: Function},                                        // 渲染函数：列头
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

/**
 * 遍历plc数组
 * @author  韦胜健
 * @date    2020/6/9 20:58
 */
function iteratePlc(list: (PlcType | PlcGroupType)[] | null, fn: ((plc: PlcType) => HandlePlcType)): void {

    list = list || [];

    for (let i = 0; i < list.length; i++) {
        let item = list[i];

        switch (item.type) {
            case PlcComponentType.PLC:
                item = item as PlcType
                const handlePlcType = fn(item)
                if (handlePlcType === HandlePlcType.remove) {
                    list.splice(i, 1)
                    i--
                }
                break
            case PlcComponentType.GROUP:
                item = item as PlcGroupType
                iteratePlc(item.items.value, fn)

                // 当这个分组没有列的时候（可能都隐藏了），自动删除这个分组
                if (item.items.value.length === 0) {
                    list.splice(i, 1)
                    i--
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
export function handlePlcConfigAndState(items: (PlcType | PlcGroupType)[], config?: Function) {

    const configData = !!config ? config(items) : {}

    iteratePlc(items, (item) => {
        // config
        const id = `${item.props.field || ''}_${item.props.title}`
        if (!!configData[id]) {
            Object.assign(item.props, configData[id])
        }
        // state
        Object.keys(item.state).forEach(key => {
            if (item.state[key] != null) item.props[key] = item.state[key]
        })

        // 如果是隐藏的列，则删除这一列
        if (item.props.hide) {
            return HandlePlcType.remove
        }

        return HandlePlcType.nothing
    })

    return items
}