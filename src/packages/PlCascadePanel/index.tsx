import {computed, designComponent, PropType, reactive, ref, SimpleFunction, useModel, VueNode} from 'plain-ui-composition'
import './cascade-panel.scss'
import {CascadeNode} from "../PlCascade/utils/CascadeNode";
import {CascadeMark} from '../PlCascade/utils/CascadMark';
import {debounce} from "plain-utils/utils/debounce";
import PlIcon from "../PlIcon";
import {PlScroll} from '../PlScroll';
import PlLoading from "../PlLoading";
import {PlLoadingMask} from "../PlLoadingMask";

export const CascadePanelProps = {
    modelValue: {type: Array},                                          // 数组，双向绑定值
    data: {type: Array},                                                // 选择的数据
    trigger: {type: String, default: 'click'},                           // 展开触发类型：click，hover
    hoverDebounce: {type: Number, default: 150},                        // 触发器为hover的时候，防抖时间间隔
    emptyText: {type: String, default: '暂无数据'},                      // 没有子节点时展示的文本
    nodeDisabled: {type: Function as PropType<(node: CascadeNode) => boolean>},// 是否禁用判断函数
    renderContent: {type: Function as PropType<(data: { node: CascadeNode, index: number }) => VueNode>},// 渲染内容的渲染函数
    selectBranch: {type: Boolean},                                      // 点击分支的时候也能够触发 change 事件
    /*---------------------------------------separator-------------------------------------------*/
    isLeaf: {type: Function as PropType<(node: CascadeNode) => boolean>},// 函数，用来判断是否为叶子节点，默认根据节点是否存在子节点来判断是否为叶子节点，懒加载模式下，改属性为必需属性
    lazy: {type: Boolean},                                              // 数据是否为懒加载
    getChildren: {type: Function as PropType<(node: CascadeNode | null, cb: (...args: any[]) => void) => any>},// 懒加载数据函数
    /*---------------------------------------separator-------------------------------------------*/
    labelField: {type: String, required: true},                         // 记录显示文本的字段名
    keyField: {type: String, required: true},                           // 记录值的字段名
    childrenField: {type: String, required: true},                      // 记录的子节点数据的字段名
    /*---------------------------------------separator-------------------------------------------*/
    filterText: {type: String},                                         // 筛选文本
    filterMethod: {type: Function as PropType<(nodes: CascadeNode[], filterText: string) => boolean>},// 自定义筛选函数/
}

export const PlCascadePanel = designComponent({
    name: 'pl-cascade-panel',
    props: CascadePanelProps,
    emits: {
        onUpdateModelValue: (val: any, expandNodes?: CascadeNode[]) => true,
        onClickItem: (data: { node: CascadeNode, index: number }) => true,
        onGetChildren: (...args: any[]) => true,
        onUpdateData: (val: any) => true,
    },
    scopeSlots: {
        default: (scope: { node: CascadeNode, index: number }) => {},
    },
    setup({props, scopeSlots, event: {emit}}) {

        const model = useModel(() => props.modelValue, emit.onUpdateModelValue, {autoEmit: false})
        const data = useModel(() => props.data, emit.onUpdateData)
        const expandKeys = ref([] as string[])
        const state = reactive({
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
            iterateAll: (nodes: CascadeNode[], fn: SimpleFunction, iterateChildren?: SimpleFunction) => {
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
                        emit.onGetChildren(...results);
                        (resolve as any)(...results)
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
                    emit.onUpdateModelValue(model.value as string[], expandNodes.value as CascadeNode[])
                }
                emit.onClickItem({node, index})
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
                    <div class="pl-item pl-cascade-item pl-cascade-empty" key="empty">
                        <PlIcon icon="el-icon-nodata"/>
                        {props.emptyText}
                    </div>
                )

                const filterList = (
                    <div class="pl-item pl-cascade-list pl-cascade-filter-list" key={0}>
                        <PlScroll>
                            {(!filterData.value || filterData.value.length === 0) && empty}
                            {!!filterData.value && filterData.value.map((nodes) => (
                                <div
                                    class={([
                                        'pl-cascade-item',
                                        {
                                            'pl-cascade-item-active': !!model.value && model.value.toString() === nodes.map(node => node.key).toString(),
                                            'pl-cascade-item-disabled': nodes.some(node => node.nodeDisabled),
                                        }
                                    ])}
                                    key={nodes.map(node => node.key).join(' ')}
                                    {...{
                                        onClick: () => {
                                            handler.clickItem(nodes[nodes.length - 1], -1)
                                        },
                                    }}>
                                    <div class="pl-cascade-content">
                                        {nodes.map(node => node.label).join(' / ')}
                                    </div>
                                </div>
                            ))}
                        </PlScroll>
                    </div>
                )

                const cascadeList = cascadeData.value.map((list, listIndex) => {
                    return (
                        <div class="pl-cascade-list" key={listIndex}>
                            <PlScroll key={!list[0] ? '_' : list[0].key} {...{direction: 'horizontal'} as any}>
                                {list.map((node, nodeIndex) => (
                                    <div
                                        class={([
                                            'pl-item',
                                            'pl-cascade-item',
                                            {
                                                'pl-cascade-item-expand': node.key === state.expandKeys[listIndex],
                                                'pl-cascade-item-active': !!model.value && model.value[listIndex] === node.key,
                                                'pl-cascade-item-disabled': node.nodeDisabled,
                                            }
                                        ])}
                                        key={node.key}

                                        {...{
                                            onClick: () => handler.clickItem(node, nodeIndex),
                                            ...(props.trigger === 'hover' ? {
                                                onMouseEnter: () => handler.mouseenterItem(node),
                                            } : {})
                                        }}>
                                        <div class="pl-cascade-content">
                                            {scopeSlots.default({node, index: nodeIndex}, (
                                                !!props.renderContent ? props.renderContent({node, index: nodeIndex}) : node.label
                                            ))}
                                            {!node.isLeaf && (
                                                <div class="pl-cascade-arrow">
                                                    {node.isLoading ? <PlLoading type="gamma" status="primary"/> : <PlIcon icon="el-icon-arrow-right"/>}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {list.length === 0 && (
                                    <div class="pl-item pl-cascade-item pl-cascade-empty" key="empty">
                                        <PlIcon icon="el-icon-nodata"/>
                                        {props.emptyText}
                                    </div>
                                )}
                            </PlScroll>
                            <PlLoadingMask modelValue={listIndex > 0 && state.cascadeMark.loading.get(state.expandKeys[listIndex - 1])}/>
                        </div>
                    )
                })

                const isEmpty = !!props.filterText ? (filterData.value.length === 0) : (cascadeData.value.length === 0)

                return (
                    <div class="pl-cascade-panel">
                        {!!props.filterText ? filterList : (
                            isEmpty ? (
                                <div class="pl-cascade-list" key="empty">
                                    {empty}
                                </div>
                            ) : cascadeList
                        )}
                        <PlLoadingMask modelValue={state.loading}/>
                    </div>
                )
            }
        }
    },
})

export default PlCascadePanel
