import {designPage, nextTick, reactive, useRefs} from "plain-design-composition";
import {DemoRow} from "../../components/DemoRow";

// @ts-ignore
import treeData from '../data/tree.data.json'
// @ts-ignore
import addressData from '../data/address.json'
import {deepcopy} from "plain-utils/object/deepcopy";
import PlTree from "../../../src/packages/PlTree";
import $$message from "../../../src/packages/$$message";
import {DemoLine} from "../../components/DemoLine";
import PlButtonGroup from "../../../src/packages/PlButtonGroup";
import PlButton from "../../../src/packages/PlButton";
import {TreeNode} from "../../../src/packages/PlTree/utils/type";
import {SimpleFunction} from "plain-design-composition"
import {PlInput} from "../../../src/packages/PlInput";
import PlCard from "../../../src/packages/PlCard";

export default designPage(() => {

    const {refs, onRef} = useRefs({
        checkTree: PlTree,
        lazyTree: PlTree,
        checkStrictlyTree: PlTree,
        checkableTree: PlTree,
        scopedSlotDemo: PlTree,
        renderDemo: PlTree,
        currentTree: PlTree,
        virtualTree: PlTree,
        dragTree: PlTree,
        dragAndCheckTree: PlTree,
        virtualTreeWithDrag: PlTree,
    })

    const state = reactive({state: {} as any}).state

    const tree1 = (() => ({
        ...useRefs({tree: PlTree}),
        showCurrent: () => {
            let current = tree1.refs.tree!.getCurrent()
            $$message(!!current ? current.data.name : '未选中任何节点！')
        },
        expandSome: async () => {
            // console.log(this.$refs.tree1.state)
            await tree1.refs.tree!.expand(['2-2-2', '3-1-2'])
        },
        expandAndSelect: () => {
            tree1.refs.tree!.expand('2-2-2')
            tree1.refs.tree!.setCurrent('2-2-2')
        },
    }))();

    const lazyDemo = {
        treeData: [],
        isLeaf: (treeNode: TreeNode) => {
            return treeNode.level >= 3
        },
        getChildren: (treeNode: TreeNode, resolve: SimpleFunction) => {
            switch (treeNode.level) {
                case 0:
                    // 加载一级数据
                    lazyDemo.getCitiesByParentId(null).then(resolve)
                    break
                case 1:
                    // 加载二级数据
                    lazyDemo.getCitiesByParentId(treeNode.data.id).then(resolve)
                    break
                case 2:
                    // 加载三级数据
                    lazyDemo.getCitiesByParentId(treeNode.data.id).then(resolve)
                    break
                default:
                    return null
            }
        },
        getCitiesByParentId(parentId: string | null) {
            return new Promise((resolve) => {
                // 这个是模拟在数据库表中的数据
                const data = [
                    {id: '1', name: '广东省', parentId: null, subs: []},
                    {id: '2', name: '佛山市', parentId: '1', subs: []},
                    {id: '3', name: '深圳市', parentId: '1', subs: []},
                    {id: '4', name: '禅城区', parentId: '2', subs: []},
                    {id: '5', name: '南山区', parentId: '3', subs: []},

                    {id: '6', name: '湖南省', parentId: null, subs: []},
                    {id: '7', name: '长沙市', parentId: '6', subs: []},
                    {id: '8', name: '邵阳市', parentId: '6', subs: []},
                    {id: '9', name: '天心区', parentId: '7', subs: []},

                    {id: '11', name: '陕西省', parentId: null, subs: []},
                ]

                // 模拟请求，请求时间大概在1s-2s之间
                setTimeout(() => {
                    resolve(data.filter(item => item.parentId === parentId))
                }, Math.random() * 1000 + 1000)
            })
        },
    }

    const scopedSlotDemo = {
        treeData: deepcopy(treeData),
        addItem: async (e: MouseEvent, treeNode: TreeNode) => {
            e.stopPropagation()
            const {data} = treeNode
            const subs = data.subs || []
            const name = `n-${data.id}-${subs.length + 1}`
            const id = name + Date.now().toString()
            subs.push({id, name: `new item ${name}`,})
            // 这里触发响应式更新，单独修改subs数组可能不会触发视图更新
            data.subs = [...subs]
            refs.scopedSlotDemo!.refreshCheckStatus(treeNode)
            refs.scopedSlotDemo!.expand(id)
        },
        deleteItem: (e: MouseEvent, treeNode: TreeNode) => {
            e.stopPropagation()
            let {data, parentRef} = treeNode
            const parent = parentRef()
            const subs = parent!.data.subs as any[]
            const ids = subs.map(item => item.id)
            subs.splice(ids.indexOf(data.id), 1)
            refs.scopedSlotDemo!.refreshCheckStatus(treeNode.parentRef()!)
        },
        clear: (e: MouseEvent, treeNode: TreeNode) => {
            e.stopPropagation()
            treeNode.data.subs = []
        },
    }

    const renderDemo = {
        treeData: deepcopy(treeData),
        renderContent: ({node}: { node: TreeNode }) => {
            return (
                <div style={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
                    <span>{node.data.name}</span>
                    <PlButtonGroup mode="text">
                        <PlButton label="Add" onClick={e => renderDemo.addItem(e, node)} size="mini"/>
                        <PlButton label="Del" onClick={e => renderDemo.deleteItem(e, node)} size="mini" status="error"/>
                    </PlButtonGroup>
                </div>
            )
        },
        addItem: (e: MouseEvent, treeNode: TreeNode) => {
            e.stopPropagation()
            const {data} = treeNode
            const subs = data.subs || []
            const name = `n-${data.id}-${subs.length + 1}`
            const id = name + Date.now().toString()
            subs.push({id, name: `new item ${name}`,})
            data.subs = subs
            refs.renderDemo!.refreshCheckStatus(treeNode)
            nextTick().then(() => refs.renderDemo!.expand(id))
        },
        deleteItem: (e: MouseEvent, treeNode: TreeNode) => {
            e.stopPropagation()
            let {data, parentRef} = treeNode
            const parent = parentRef()!
            const subs = parent.data.subs as any[]
            const ids = subs.map(item => item.id)
            subs.splice(ids.indexOf(data.id), 1)
            refs.renderDemo!.refreshCheckStatus(treeNode.parentRef()!)
        },
    }

    const filterDemo = reactive({
        filterText: '',
        filterNodeMethod: (treeNode: TreeNode) => {
            const data = treeNode.data
            if (!filterDemo.filterText) return true;
            return data.name.indexOf(filterDemo.filterText) !== -1;
        },
    })

    return () => (
        <div>
            <DemoRow title={'基本用法'}>
                <DemoLine>
                    <PlButtonGroup>
                        <PlButton label={'全部展开'} onClick={() => tree1.refs.tree!.expandAll()}/>
                        <PlButton label={'全部收起'} onClick={() => tree1.refs.tree!.collapseAll()}/>
                        <PlButton label={'展开特定节点'} onClick={() => tree1.refs.tree!.expand('2-2-2')}/>
                        <PlButton label={'展开部分节点'} onClick={() => tree1.expandSome()}/>
                        <PlButton label={'当前选中节点'} onClick={() => tree1.showCurrent()}/>
                        <PlButton label={'展开并且设置当前选中节点'} onClick={() => tree1.expandAndSelect()}/>
                    </PlButtonGroup>
                </DemoLine>
                <div style={{height: '500px'}}>
                    <PlTree
                        ref={tree1.onRef.tree}
                        data={treeData}
                        keyField="id"
                        labelField="name"
                        childrenField="subs"
                        expandOnClickNode
                    />
                </div>
            </DemoRow>

            <DemoRow title={'多选'}>
                <DemoLine>
                    <PlButtonGroup>
                        <PlButton label={'展开所有节点'} onClick={() => refs.checkTree!.expandAll()}/>
                        <PlButton label={'全部收起'} onClick={() => refs.checkTree!.collapseAll()}/>
                        <PlButton label={'全部选中'} onClick={() => refs.checkTree!.checkAll()}/>
                        <PlButton label={'全部取消'} onClick={() => refs.checkTree!.uncheckAll()}/>
                        <PlButton label={'选中部分数据'} onClick={() => refs.checkTree!.check(['1-1-1', '2-2-2'])}/>
                        <PlButton label={'获取选中的数据'} onClick={() => {
                            $$message(refs.checkTree!.getCheckedData().map(node => node.data.name).join('____'), {time: null})
                        }}/>
                    </PlButtonGroup>
                </DemoLine>
                <div style={{height: '500px'}}>
                    <PlTree
                        ref={onRef.checkTree}
                        height="330px"
                        showCheckbox
                        expandOnClickNode
                        data={treeData}
                        keyField="id"
                        labelField="name"
                        childrenField="subs"
                    />
                </div>
            </DemoRow>

            <DemoRow title={'懒加载子节点'}>
                <PlTree
                    v-models={[[lazyDemo.treeData, 'data']]}
                    showCheckbox
                    expandOnClickNode
                    height="330px"
                    ref={onRef.lazyTree}
                    keyField="id"
                    labelField="name"
                    childrenField="subs"
                    lazy
                    isLeaf={lazyDemo.isLeaf}
                    getChildren={lazyDemo.getChildren}
                />
            </DemoRow>

            <DemoRow title={'多选：父子互不关联'}>
                <DemoLine>
                    <PlButtonGroup>
                        <PlButton label={'展开所有节点'} onClick={() => refs.checkStrictlyTree!.expandAll()}/>
                        <PlButton label={'全部收起'} onClick={() => refs.checkStrictlyTree!.collapseAll()}/>
                        <PlButton label={'全部选中'} onClick={() => refs.checkStrictlyTree!.checkAll()}/>
                        <PlButton label={'全部取消'} onClick={() => refs.checkStrictlyTree!.uncheckAll()}/>
                        <PlButton label={'选中部分数据'} onClick={() => refs.checkStrictlyTree!.check(['1-1-1', '2-2-2'])}/>
                        <PlButton label={'获取选中的数据'} onClick={() => {
                            $$message(refs.checkStrictlyTree!.getCheckedData().map(node => node.data.name).join('____'), {time: null})
                        }}/>
                    </PlButtonGroup>
                </DemoLine>
                <div style={{height: '500px'}}>
                    <PlTree
                        ref={onRef.checkStrictlyTree}
                        height="330px"
                        showCheckbox
                        checkStrictly
                        data={treeData}
                        keyField="id"
                        labelField="name"
                        childrenField="subs"
                    />
                </div>
            </DemoRow>
            <DemoRow title={'多选：禁用部分选项，只能勾选1结尾的节点'}>
                <DemoLine>
                    <PlButtonGroup>
                        <PlButton label={'展开所有节点'} onClick={() => refs.checkableTree!.expandAll()}/>
                        <PlButton label={'全部收起'} onClick={() => refs.checkableTree!.collapseAll()}/>
                        <PlButton label={'全部选中'} onClick={() => refs.checkableTree!.checkAll()}/>
                        <PlButton label={'全部取消'} onClick={() => refs.checkableTree!.uncheckAll()}/>
                        <PlButton label={'选中部分数据'} onClick={() => refs.checkableTree!.check(['1-1-1', '2-2-2'])}/>
                        <PlButton label={'获取选中的数据'} onClick={() => {
                            $$message(refs.checkableTree!.getCheckedData().map(node => node.data.name).join('____'), {time: null})
                        }}/>
                    </PlButtonGroup>
                </DemoLine>
                <div style={{height: '500px'}}>
                    <PlTree
                        ref={onRef.checkableTree}
                        height="330px"
                        showCheckbox
                        data={treeData}
                        keyField="id"
                        labelField="name"
                        childrenField="subs"
                        isCheckable={node => (node.data.name || '').endsWith('1')}
                    />
                </div>
            </DemoRow>
            <DemoRow title={'自定义内容：作用域插槽'}>
                <DemoLine>
                    <PlButtonGroup>
                        <PlButton label={'展开所有节点'} onClick={() => refs.scopedSlotDemo!.expandAll()}/>
                        <PlButton label={'全部收起'} onClick={() => refs.scopedSlotDemo!.collapseAll()}/>
                        <PlButton label={'全部选中'} onClick={() => refs.scopedSlotDemo!.checkAll()}/>
                        <PlButton label={'全部取消'} onClick={() => refs.scopedSlotDemo!.uncheckAll()}/>
                        <PlButton label={'选中部分数据'} onClick={() => refs.scopedSlotDemo!.check(['1-1-1', '2-2-2'])}/>
                        <PlButton label={'获取选中的数据'} onClick={() => {
                            $$message(refs.scopedSlotDemo!.getCheckedData().map(node => node.data.name).join('____'), {time: null})
                        }}/>
                        <PlButton label={'打印数据'} onClick={() => console.log(scopedSlotDemo.treeData)}/>
                    </PlButtonGroup>
                </DemoLine>
                <div style={{height: '500px'}}>
                    <PlTree
                        ref={onRef.scopedSlotDemo}
                        height="330px"
                        showCheckbox
                        data={scopedSlotDemo.treeData}
                        keyField="id"
                        labelField="name"
                        childrenField="subs"
                        style={{width: '500px'}} v-slots={{
                        default: ({node}) => (
                            <div style={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
                                <span>{node.data.name}</span>
                                <PlButtonGroup mode={'text'} size={'mini'}>
                                    <PlButton label={'Add'} onClick={e => scopedSlotDemo.addItem(e, node)}/>
                                    <PlButton label={'Del'} onClick={e => scopedSlotDemo.deleteItem(e, node)} status={'error'}/>
                                    <PlButton label={'Clr'} onClick={e => scopedSlotDemo.clear(e, node)} status={'error'}/>
                                </PlButtonGroup>
                            </div>
                        )
                    }}/>
                </div>
            </DemoRow>

            <DemoRow title={'自定义内容：渲染函数'}>
                <DemoLine>
                    <PlButtonGroup>
                        <PlButton label={'展开所有节点'} onClick={() => refs.renderDemo!.expandAll()}/>
                        <PlButton label={'全部收起'} onClick={() => refs.renderDemo!.collapseAll()}/>
                        <PlButton label={'全部选中'} onClick={() => refs.renderDemo!.checkAll()}/>
                        <PlButton label={'全部取消'} onClick={() => refs.renderDemo!.uncheckAll()}/>
                        <PlButton label={'选中部分数据'} onClick={() => refs.renderDemo!.check(['1-1-1', '2-2-2'])}/>
                        <PlButton label={'获取选中的数据'} onClick={() => {
                            $$message(refs.renderDemo!.getCheckedData().map(node => node.data.name).join('____'), {time: null})
                        }}/>
                        <PlButton label={'打印数据'} onClick={() => console.log(renderDemo.treeData)}/>
                    </PlButtonGroup>
                </DemoLine>
                <div style={{height: '500px'}}>
                    <PlTree
                        ref={onRef.renderDemo}
                        height="330px"
                        showCheckbox
                        data={renderDemo.treeData}
                        keyField="id"
                        labelField="name"
                        childrenField="subs"
                        style={{width: '500px'}}
                        renderContent={renderDemo.renderContent}
                    />
                </div>
            </DemoRow>
            <DemoRow title={'节点图标'}>
                <PlTree
                    height="330px"
                    data={treeData}
                    keyField="id"
                    labelField="name"
                    childrenField="subs"
                    nodeIcon={node => node.isLeaf ? 'el-icon-male' : 'el-icon-female'}
                />
            </DemoRow>
            <DemoRow title={'手风琴模式，展开节点的时候关闭兄弟节点'}>
                <PlTree
                    according
                    height="330px"
                    data={treeData}
                    keyField="id"
                    labelField="name"
                    childrenField="subs"
                />
            </DemoRow>
            <DemoRow title={'自定义过滤函数'}>
                <DemoLine>
                    <PlInput v-model={filterDemo.filterText} suffixIcon="el-icon-search" clearIcon/>
                </DemoLine>
                <PlTree
                    defaultExpandAll
                    data={treeData}
                    height="330px"
                    keyField="id"
                    labelField="name"
                    childrenField="subs"
                    filterNodeMethod={filterDemo.filterNodeMethod}
                />
            </DemoRow>
            <DemoRow title={'绑定currentKey'}>
                <DemoLine>
                    <PlButton label="全部展开" onClick={() => refs.currentTree!.expandAll()}/>
                    <PlButton label="设置currentKey" onClick={() => state.currentKey = '3-1-1'}/>
                    {state.currentKey}
                </DemoLine>
                <PlTree
                    ref={onRef.currentTree}
                    v-models={[[state.currentKey, 'currentKey']]}
                    data={treeData}
                    height="330px"
                    keyField="id"
                    labelField="name"
                    childrenField="subs"
                />
            </DemoRow>
            <DemoRow title={'展开图标'}>
                <PlTree
                    data={treeData}
                    height="330px"
                    keyField="id"
                    labelField="name"
                    childrenField="subs"
                    folderExpandIcon="el-icon-caret-bottom"
                    folderCollapseIcon="el-icon-caret-right"
                    leafIcon="el-icon-paperclip"
                />
            </DemoRow>
            <DemoRow title={'虚拟滚动'}>
                <DemoLine>
                    <PlButtonGroup>
                        <PlButton label={'展开所有节点'} onClick={() => refs.virtualTree!.expandAll()}/>
                        <PlButton label={'全部收起'} onClick={() => refs.virtualTree!.collapseAll()}/>
                        <PlButton label={'全部选中'} onClick={() => refs.virtualTree!.checkAll()}/>
                        <PlButton label={'全部取消'} onClick={() => refs.virtualTree!.uncheckAll()}/>
                        <PlButton label={'选中部分数据'} onClick={() => refs.virtualTree!.check(['1-1-1', '2-2-2'])}/>
                        <PlButton label={'获取选中的数据'} onClick={() => {
                            $$message(refs.virtualTree!.getCheckedData().map(node => node.data.name).join('____'), {time: null})
                        }}/>
                        <PlButton label={'打印数据表'} onClick={() => console.log(addressData)}/>
                    </PlButtonGroup>
                </DemoLine>
                <PlTree
                    ref={onRef.virtualTree}
                    data={addressData}
                    keyField="id"
                    labelField="name"
                    childrenField="children"
                    height="360px"
                    width="500px"
                    virtual
                    showCheckbox
                    onClickNode={(node) => $$message(node.data.name)}
                />
            </DemoRow>
            <DemoRow title={'拖拽节点'}>
                <DemoLine>
                    <PlButtonGroup>
                        <PlButton label={'展开所有节点'} onClick={() => refs.dragTree!.expandAll()}/>
                        <PlButton label={'打印数据'} onClick={() => console.log(treeData)}/>
                    </PlButtonGroup>
                </DemoLine>
                <PlTree
                    ref={onRef.dragTree}
                    height="360px"
                    defaultExpandAll
                    data={treeData}
                    keyField="id"
                    labelField="name"
                    childrenField="subs"
                    draggable v-slots={{
                    default: ({node: {data}}) => (
                        <span style={{
                            color: ({
                                1: '#12b4a5',
                                2: '#00CC00',
                                3: '#F38585',
                            } as any)[data.id.charAt(0)]
                        }}>
                            {data.name}
                        </span>
                    )
                }}/>
            </DemoRow>

            <DemoRow title={'拖拽节点+可勾选'}>
                <PlCard width={'100%'} title={'勾选行为说明'} style={{margin: '10px 0'}}>
                    <li>父子关联模式下，拖拽节点可能会引起 选中/取消选中 事件</li>
                    <li>拖拽节点会刷新节点的状态，每个节点会先判断子节点是否全都选中，全部选中并且自身未选中的情况下，会选中自身</li>
                    <li>自身选中，但是存在子节点未选中的情况下，会取消选中自身</li>
                    <li>非父子关联模式下，拖拽节点不会导致节点选中状态变化</li>
                </PlCard>
                <DemoLine>
                    <PlButtonGroup>
                        <PlButton label={'展开所有节点'} onClick={() => refs.dragAndCheckTree!.expandAll()}/>
                        <PlButton label={'打印数据'} onClick={() => console.log(treeData)}/>
                        <PlButton label={'获取选中的数据'} onClick={() => $$message(refs.dragAndCheckTree!.getCheckedData().map(node => node.data.name).join('____'), {time: null})}/>
                    </PlButtonGroup>
                </DemoLine>
                <PlTree
                    ref={onRef.dragAndCheckTree}
                    height="360px"
                    data={treeData}
                    defaultExpandAll
                    keyField="id"
                    labelField="name"
                    childrenField="subs"
                    showCheckbox
                    draggable
                />
            </DemoRow>
            <DemoRow title={'拖拽节点：可拖拽allowDrag以及可放置allowDrop'}>
                <PlCard title="控制说明">
                    <li>2-2开头的id不能被拖拽</li>
                    <li>3开头的id不能放置任何节点</li>
                </PlCard>
                <PlTree
                    height="360px"
                    data={treeData}
                    defaultExpandAll
                    keyField="id"
                    labelField="name"
                    childrenField="subs"
                    draggable
                    allowDrag={(dragNode) => !dragNode.data.id.startsWith('2-2')}
                    allowDrop={(dragNode, dropNode) => !dropNode.data.id.startsWith('3')}
                />
            </DemoRow>
            <DemoRow title={'可拖拽+虚拟滚动'}>
                <DemoLine>
                    <PlButtonGroup>
                        <PlButton label="全部展开" onClick={() => refs.virtualTreeWithDrag!.expandAll()}/>
                        <PlButton label="全部收起" onClick={() => refs.virtualTreeWithDrag!.collapseAll()}/>
                        <PlButton label="当前选中节点" onClick={() => $$message(!!refs.virtualTreeWithDrag!.getCurrent() ? refs.virtualTreeWithDrag!.getCurrent()!.data.name : '未选中任何节点！')}/>
                        <PlButton label="获取选中的数据" onClick={() => $$message(refs.virtualTreeWithDrag!.getCheckedData().map(node => node.data.name).join(','), {time: null})}/>
                        <PlButton label="打印数据" onClick={() => console.log(treeData)}/>
                    </PlButtonGroup>
                </DemoLine>
                <PlTree
                    ref={onRef.virtualTreeWithDrag}
                    data={addressData}
                    defaultExpandAll
                    keyField="id"
                    labelField="name"
                    childrenField="children"
                    height="360px"
                    width="500px"
                    virtual
                    draggable
                    showCheckbox
                    onClickNode={val => console.log(val.data.name)}/>
            </DemoRow>
        </div>
    )
})
