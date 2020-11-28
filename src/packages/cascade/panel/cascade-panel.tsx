import {designComponent} from "../../../use/designComponent";
import {CascadeNode} from "../utils/CascadeNode";
import {VNodeChild} from "../../../shims";
import {useScopedSlots} from "../../../use/useScopedSlots";
import {useModel} from "../../../use/useModel";
import {CascadeMark} from "../utils/CascadMark";
import {reactive, ref, computed, nextTick} from 'vue';
import {debounce} from "plain-utils/utils/debounce";
import './cascade-panel.scss'
import {reactiveFor} from "../../../utils/reactiveFor";

export const CascadePanelProps = {
    modelValue: {type: Array},                                          // 数组，双向绑定值
    data: {type: Array},                                                // 选择的数据
    trigger: {type: String, default: 'click'},                           // 展开触发类型：click，hover
    hoverDebounce: {type: Number, default: 150},                        // 触发器为hover的时候，防抖时间间隔
    emptyText: {type: String, default: '暂无数据'},                      // 没有子节点时展示的文本
    nodeDisabled: {                                                     // 是否禁用判断函数
        type: Function as any as new() => ((node: CascadeNode) => boolean)
    },
    renderContent: {                                                    // 渲染内容的渲染函数
        type: Function as any as new() => ((data: { node: CascadeNode, index: number }) => VNodeChild)
    },
    selectBranch: {type: Boolean},                                      // 点击分支的时候也能够触发 change 事件
    /*---------------------------------------separator-------------------------------------------*/
    isLeaf: {                                                           // 函数，用来判断是否为叶子节点，默认根据节点是否存在子节点来判断是否为叶子节点，懒加载模式下，改属性为必需属性
        type: Function as any as new() => ((node: CascadeNode) => boolean)
    },
    lazy: {type: Boolean},                                              // 数据是否为懒加载
    getChildren: {                                                      // 懒加载数据函数
        type: Function as any as new() => ((node: CascadeNode | null, cb: (...args: any[]) => void) => any)
    },
    /*---------------------------------------separator-------------------------------------------*/
    labelField: {type: String, required: true},                         // 记录显示文本的字段名
    keyField: {type: String, required: true},                           // 记录值的字段名
    childrenField: {type: String, required: true},                      // 记录的子节点数据的字段名
    /*---------------------------------------separator-------------------------------------------*/
    filterText: {type: String},                                         // 筛选文本
    filterMethod: {
        type: Function as any as new() => ((nodes: CascadeNode[], filterText: string) => boolean)
    },                                      // 自定义筛选函数
}

export default designComponent({
    name: 'pl-cascade-panel',
    props: CascadePanelProps,
    emits: {
        updateModelValue: (val: any, expandNodes?: CascadeNode[]) => true,
        clickItem: (data: { node: CascadeNode, index: number }) => true,
        getChildren: (...args: any[]) => true,
        updateData: (val: any) => true,
    },
    setup({props, event: {emit}}) {

        const {scopedSlots} = useScopedSlots({
            default: {node: CascadeNode, index: Number}
        })
        const model = useModel(() => props.modelValue, emit.updateModelValue, {autoEmit: false})
        const data = useModel(() => props.data, emit.updateData)
        const expandKeys = ref([] as string[])
        const state = reactive({
            cascadeDataKey: 0,                                          // 当CascadeNode.setChildren之后，需要cascadeData重新计算
            loading: false,
            expandKeys,
            cascadeMark: new CascadeMark(
                () => ({
                    nodeDisabled: props.nodeDisabled,
                    isLeaf: props.isLeaf,
                    lazy: props.lazy,
                    getChildren: props.getChildren,
                    filterMethod: props.filterMethod,

                    labelField: props.labelField!,
                    keyField: props.keyField!,
                    childrenField: props.childrenField!,
                }),
                () => ({
                    expandKeys: expandKeys.value,
                    filterText: props.filterText,
                })
            )
        })

        const formatData = computed(() => state.cascadeMark.node.getList(data.value, 1, () => null))
        const cascadeData = computed(() => {
            reactiveFor(state.cascadeDataKey)
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
            getChildrenAsync(node: CascadeNode | null): Promise<CascadeNode[]> {
                return new Promise((resolve) => {
                    if (!node) {
                        state.loading = true
                    } else {
                        node.loading(true)
                    }
                    props.getChildren!(node, (...results: any[]) => {
                        if (!node) {
                            state.loading = false
                        } else {
                            node.loading(false)
                            node.loaded(true)
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
                data.value = await utils.getChildrenAsync(null)
            },
        }

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

        /*---------------------------------------handler-------------------------------------------*/

        const handler = {
            mouseenterItem: debounce((node: CascadeNode) => {
                if (props.trigger === 'hover') {
                    methods.expand(node)
                }
            }, props.hoverDebounce),
            clickItem: async (node: CascadeNode, index: number) => {
                if (props.trigger === 'click') {
                    await methods.expand(node)
                }

                if (node.nodeDisabled) return
                if (node.isLeaf || props.selectBranch) {
                    model.value = state.expandKeys
                    emit.updateModelValue(model.value as string[], expandNodes.value as CascadeNode[])
                }
                emit.clickItem({node, index})
            }
        }

        /*---------------------------------------methods-------------------------------------------*/

        const methods = {
            expand: async (node: CascadeNode) => {
                if (!node.isExpand) {
                    state.expandKeys = node.expandKeys

                    if (
                        props.lazy &&                                               // 懒加载模式
                        !node.isLoaded &&                                           // 未曾加载过子节点数据
                        !node.isLeaf                                                // 节点不是叶子节点
                    ) {
                        const children = await utils.getChildrenAsync(node)
                        node.setChildren(children || [])
                        state.cascadeDataKey++
                    }
                }
            }
        }

        utils.initLazy()

        return {
            refer: {
                ...methods,
            },
            render: () => {
                const empty = (
                    <pl-item class="pl-cascade-item pl-cascade-empty" key="empty" block>
                        <pl-icon icon="el-icon-nodata"/>
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
                                                 onClick: () => {
                                                     handler.clickItem(nodes[nodes.length - 1], -1)
                                                 },
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
                    <pl-item class="pl-cascade-list" key={listIndex} v-loading={listIndex > 0 && state.cascadeMark.loading.get(state.expandKeys[listIndex - 1])}>
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
                                                 onClick: () => handler.clickItem(node, nodeIndex),
                                                 ...(props.trigger === 'hover' ? {
                                                     onMouseenter: () => handler.mouseenterItem(node),
                                                 } : {})
                                             }}>
                                        <div class="pl-cascade-content">
                                            {scopedSlots.default({node, index: nodeIndex}, (
                                                !!props.renderContent ? props.renderContent({node, index: nodeIndex}) : node.label
                                            ))}
                                            {!node.isLeaf && (
                                                <div class="pl-cascade-arrow">
                                                    {node.isLoading ? <pl-loading type="gamma" status="primary"/> : <pl-icon icon="el-icon-arrow-right"/>}
                                                </div>
                                            )}
                                        </div>
                                    </pl-item>
                                ))}
                                {list.length === 0 && (
                                    <pl-item class="pl-cascade-item pl-cascade-empty" key="empty" block>
                                        <pl-icon icon="el-icon-nodata"/>
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
        }
    },
})