import {computed, defineComponent, getCurrentInstance, reactive, watch} from "@vue/composition-api";
import {CascadeContextType, CascadeMarkAttr, CascadePanelProps} from "@/packages/cascade/cascade-constant";
import {EmitFunc, useEvent} from "@/use/useEvent";
import {useModel} from "@/use/useModel";
import {CascadeNode} from "@/packages/cascade/CascadeNode";
import {CascadeMark} from "@/packages/cascade/CascadeMark";
import {$plain} from "@/packages/base";
import {useScopedSlots} from "@/use/useScopedSlots";

export default defineComponent({
    name: 'pl-cascade-panel',
    props: {
        ...CascadePanelProps,
    },
    setup(props,) {

        const {scopedSlots} = useScopedSlots({
            default: {node: CascadeNode, index: Number}
        })

        const ctx = getCurrentInstance()!

        const h = ctx.$createElement

        const {emit} = useEvent({
            input: (expandKeys: string[] | null, nodes?: CascadeNode[]) => undefined,
            clickItem: EmitFunc,
            getChildren: EmitFunc,
            updateData: EmitFunc,
        })

        /*---------------------------------------state-------------------------------------------*/

        const model = useModel(() => props.value, emit.input, false)
        const data = useModel(() => props.data, emit.updateData)
        const mark = new CascadeMark(props as CascadeContextType)
        const rootNode = new CascadeNode({[props.childrenField!]: data.value}, props as CascadeContextType, 0, null, mark)

        const state = reactive({
            loading: false,
            expandKeys: [] as string[],
            rootNode,
            mark,
        })

        // @ts-ignore
        props.expandKeys = state.expandKeys

        /*---------------------------------------computer-------------------------------------------*/

        const formatData = computed(() => rootNode.children)

        const cascadeData = computed(() => {
            const data = formatData.value || []
            if (data.length === 0) return []
            let expandKeys: string[] = []
            if (!!state.expandKeys && state.expandKeys.length > 0) {
                expandKeys = state.expandKeys
            } else if (!!model.value && model.value.length > 0 && !props.lazy) {
                expandKeys = model.value as string[]
            }

            let children = data as CascadeNode[]
            let cascadeData: CascadeNode[][] = []

            cascadeData.push(children)

            expandKeys.forEach((key: string) => {
                for (let i = 0; i < children.length; i++) {
                    const child = children[i];
                    if (child.key === key && !child.isLeaf) {
                        children = child.children || []
                        cascadeData.push(children)
                        break
                    }
                }
            })

            return cascadeData
        })

        const filterData = computed(() => {
            let filterData: CascadeNode[][] = []
            utils.iterateAll((formatData.value || []) as CascadeNode[], (node: CascadeNode) => {
                if (node.isPassFilter && (node.isLeaf || props.selectBranch)) {
                    filterData.push(node.filterData)
                }
            })
            return filterData
        })

        const expandNodes = computed(() => {
            if (!state.expandKeys) return []
            let result: CascadeNode[] = []
            let nodes = formatData.value || []

            state.expandKeys.forEach((key: string) => {
                for (let i = 0; i < nodes.length; i++) {
                    const child = nodes[i];
                    if (child.key === key) {
                        result.push(child)
                        if (!child.children || child.children.length === 0) {
                            break
                        } else {
                            nodes = child.children
                        }
                    }
                }
            })
            return result
        })

        /*---------------------------------------utils-------------------------------------------*/

        const utils = {
            /**
             * 检查props是否合法
             * @author  韦胜健
             * @date    2020/3/30 18:48
             */
            checkProps() {
                if (!props.data) return true
                if (!props.keyField) {
                    console.error('pl-cascade 的 keyField属性不能为空，每一条记录必须要有一个key标识')
                    return false
                }
                if (!props.childrenField) {
                    console.error('pl-cascade 的 childrenKey不能为空')
                    return false
                }
                return true
            },
            iterateAll: (nodes: CascadeNode[], fn: Function, iterateChildren?: Function) => {
                if (!nodes) return
                nodes.forEach(node => {
                    fn(node)
                    if (!!node.children && (!iterateChildren || iterateChildren(node))) {
                        utils.iterateAll(node.children, fn, iterateChildren)
                    }
                })
            },
            getChildrenAsync(node: CascadeNode): Promise<CascadeNode[]> {
                return new Promise((resolve) => {
                    if (!node.key) {
                        state.loading = true
                    } else {
                        mark.setMark(node.key, CascadeMark.loading, true)
                    }
                    props.getChildren!(node, (...results) => {
                        if (!node.key) {
                            state.loading = false
                        } else {
                            mark.setMark(node.key, CascadeMark.loading, false)
                            mark.setMark(node.key, CascadeMark.loaded, true)
                        }
                        emit.getChildren(...results)
                        resolve(...results)
                    })
                })
            },
            async initLazy() {
                if (!props.lazy) {
                    return
                }
                data.value = await utils.getChildrenAsync(rootNode)
                rootNode.setChildren(data.value as any[])
            },
        }

        /*---------------------------------------handler-------------------------------------------*/

        const handler = {
            mouseenterItem: $plain.utils.debounce((node: CascadeNode) => {
                if (props.trigger === 'hover') {
                    methods.expand(node)
                }
            }, props.hoverDebounce),
            clickItem: async (node: CascadeNode) => {
                if (props.trigger === 'click') {
                    await methods.expand(node)
                }

                if (node.nodeDisabled) return
                if (node.isLeaf || props.selectBranch) {
                    model.value = state.expandKeys
                    emit.input(model.value as string[], expandNodes.value as CascadeNode[])
                }
                emit.clickItem(node)
            }
        }

        /*---------------------------------------methods-------------------------------------------*/

        const methods = {
            expand: async (node: CascadeNode) => {
                if (!node.isExpand) {
                    state.expandKeys = node.expandKeys

                    if (
                        props.lazy &&                                            // 懒加载模式
                        !mark.getMark(node.key, CascadeMarkAttr.loaded) &&       // 未曾加载过子节点数据
                        !node.isLeaf                                             // 节点不是叶子节点
                    ) {
                        const children = await utils.getChildrenAsync(node)
                        node.setChildren(children || [])
                        await $plain.nextTick()
                    }
                }
            }
        }

        utils.initLazy()

        watch(() => props.data, (val) => {
            rootNode.setChildren(val as any[])
        })

        return () => {
            const empty = (
                <pl-item class="pl-cascade-item pl-cascade-empty" key="empty" block>
                    <pl-icon icon="el-icon-reading"/>
                    {props.emptyText}
                </pl-item>
            )

            const filterList = (
                <pl-item class="pl-cascade-list pl-cascade-filter-list" key={0}>
                    <pl-scroll>
                        <pl-list>
                            {(!filterData.value || filterData.value.length === 0) && empty}
                            {filterData.value.map((nodes) => (
                                <pl-item block
                                         class={[
                                             'pl-cascade-item',
                                             {
                                                 'pl-cascade-item-active': !!model.value && model.value.toString() === nodes.map(node => node.key).toString(),
                                                 'pl-cascade-item-disabled': nodes.some(node => node.nodeDisabled),
                                             }
                                         ]}
                                         key={nodes.map(node => node.key).join(' ')}
                                         {...{
                                             nativeOn: {
                                                 click: () => {
                                                     handler.clickItem(nodes[nodes.length - 1])
                                                 },
                                             }
                                         }}>
                                    <div class="pl-cascade-content">
                                        {nodes.map(node => node.label).join(' / ')}
                                    </div>
                                </pl-item>
                            ))}
                        </pl-list>
                    </pl-scroll>
                </pl-item>
            )

            const cascadeList = cascadeData.value.map((list, listIndex) => (
                <pl-item class="pl-cascade-list" key={listIndex} v-loading={listIndex > 0 && mark.getMark(state.expandKeys[listIndex - 1], CascadeMark.loading)}>
                    <pl-scroll>
                        <pl-list>
                            {list.map((node, nodeIndex) => (
                                <pl-item block
                                         class={[
                                             'pl-cascade-item',
                                             {
                                                 'pl-cascade-item-expand': node.key === state.expandKeys[listIndex],
                                                 'pl-cascade-item-active': !!model.value && model.value[listIndex] === node.key,
                                                 'pl-cascade-item-disabled': node.nodeDisabled,
                                             }
                                         ]}
                                         key={node.key}

                                         {...{
                                             nativeOn: {
                                                 click: () => handler.clickItem(node),
                                                 ...(props.trigger === 'hover' ? {
                                                     mouseenter: () => handler.mouseenterItem(node),
                                                 } : {})
                                             },
                                         }}>
                                    <div class="pl-cascade-content">
                                        {scopedSlots.default({
                                            param: {node, index: nodeIndex},
                                            content: !!props.renderContent ? props.renderContent(h, {node, index: nodeIndex}) : node.label
                                        })}
                                        {!node.isLeaf && (
                                            <div class="pl-cascade-arrow">
                                                {node.isLoading ? <pl-loading type="gamma"/> : <pl-icon icon="el-icon-arrow-right"/>}
                                            </div>
                                        )}
                                    </div>
                                </pl-item>
                            ))}
                            {list.length === 0 && (
                                <pl-item class="pl-cascade-item pl-cascade-empty" key="empty" block>
                                    <pl-icon icon="el-icon-reading"/>
                                    {props.emptyText}
                                </pl-item>
                            )}
                        </pl-list>
                    </pl-scroll>
                </pl-item>
            ))

            const isEmpty = !!props.filterText ? (filterData.value.length === 0) : (cascadeData.value.length === 0)

            return (
                <div class="pl-cascade-panel" v-loading={state.loading}>
                    {!!props.filterText ? filterList : (
                        <pl-list>
                            {isEmpty ? (
                                <div class="pl-cascade-list" key="empty">
                                    {empty}
                                </div>
                            ) : cascadeList}
                        </pl-list>
                    )}
                </div>
            )
        }
    },
})