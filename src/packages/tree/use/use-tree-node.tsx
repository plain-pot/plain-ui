import {computed, getCurrentInstance, inject, reactive} from "@vue/composition-api";
import {TREE_PROVIDER, UseTreeReturnType} from "@/packages/tree/use/use-tree";
import {TreeNode} from "@/packages/tree/utils/TreeNode";

import {$plain} from "@/packages/base";

export const TreeNodeProps = {
    treeNode: {type: TreeNode, default: ({} as TreeNode)},
}

export function useTreeNode(props: ExtractPropTypes<typeof TreeNodeProps>) {
    const tree = inject(TREE_PROVIDER) as UseTreeReturnType

    const state = reactive({
        init: !tree.props.renderAfterExpand,
        show: !tree.props.renderAfterExpand,
    })

    /*---------------------------------------computer-------------------------------------------*/

    const isExpand = computed(() => {
        let isExpand = props.treeNode.isExpand
        if (!state.init && !!isExpand) {
            state.init = true
            $plain.nextTick(() => state.show = true)
        }
        return isExpand
    })

    const classes = computed(() => [
        'pl-tree-node',
        {
            'pl-tree-node-expand': isExpand.value,
            'pl-tree-node-current': props.treeNode.key === tree.current.value,
            'pl-tree-node-drop-inner': tree.dragState.state.dropInnerKey === props.treeNode.key
        },
    ])

    function getStyles() {
        const level = props.treeNode.level - 1

        const contentPaddingLeft = (() => {
            let paddingLeft = tree.props.intent * level + 6
            paddingLeft += 18
            if (tree.props.showCheckbox) {
                paddingLeft += 24
            }
            return paddingLeft
        })();

        const contentStyles = (() => ({
            paddingLeft: `${contentPaddingLeft}px`
        }))();

        const expanderStyles = (() => {
            let paddingLeft = tree.props.intent * level + 6
            return {
                paddingLeft: `${paddingLeft}px`
            }
        })();

        return {
            expanderStyles,
            contentStyles,
        }
    }

    function getEmptyTextStyle() {
        const level = props.treeNode.level - 1
        return {
            paddingLeft: `${tree.props.intent * level + 6 + 6 + 14}px`
        }
    }

    /*---------------------------------------methods-------------------------------------------*/

    const ctx = getCurrentInstance()!
    const h = ctx.$createElement

    const methods = {
        getTreeNodeWrapper: () => {

            const {expanderStyles, contentStyles} = getStyles()

            return (
                <div class="pl-tree-node-wrapper">
                    <div class="pl-tree-node-operator" style={expanderStyles}>
                            <span class="pl-tree-node-expander">
                                {
                                    props.treeNode.isLoading ?
                                        <pl-loading type="beta"/>
                                        :
                                        (!props.treeNode.isLeaf && <pl-icon icon={tree.props.expandIcon || 'el-icon-arrow-right'} onClick={e => tree.handler.clickExpandIcon(e, props.treeNode)} class="pl-tree-expand-icon"/>)
                                }
                            </span>
                        {!!tree.props.showCheckbox && <pl-checkbox-indeterminate
                            checkboxProps={{value: props.treeNode.checkStatus === 'check'}}
                            status={props.treeNode.checkStatus}
                            disabled={!props.treeNode.isCheckable}
                            {...{nativeOn: {click: e => tree.handler.clickCheckbox(e, props.treeNode)}}}
                        />}
                    </div>
                    <div class="pl-tree-node-content" onClick={() => tree.handler.clickNodeContent(props.treeNode)} style={contentStyles}>
                        {
                            tree.scopedSlots.default({
                                param: props.treeNode,
                                content: (!!tree.props.renderContent ?
                                    tree.props.renderContent(h, props.treeNode)
                                    :
                                    [
                                        !tree.props.nodeIcon ? null : <pl-icon icon={tree.props.nodeIcon(props.treeNode)}/>,
                                        <span class="pl-tree-node-label">{props.treeNode.label}</span>
                                    ])
                            })
                        }
                    </div>
                </div>
            )
        }
    }

    return {
        tree,
        state,

        isExpand,
        classes,
        ctx,
        h,
        methods,
        getEmptyTextStyle,
    }
}