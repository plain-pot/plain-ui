import {TreeNode, TreePropsType} from "./type";
import {useTree} from "../core/useTree";
import {PropType} from "plain-design-composition";

export const TreeProps = {
    ...useTree.createProps<TreeNode>(),
    /*基础属性*/
    loading: {type: Boolean},                                                   // 当前是否处于loading状态
    nodeIcon: {type: Function as PropType<TreePropsType.nodeIcon>},             // 节点图标
    nodeHeight: {type: Number, default: 40},                                    // 节点高度
    height: {type: String, default: '100%'},                                    // 容器高度
    width: {type: String, default: '100%'},                                     // 容器高度
    /*普通属性*/
    renderContent: {type: Function as PropType<TreePropsType.renderContent>},   // 树节点内容渲染函数
    /*展开相关属性*/
    emptyText: {type: String, default: '暂无数据'},                              // 没有子节点的时候展示的文本
    intent: {type: Number, default: 22},                                        // 相邻级节点水平缩进距离，默认16，单位px
    /*拖拽属性*/
    draggable: {type: Boolean},                                                 // 是否可拖拽
    allowDrag: {type: Function as PropType<TreePropsType.allowDrag>},           // 判断节点是否可以拖拽
    allowDrop: {type: Function as PropType<TreePropsType.allowDrop>},           // 判断目标节点能够被放置

    folderCollapseIcon: {type: String, default: 'el-icon-folder-s'},            //节点收起时展示的图标
    folderExpandIcon: {type: String, default: 'el-icon-folder-opened'},         //节点展开时显示的图标
    leafIcon: {type: String, default: 'el-icon-document'},                      // 叶子节点显示的图标

    virtual: {type: Boolean},                                                   // 是否开启虚拟滚动
}