import {PlcType} from "@/packages/table/plc/plc";
import {PlcGroupType} from "@/packages/table/plc/plc-group";
import {PlcComponentType, PlcFixedType} from "@/packages/table/plc/plc-utils";
import {HandlePlcType, iteratePlc} from "@/packages/table/plc/format/utils";

/**
 * 复制一份plc，并且处理config以及state
 * @author  韦胜健
 * @date    2020/8/15 19:12
 */
export function configAndStatePlc(
    {
        items,
        config
    }: {
        items: (PlcType | PlcGroupType)[],                              // plc列原始数据
        config: Function | undefined,                                   // 配置plc的函数
    }) {

    const configData = !!config ? config(items) : {}                    // 通过 table.props.config 得到的列配置信息对象

    const plcList = {
        notFitVirtual: [] as (PlcType | PlcGroupType)[],
        fixedLeft: [] as (PlcType | PlcGroupType)[],
        fixedRight: [] as (PlcType | PlcGroupType)[],
        autoFixedLeft: [] as (PlcType | PlcGroupType)[],
        autoFixedRight: [] as (PlcType | PlcGroupType)[],
    }

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

            // 如果有config，将config中的属性覆盖props
            const configPlc = configData[`${plc.props.field || ''}_${plc.props.title}`]
            if (!!configPlc) {
                Object.keys(configPlc).forEach(key => {
                    if (configPlc[key] != null) plc.props[key] = configPlc[key]
                })
            }
            // 如果有state，将state中的属性覆盖props
            Object.keys(plc.state).forEach(key => {
                if (plc.state[key] != null) plc.props[key] = plc.state[key]
            })

            // 如果是隐藏的列，则删除这一列
            if (plc.props.hide) {
                return HandlePlcType.remove
            }

            if (plc.props.notFitVirtual) plcList.notFitVirtual.push(plc)
            if (plc.props.autoFixedLeft) plcList.autoFixedLeft.push(plc)
            if (plc.props.autoFixedRight) plcList.autoFixedRight.push(plc)
            if (plc.props.fixed === PlcFixedType.left) plcList.fixedLeft.push(plc)
            if (plc.props.fixed === PlcFixedType.right) plcList.fixedRight.push(plc)

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

    /*---------------------------------------在最终排序的时候，要求fixed是正确的，而跟autoFixedLeft，autoFixedRight的值无关-------------------------------------------*/

    /*如果存在左固定列，则设置autoFixedLeft为左固定*/
    if (plcList.fixedLeft.length > 0) {
        plcList.autoFixedLeft.forEach(plc => plc.props.fixed = PlcFixedType.left)
    }

    /*如果存在右固定列，则设置autoFixedRight为右固定*/
    if (plcList.fixedRight.length > 0) {
        plcList.autoFixedRight.forEach(plc => plc.props.fixed = PlcFixedType.right)
    }

    return plcList
}