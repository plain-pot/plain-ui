import {designPage, onMounted, useRefs} from "plain-ui-composition";

import {TableNode} from "../../../src/packages/PlTable/table/use/useTableNode";
import {SimpleFunction} from "plain-ui-composition"
import {reactive} from "plain-ui-composition";
import {DemoRow} from "../../components/DemoRow";
import {DemoLine} from "../../components/DemoLine";
import PlButtonGroup from "../../../src/packages/PlButtonGroup";
import PlButton from "../../../src/packages/PlButton";
import PlTable from "../../../src/packages/PlTable";
// @ts-ignore
import data from '../data/tree.data.json'
import Plc from "../../../src/packages/Plc";
import $$message from "../../../src/packages/$$message";
import PlAlert from "../../../src/packages/PlAlert";
import {PlInput} from "../../../src/packages/PlInput";
import PlTooltip from "../../../src/packages/PlTooltip";
import PlIcon from "../../../src/packages/PlIcon";
import {PlcTree} from "../../../src/packages/PlcTree";
import {PlcIndex} from "../../../src/packages/PlcIndex";
import {PlcCheck} from "../../../src/packages/PlcCheck";

const DemoVirtualTreeTable = designPage(() => {

    const {refs, onRef} = useRefs({
        tree: PlcTree,
    })

    const state = reactive({
        data: [] as any[],
    })

    onMounted(async () => {
        // @ts-ignore
        state.data = (await import('../data/address.json')).default
    })

    return () => (
        <div>
            <DemoLine>
                <PlButtonGroup>
                    <PlButton label={'全部展开'} onClick={() => refs.tree!.expandAll()}/>
                    <PlButton label={'全部收起'} onClick={() => refs.tree!.collapseAll()}/>
                    <PlButton label={'获取选中数据'} onClick={() => {
                        $$message(refs.tree!.getCheckedData().map(({data}) => data.name).join(','))
                    }}/>
                </PlButtonGroup>
            </DemoLine>
            <PlTable data={state.data} keyField="code" childrenField="children" virtual showCheckbox>
                <PlcIndex/>
                <PlcTree
                    ref={onRef.tree} title={'标题'}
                    v-slots={{content: ({row, node}) => (<span>{node.index + 1}、{row.name}</span>)}}
                />
                <Plc title={'编号'} field={'id'}/>
                <Plc title={'名称'} field={'name'}/>
            </PlTable>
        </div>
    )

})

const DemoVirtualDraggableTreeTable = designPage(() => {

    const {refs, onRef} = useRefs({
        tree: PlcTree,
    })

    const state = reactive({
        data: [] as any[],
    })

    onMounted(async () => {
        // @ts-ignore
        state.data = (await import('../data/address.json')).default
    })

    return () => (
        <div>
            <DemoLine>
                <PlButtonGroup>
                    <PlButton label={'全部展开'} onClick={() => refs.tree!.expandAll()}/>
                    <PlButton label={'全部收起'} onClick={() => refs.tree!.collapseAll()}/>
                    <PlButton label={'获取选中数据'} onClick={() => {
                        $$message(refs.tree!.getCheckedData().map(({data}: any) => data.name).join(','))
                    }}/>
                </PlButtonGroup>
            </DemoLine>
            <PlTable data={state.data} keyField="code" childrenField="children" virtual showCheckbox>
                <PlcIndex/>
                <PlcTree
                    rowDraggable
                    ref={onRef.tree} title={'标题'}
                    v-slots={{content: ({row, node}) => (<span>{node.index + 1}、{row.name}</span>)}}
                />
                <Plc title={'编号'} field={'id'}/>
                <Plc title={'名称'} field={'name'}/>
            </PlTable>
        </div>
    )

})

