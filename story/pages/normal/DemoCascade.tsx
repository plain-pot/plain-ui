import {designPage} from "plain-design-composition";
import {DemoRow} from "../../components/DemoRow";
import {reactive} from "plain-design-composition";
import {DemoLine} from "../../components/DemoLine";
import {PlCascadePanel} from "../../../src/packages/PlCascadePanel";
import {CascadeNode} from "../../../src/packages/PlCascade/utils/CascadeNode";
import {PlInput} from "../../../src/packages/PlInput";
import PlCascade from "../../../src/packages/PlCascade";
import {PlCheckbox} from "../../../src/packages/PlCheckbox";

export default designPage(() => {

    const treeData = [
        {
            id: '1',
            name: '一级 1',
            subs: [
                ...([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(PlCascadePanel => ({
                    id: '1-' + PlCascadePanel,
                    name: '二级 1-' + PlCascadePanel,
                    subs: [{
                        id: `1-${PlCascadePanel}-1`,
                        name: `三级 1-${PlCascadePanel}-1`
                    }]
                })))
            ]
        }, {
            id: '2',
            name: '一级 2',
            subs: [
                ...([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(PlCascadePanel => ({
                    id: '2-' + PlCascadePanel,
                    name: '二级 2-' + PlCascadePanel,
                    subs: [{
                        id: `2-${PlCascadePanel}-1`,
                        name: `三级 2-${PlCascadePanel}-1`
                    }]
                })))
            ]
        }, {
            id: '3',
            name: '一级 3',
            subs: [{
                id: '3-1',
                name: '二级 3-1',
                subs: [{
                    id: '3-1-1',
                    name: '三级 3-1-1'
                }, {
                    id: '3-1-2',
                    name: '三级 3-1-2'
                }]
            }, {
                id: '3-2',
                name: '二级 3-2',
                subs: [{
                    id: '3-2-1',
                    name: '三级 3-2-1'
                }]
            }]
        }]

    const val = reactive({
        val: {
            11: ["6", "7", "9"],
            2: ["2", "2-1", "2-1-1"],
        } as any
    }).val

    const state = reactive({
        labelFlag: true,
        filterText: '',

        formData: {
            level1Name: '广东省',
            level1Key: '1',
            level2Name: '深圳市',
            level2Key: '3',
            level3Name: '南山区',
            level3Key: '5',
        } as any,
    })

    const lazyDemo = {
        isLeaf: (node: CascadeNode) => {
            return node.level >= 3
        },
        getChildren: (node: CascadeNode | null, resolve: any) => {
            if (!node) {
                // 加载一级数据
                lazyDemo.getCitiesByParentId(null).then(resolve)
                return
            }
            switch (node.level) {
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
                }, Math.random() * 500 + 500)
            })
        },
    }

    const renderContent = ({node, index}: { node: CascadeNode, index: number }) => (<div>
        {index + 1}、{node.label}
    </div>)

    const filterMethod = (nodes: CascadeNode[], text: string) => nodes.some(node => node.label.indexOf(text) > -1)

    const onCascadeChange = (value: string[] | undefined, nodes?: CascadeNode[]) => {
        console.log('onCascadeChange', value, nodes)
        if (!value || !nodes) {
            state.formData.level1Name = null
            state.formData.level1Key = null
            state.formData.level2Name = null
            state.formData.level2Key = null
            state.formData.level3Name = null
            state.formData.level3Key = null
        } else {
            state.formData.level1Name = nodes[0].data.name
            state.formData.level1Key = value[0]
            state.formData.level2Name = nodes[1].data.name
            state.formData.level2Key = value[1]
            state.formData.level3Name = nodes[2].data.name
            state.formData.level3Key = value[2]
        }
    }

    return () => (
        <div>
            <DemoRow title={'PlCascadePanel'}>
                <DemoRow title={'基本用法'}>
                    <DemoLine>{JSON.stringify(val[0])}</DemoLine>
                    <PlCascadePanel
                        v-model={val[0]}
                        data={treeData}
                        labelField={state.labelFlag ? 'id' : 'name'}
                        keyField={'id'}
                        childrenField={'subs'}
                    />
                </DemoRow>
                <DemoRow title={'懒加载'}>
                    <DemoLine>{JSON.stringify(val[1])}</DemoLine>
                    <PlCascadePanel
                        v-model={val[1]}
                        labelField={'name'}
                        keyField={'id'}
                        childrenField={'subs'}
                        lazy
                        isLeaf={lazyDemo.isLeaf}
                        getChildren={lazyDemo.getChildren}
                    />
                </DemoRow>
                <DemoRow title={'懒加载，有默认值'}>
                    <DemoLine>{JSON.stringify(val[11])}</DemoLine>
                    <PlCascadePanel
                        v-model={val[11]}
                        labelField={'name'}
                        keyField={'id'}
                        childrenField={'subs'}
                        lazy
                        isLeaf={lazyDemo.isLeaf}
                        getChildren={lazyDemo.getChildren}
                    />
                </DemoRow>
                <DemoRow title={'hover 触发器'}>
                    <DemoLine>{JSON.stringify(val[3])}</DemoLine>
                    <PlCascadePanel
                        trigger={'hover'}
                        v-model={val[3]}
                        data={treeData}
                        labelField="name"
                        keyField="id"
                        childrenField="subs"
                    />
                </DemoRow>
                <DemoRow title={'禁用部分选项'}>
                    <DemoLine>禁用掉叶子节点，并且节点名称中含有[2]的节点</DemoLine>
                    <DemoLine>{JSON.stringify(val[4])}</DemoLine>
                    <PlCascadePanel
                        v-model={val[4]}
                        data={treeData}
                        labelField="name"
                        keyField="id"
                        childrenField="subs"
                        nodeDisabled={node => node.isLeaf && node.label.indexOf('2') > 0}
                    />
                </DemoRow>
                <DemoRow title={'自定义内容-作用域插槽'}>
                    <DemoLine>{JSON.stringify(val[5])}</DemoLine>
                    <PlCascadePanel
                        v-model={val[5]}
                        data={treeData}
                        labelField="name"
                        keyField="id"
                        childrenField="subs" v-slots={{
                        default: ({node, index}) => (
                            <div>
                                {index + 1}、{node.label}
                            </div>
                        )
                    }}/>
                </DemoRow>
                <DemoRow title={'自定义内容-渲染函数'}>
                    <DemoLine>{JSON.stringify(val[5])}</DemoLine>
                    <PlCascadePanel
                        v-model={val[5]}
                        data={treeData}
                        labelField="name"
                        keyField="id"
                        childrenField="subs"
                        renderContent={renderContent}
                    />
                </DemoRow>
                <DemoRow title={'点击分支的时候也能触发change'}>
                    <DemoLine>{JSON.stringify(val[6])}</DemoLine>
                    <PlCascadePanel
                        v-model={val[6]}
                        data={treeData}
                        labelField={'name'}
                        keyField={'id'}
                        childrenField={'subs'}
                        selectBranch
                    />
                </DemoRow>
                <DemoRow title={'筛选文本以及自定义筛选函数'}>
                    <DemoLine><PlInput v-model={state.filterText}/></DemoLine>
                    <DemoLine>{JSON.stringify(val[6])}</DemoLine>
                    <PlCascadePanel
                        v-model={val[6]}
                        data={treeData}
                        labelField={state.labelFlag ? 'id' : 'name'}
                        keyField={'id'}
                        childrenField={'subs'}
                        filterText={state.filterText}
                        filterMethod={filterMethod}
                    />
                </DemoRow>
            </DemoRow>

            <DemoRow title={'PlCascade'}>
                <DemoRow title={'基本用法'}>
                    <DemoLine>{JSON.stringify(val[7])}</DemoLine>
                    <PlCascade
                        v-model={val[7]}
                        data={treeData}
                        labelField={'name'}
                        keyField={'id'}
                        childrenField={'subs'}
                    />
                    <PlCascade
                        v-model={val[7]}
                        data={treeData}
                        labelField={'name'}
                        keyField={'id'}
                        childrenField={'subs'}
                        onFocus={() => console.log('focus')}
                        onBlur={() => console.log('blue')}
                    />
                </DemoRow>
                <DemoRow title={'禁用选项'}>
                    <DemoLine>{JSON.stringify(val[7])}</DemoLine>
                    <PlCascade
                        v-model={val[7]}
                        data={treeData}
                        labelField={'name'}
                        keyField={'id'}
                        childrenField={'subs'}
                        nodeDisabled={node => node.isLeaf && node.label.indexOf('2') > 0}
                    />
                </DemoRow>
                <DemoRow title={'只显示最后一级文本'}>
                    <DemoLine>{JSON.stringify(val[8])}</DemoLine>
                    <PlCascade
                        v-model={val[8]}
                        data={treeData}
                        labelField={'name'}
                        keyField={'id'}
                        childrenField={'subs'}
                        showLast
                    />
                </DemoRow>
                <DemoRow title={'可以选择分支（可以选择非叶子节点）'}>
                    <DemoLine>{JSON.stringify(val[9])}</DemoLine>
                    <PlCascade
                        v-model={val[9]}
                        data={treeData}
                        labelField={'name'}
                        keyField={'id'}
                        childrenField={'subs'}
                        selectBranch
                    />
                </DemoRow>
                <DemoRow title={'动态加载'}>
                    <DemoLine>{JSON.stringify(state.formData)}</DemoLine>
                    <DemoLine>{[state.formData.level1Name, state.formData.level2Name, state.formData.level3Name].filter(item => !!item).join(' / ')}</DemoLine>
                    <PlCascade
                        modelValue={[state.formData.level1Key, state.formData.level2Key, state.formData.level3Key]}
                        onChange={onCascadeChange}
                        showFormat={() => [state.formData.level1Name, state.formData.level2Name, state.formData.level3Name].filter(item => !!item).join(' / ')}

                        labelField={'name'}
                        keyField={'id'}
                        childrenField={'subs'}
                        lazy
                        isLeaf={lazyDemo.isLeaf}
                        getChildren={lazyDemo.getChildren}
                    />
                </DemoRow>
                <DemoRow title={'输入筛选'}>
                    <DemoLine>{JSON.stringify(val[10])}</DemoLine>
                    <PlCascade
                        v-model={val[10]}
                        data={treeData}
                        labelField={'name'}
                        keyField={'id'}
                        childrenField={'subs'}
                        filterable
                    />
                </DemoRow>
                <DemoRow title={'自定义节点内容'}>
                    <DemoLine>{JSON.stringify(val[12])}</DemoLine>
                    <PlCascade
                        v-model={val[12]}
                        data={treeData}
                        labelField={'name'}
                        keyField={'id'}
                        childrenField={'subs'} v-slots={{
                        default: ({node, index}) => (<span>{index + 1}、{node.label}</span>),
                    }}/>
                </DemoRow>
                <DemoRow title={'禁用以及只读'}>
                    <DemoLine>
                        <PlCheckbox label={'禁用/只读'} v-model={val[13]}/>
                    </DemoLine>
                    <DemoLine>
                        <PlCascade
                            data={treeData}
                            labelField={'name'}
                            keyField={'id'}
                            childrenField={'subs'}
                            placeholder={'禁用'}
                            disabled={val[13]}/>
                        <PlCascade
                            data={treeData}
                            labelField={'name'}
                            keyField={'id'}
                            childrenField={'subs'}
                            placeholder={'只读'}
                            readonly={val[13]}/>
                    </DemoLine>
                </DemoRow>
            </DemoRow>
        </div>
    )
})
