import {computed, designComponent, useRefs, useStyles} from 'plain-design-composition'
import './tree.scss'
import {TreeProps} from "./utils/props";
import {useTree} from "./core/useTree";
import {TreeNode} from "./utils/type";
import PlVirtualList from "../PlVirtualList";
import {PlScroll} from "../PlScroll";
import {createKeyHandler} from "../../utils/createKeyHandler";
import {useTreeDraggier} from "./core/useTreeDraggier";
import {delay} from "plain-utils/utils/delay";
import {TreeUtils} from "./utils/tree.utils";
import {} from "plain-design-composition";

import {PlCheckbox} from '../PlCheckbox';
import PlLoading from "../PlLoading";
import PlIcon from "../PlIcon";
import {createEventListener} from "plain-design-composition"
import {PlLoadingMask} from "../PlLoadingMask";

export const PlTree = designComponent({
    name: 'pl-tree',
    props: {
        ...TreeProps,
    },
    emits: useTree.createEvent<TreeNode>(),
    scopeSlots: {
        default: (scope: { node: TreeNode, index: number }) => {},
    },
    setup({props, scopeSlots, event}) {

        const {emit} = event
        const {refs, onRef} = useRefs({list: PlVirtualList, scroll: PlScroll,})
        const {state, methods, current, handler, utils} = useTree<TreeNode>({props, emit, keyManager: createKeyHandler('tree'),})

        /*tree node content公共的样式*/
        const contentStyles = useStyles(style => {style.height = `${props.nodeHeight}px`})
        /**
         * 拍-平的树形数据（不拍平无法实现虚拟滚动）
         * @author  韦胜健
         * @date    2020/12/2 12:16
         */
        const flatList = computed(() => {
            let result: (TreeNode)[] = []
            if (!state.root) {
                return []
            }
            utils.iterate({
                nodes: state.root.children,
                iterateChildren: (treeNode) => treeNode.expand,
                handler: (treeNode) => {
                    result.push(treeNode)
                    // console.log(treeNode.label, {'!treeNode.isLeaf': !treeNode.isLeaf, 'treeNode.loaded': treeNode.loaded, 'treeNode.isVisible': treeNode.isVisible, 'treeNode.expand': treeNode.expand, 'treeNode.children': treeNode.children,})
                    if (
                        !treeNode.isLeaf &&
                        treeNode.loaded &&
                        treeNode.isVisible &&
                        treeNode.expand &&
                        treeNode.children!.length === 0
                    ) {
                        result.push({
                            key: `@@empty_${treeNode.key}`,
                            parentRef: () => treeNode,
                            empty: true,
                            level: treeNode.level + 1,
                        } as TreeNode)
                    }
                },
            },)
            result = result.filter((treeNode) => treeNode.empty ? true : !!treeNode.isVisible)
            result.forEach((node, index) => node.index = index)
            return result
        })

        const exposeMethods = {
            ...methods,
            ...methods.expandMethods,
            ...methods.checkMethods,
            ...methods.treeNodeMethods,
        }

        /*---------------------------------------draggier-------------------------------------------*/

        const draggier = useTreeDraggier<TreeNode>({
            rowClass: 'pl-tree-node',
            dragClass: 'pl-tree-node-draggier',
            flatList,
            getScroll: () => props.virtual ? refs.list!.refs.scroll! : refs.scroll!,
            props,
            methods: {
                ...exposeMethods,
                refreshCheckStatus: async () => {
                    await delay(120)
                    flatList.value.forEach(methods.checkMethods.refreshCheckStatus)
                },
            },
        })

        const render = {
            node: (node: TreeNode, index: number) => {
                if (node.empty) {
                    return render.empty(node)
                }
                return (
                    <div
                        key={node.key}
                        class={(TreeUtils.getTreeNodeClasses(node, current.value))}
                        style={TreeUtils.getTreeNodeStyles(node.level, props.intent, props.nodeHeight)}
                        {...{vid: index}}>

                        <div class="pl-tree-node-operator">
                            {!!props.showCheckbox && <PlCheckbox
                                checkStatus={node.checkStatus}
                                disabled={!node.isCheckable}
                                {...{onClick: (e?: MouseEvent) => handler.onClickCheckbox(e, node)}}
                            />}
                            <div class="pl-tree-node-expander">
                                {node.loading ?
                                    <PlLoading type="gamma"/> :
                                    <PlIcon icon={node.isLeaf ? props.leafIcon : node.expand ? props.folderExpandIcon : props.folderCollapseIcon}
                                            {...createEventListener({onClick: (e: MouseEvent) => handler.onClickExpandIcon(e, node)})}/>
                                }
                            </div>
                            {!!props.draggable && <PlIcon icon="el-icon-list" class="pl-tree-node-draggier"
                                                          {...createEventListener({onMousedown: draggier.handler.mousedown})}/>}
                            {!!props.nodeIcon && <PlIcon icon={props.nodeIcon(node)}/>}
                        </div>
                        <div class="pl-tree-node-content"
                             style={contentStyles.value}
                             onClick={(e: MouseEvent) => handler.onClickCell(e, node)}>
                            {scopeSlots.default({node, index}, !!props.renderContent ? props.renderContent({node, index}) : node.label)}
                        </div>
                    </div>
                )
            },
            empty: (emptyNode: TreeNode) => {
                const parent = emptyNode.parentRef()!
                return (
                    <div
                        key={`${parent.key}_empty`}
                        class="pl-tree-node pl-tree-empty-node"
                        style={TreeUtils.getTreeNodeStyles(parent.level + 1, props.intent, props.nodeHeight)}>
                        <div class="pl-tree-node-operator">
                            <div class="pl-tree-node-expander">
                                <PlIcon icon="el-icon-close-bold"/>
                            </div>
                        </div>
                        <div class="pl-tree-node-content" style={contentStyles.value}>
                            <span>{props.emptyText}</span>
                        </div>
                    </div>
                )
            },
        }

        return {
            refer: {
                ...exposeMethods,
            },
            render: () => {
                return (
                    <div class="pl-tree" style={{height: props.height, width: props.width}}>
                        {flatList.value.length === 0 ? (
                            <div class="pl-tree-placeholder" key="placeholder">
                                <PlIcon icon="el-icon-folder-opened"/>
                                <span>{props.emptyText}</span>
                            </div>
                        ) : (
                            props.virtual ?
                                (<PlVirtualList
                                    ref={onRef.list}
                                    data={flatList.value}
                                    size={props.nodeHeight}
                                    v-slots={{
                                        content: ({data}: { data: { item: TreeNode, index: number }[] }) => (
                                            <div class="pl-tree-node-list">
                                                {data.map(({item, index}) => render.node(item, index))}
                                            </div>
                                        )
                                    }}
                                />) : (
                                    <PlScroll ref={onRef.scroll}>
                                        <div class="pl-tree-node-list">
                                            {flatList.value.map((node, index) => render.node(node, index))}
                                        </div>
                                    </PlScroll>
                                )
                        )}
                        <PlLoadingMask modelValue={props.loading || (!!state.root && state.root.loading)}/>
                    </div>
                )
            }
        }
    },
})

export default PlTree