export default designPage(() => {

    const {refs, onRef} = useRefs({
        tree1: PlcTree,
        tree2: PlcTree,
        strictCheck: PlcCheck,
        strictTree: PlcTree,
        disabledCheck: PlcCheck,
        disabledCheckTree: PlcTree,

        table1: PlTable,
    })

    const log = (...args: any[]) => console.log(...args)
    const lazyDemo = reactive({
        data: [],
        isLeaf: (node: TableNode) => {
            return node.level >= 3
        },
        getChildren: (node: TableNode, resolve: SimpleFunction) => {
            switch (node.level) {
                case 0:
                    // 加载一级数据
                    lazyDemo.getCitiesByParentId(null).then(resolve)
                    break
                case 1:
                    // 加载二级数据
                    lazyDemo.getCitiesByParentId(node.data.id).then(resolve)
                    break
                case 2:
                    // 加载三级数据
                    lazyDemo.getCitiesByParentId(node.data.id).then(resolve)
                    break
                default:
                    return null
            }
        },
        getCitiesByParentId(parentId: any) {
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
    })

    const state = reactive({
        filterText: '',
        filterBindingText: null,
    })

    const allow = {
        rowDraggable: (node: TableNode) => {
            return node.level !== 1
        },
        rowDroppable: (startNode: TableNode, moveNode: TableNode, dropType: any) => {
            if (moveNode.level !== 1) {
                return true
            }
            // 这里展示了dropType的几种类型
            switch (dropType) {
                case 'prev':
                    return false
                case 'next':
                    return false
                case 'inner':
                    return true
            }
            return true
        }
    }

    async function expandSome() {
        const keys = ['2-2-2', '3-1-2']
        await refs.tree1!.expand(keys)
    }

    function expandAndSelect() {
        refs.tree1!.expand('2-2-2')
        refs.table1!.setCurrent('2-2-2')
    }

    function customIsCheckable(node: TableNode) {
        // 名称带字符【2】的记录不能选中
        return (node.data.name || []).indexOf('2') === -1
    }

    function customFilterNodeMethod(node: TableNode) {
        if (!state.filterText) {
            return true
        } else {
            return (node.data.name || []).indexOf(state.filterText) > -1
        }
    }

    return () => (
        <div>
            <DemoRow title={'基本用法'}>
                <DemoLine>
                    <PlButtonGroup>
                        <PlButton label={'全部展开'} onClick={() => refs.tree1!.expandAll()}/>
                        <PlButton label={'全部收起'} onClick={() => refs.tree1!.collapseAll()}/>
                        <PlButton label={'展开特定节点'} onClick={() => refs.tree1!.expand('2-2-2')}/>
                        <PlButton label={'展开部分节点'} onClick={expandSome}/>
                        <PlButton label={'展开并且设置当前选中节点'} onClick={expandAndSelect}/>
                    </PlButtonGroup>
                </DemoLine>
                <PlTable data={data} ref={onRef.table1} keyField="id" childrenField="subs">
                    <PlcIndex/>
                    <PlcTree
                        ref={onRef.tree1} title={'标题'}
                        v-slots={{content: ({row, node}) => (<span>{node.index + 1}、{row.name}</span>)}}
                    />
                    <Plc title={'编号'} field={'id'}/>
                    <Plc title={'名称'} field={'name'}/>
                </PlTable>
            </DemoRow>

            <DemoRow title={'可选树形表格'}>
                <DemoLine>
                    <PlButtonGroup>
                        <PlButton label={'全部展开'} onClick={() => refs.tree2!.expandAll()}/>
                        <PlButton label={'全部收起'} onClick={() => refs.tree2!.collapseAll()}/>
                        <PlButton label={'获取选中数据'} onClick={() => {
                            $$message(refs.tree2!.getCheckedData().map(({data}: any) => data.name).join(','))
                        }}/>
                    </PlButtonGroup>
                </DemoLine>
                <PlTable data={data} keyField="id" childrenField="subs" showCheckbox>
                    <PlcIndex/>
                    <PlcTree
                        ref={onRef.tree2} title={'标题'}
                        v-slots={{content: ({row, node}) => (<span>{node.index + 1}、{row.name}</span>)}}
                    />
                    <Plc title={'编号'} field={'id'}/>
                    <Plc title={'名称'} field={'name'}/>
                </PlTable>
            </DemoRow>

            <DemoRow title={'懒加载子节点'}>
                <PlTable v-models={[[lazyDemo.data, 'data']]} keyField="id" childrenField="subs" lazy isLeaf={lazyDemo.isLeaf} getChildren={lazyDemo.getChildren}>
                    <PlcIndex/>
                    <PlcTree
                        title={'标题'}
                        v-slots={{content: ({row, node}) => (<span>{node.index + 1}、{row.name}</span>)}}
                    />
                    <Plc title={'编号'} field={'id'}/>
                    <Plc title={'名称'} field={'name'}/>
                </PlTable>
            </DemoRow>

            <DemoRow title={'多选，父子互不关联'}>
                <DemoLine>
                    <PlButtonGroup>
                        <PlButton label={'获取多选列的选中数据'} onClick={() => $$message(refs.strictCheck!.getSelected().map((node: any) => node.data.name).join(','))}/>
                        <PlButton label={'获取树列的选中数据'} onClick={() => $$message(refs.strictTree!.getCheckedData().map(({data}: any) => data.name).join(','))}/>
                    </PlButtonGroup>
                </DemoLine>
                <PlTable data={data} keyField="id" childrenField="subs" checkStrictly showCheckbox>
                    <PlcIndex/>
                    <PlcCheck ref={onRef.strictCheck}/>
                    <PlcTree
                        ref={onRef.strictTree} title={'标题'}
                        v-slots={{content: ({row, node}) => (<span>{node.index + 1}、{row.name}</span>)}}
                    />
                    <Plc title={'编号'} field={'id'}/>
                    <Plc title={'名称'} field={'name'}/>
                </PlTable>
            </DemoRow>

            <DemoRow title={'多选，禁用部分选项：名称带字符【2】的记录不能选中'}>
                <DemoLine>
                    <PlButtonGroup>
                        <PlButton label={'获取多选列的选中数据'} onClick={() => $$message(refs.disabledCheck!.getSelected().map((node: any) => node.data.name).join(','))}/>
                        <PlButton label={'获取树列的选中数据'} onClick={() => $$message(refs.disabledCheckTree!.getCheckedData().map(({data}: any) => data.name).join(','))}/>
                    </PlButtonGroup>
                </DemoLine>
                <PlTable data={data} keyField="id" childrenField="subs" checkStrictly showCheckbox isCheckable={customIsCheckable}>
                    <PlcIndex/>
                    <PlcCheck ref={onRef.disabledCheck} isCheckable={customIsCheckable}/>
                    <PlcTree
                        ref={onRef.disabledCheckTree} title={'标题'}
                        v-slots={{content: ({row, node}) => (<span>{node.index + 1}、{row.name}</span>)}}
                    />
                    <Plc title={'编号'} field={'id'}/>
                    <Plc title={'名称'} field={'name'}/>
                </PlTable>
            </DemoRow>

            <DemoRow title={'手风琴模式，打开节点的时候关闭兄弟节点'}>
                <PlTable data={data} keyField="id" childrenField="subs" according>
                    <PlcIndex/>
                    <PlcTree
                        title={'标题'}
                        v-slots={{content: ({row, node}) => (<span>{node.index + 1}、{row.name}</span>)}}
                    />
                    <Plc title={'编号'} field={'id'}/>
                    <Plc title={'名称'} field={'name'}/>
                </PlTable>
            </DemoRow>

            <DemoRow title={'展开图标'}>
                <PlTable data={data} keyField="id" childrenField="subs">
                    <PlcIndex/>
                    <PlcTree
                        folderExpandIcon="el-icon-caret-bottom"
                        folderCollapseIcon="el-icon-caret-right"
                        title={'标题'}
                        v-slots={{content: ({row, node}) => (<span>{node.index + 1}、{row.name}</span>)}}
                    />
                    <Plc title={'编号'} field={'id'}/>
                    <Plc title={'名称'} field={'name'}/>
                </PlTable>
            </DemoRow>

            <DemoRow title={'自定义过滤函数，实现数据筛选的功能'}>
                <DemoLine><PlAlert>当子节点显示的时候，父节点也会显示，不管父节点是否能通过自定义过滤函数的校验</PlAlert></DemoLine>
                <DemoLine>
                    <PlInput suffixIcon={'el-icon-search'} v-model={state.filterBindingText} onEnter={() => state.filterText = state.filterBindingText as any}/>
                    <PlTooltip message={'回车确定筛选'}><PlIcon icon={'el-icon-info'}/></PlTooltip>
                </DemoLine>
                <PlTable data={data} keyField="id" childrenField="subs" filterNodeMethod={customFilterNodeMethod}>
                    <PlcIndex/>
                    <PlcTree
                        title={'标题'}
                        v-slots={{content: ({row, node}) => (<span>{node.index + 1}、{row.name}</span>)}}
                    />
                    <Plc title={'编号'} field={'id'}/>
                    <Plc title={'名称'} field={'name'}/>
                </PlTable>
            </DemoRow>

            <DemoRow title={'虚拟树表格'}>
                <DemoVirtualTreeTable/>
            </DemoRow>
            <DemoRow title={'可拖拽树形表格'}>
                <PlTable data={data} keyField="id" childrenField="subs">
                    <PlcIndex/>
                    <PlcTree
                        rowDraggable
                        title={'标题'}
                        v-slots={{content: ({row, node}) => (<span>{node.index + 1}、{row.name}</span>)}}
                    />
                    <Plc title={'编号'} field={'id'}/>
                    <Plc title={'名称'} field={'name'}/>
                </PlTable>
            </DemoRow>

            <DemoRow title={'可拖拽树形虚拟表格'}>
                <DemoVirtualDraggableTreeTable/>
            </DemoRow>

            <DemoRow title={'可拖拽，可放置控制'}>
                <DemoLine><PlAlert>默认情况下，一个节点不能放置在他的子节点中</PlAlert></DemoLine>
                <DemoLine>这里示例，第一层节点不能被拖拽，不能放置在第一层节点前后，只能放置在其子节点中（相当于控制第一层节点数量不变）</DemoLine>
                <PlTable data={data} keyField="id" childrenField="subs">
                    <PlcIndex/>
                    <PlcTree
                        rowDraggable
                        title={'标题'}
                        allowRowDraggable={allow.rowDraggable}
                        allowRowDroppable={allow.rowDroppable}
                        v-slots={{content: ({row, node}) => (<span>{node.index + 1}、{row.name}</span>)}}
                    />
                    <Plc title={'编号'} field={'id'}/>
                    <Plc title={'名称'} field={'name'}/>
                </PlTable>
            </DemoRow>
        </div>
    )
})
