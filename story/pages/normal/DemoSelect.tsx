import {designPage, VueNode} from "plain-ui-composition";
import {DemoRow} from "../../components/DemoRow";
import {DemoLine} from "../../components/DemoLine";
import {PlSelect} from "../../../src/packages/PlSelect";
import {PlSelectOption} from "../../../src/packages/PlSelectOption";
import {PlSelectGroup} from "../../../src/packages/PlSelectGroup";
import {PlCheckbox} from "../../../src/packages/PlCheckbox";
import {reactive} from "vue";
// @ts-ignore
import addressData from '../data/address.json'
import {defer, DFD} from "plain-utils/utils/defer";
import {delay} from "plain-utils/utils/delay";
import {PlLoading} from "../../../src";
import {debounce} from "plain-utils/utils/debounce";

export const asyncDemo = designPage(() => {
    const state = reactive({
        formData: {
            code: null as any,
            display: null as null | string,
        },
    })

    const data = (addressData as any[]).map(({name, code}) => ({name, code}))

    const selectConfig = reactive({
        // 保存输入的搜索关键字，用来判断显示的内容
        filterText: '',
        // 选项数据
        options: [] as { label: string, val: string }[],
        // 任何选项都显示，因为选项都是通过搜索关键字异步加载出来的
        filterMethod: () => true,
        // 自定义无数据时显示的内容
        empty: (defaultEmpty: () => VueNode) => {
            if (selectConfig.dfd) {
                return null
            } else {
                if (!selectConfig.filterText) {
                    return (
                        <div class="pl-background-disabled-text" style={{padding: '12px 0', textAlign: 'center'}}>
                            请输入搜索关键字！
                        </div>
                    )
                }
                return defaultEmpty()
            }
        },
        // 只要promise存在，就显示加载状态
        dfd: null as null | DFD,
        // 当搜索关键字变化的时候，刷线promise
        onSearchChange: debounce(async (text: string | null) => {
            if (!!selectConfig.dfd) {
                selectConfig.dfd.reject('')
                selectConfig.dfd = null
            }
            selectConfig.filterText = text!
            if (!text) {
                selectConfig.options = []
            } else {
                // 这里模拟网络异步请求动作，等待1s~2s得到匹配的数据
                selectConfig.dfd = defer<any[]>()
                const timer = Math.random() * 1000 + 1000
                await delay(timer)
                selectConfig.options = data.filter(i => (i.name + i.code).indexOf(text) > -1).map(({name, code}) => ({label: name, val: code}))
                selectConfig.dfd = null
            }
        }, 300),
        // 监听选中变化动作
        onChange: (val?: any) => {
            if (!val) {
                state.formData = {
                    code: null,
                    display: null,
                }
            } else {
                state.formData = {
                    code: val,
                    display: selectConfig.options.find(i => i.val === val)?.label || null
                }
            }
        },
    })

    return () => <>
        <DemoRow title="异步数据">
            <PlSelect
                modelValue={state.formData.code}
                filterMethod={selectConfig.filterMethod}
                empty={selectConfig.empty}
                displayValue={state.formData.display!}

                onInputChange={selectConfig.onSearchChange}
                onChange={selectConfig.onChange}
            >
                {!!selectConfig.dfd ? (
                    <div class="pl-background-disabled-text" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '12px 0'}}>
                        <PlLoading style={{fontSize: '24px'}}/>
                        <span>数据加载中</span>
                    </div>
                ) : (
                    selectConfig.options.map((opt, index) => (
                        <PlSelectOption label={opt.label} val={opt.val} key={index}/>
                    ))
                )}
            </PlSelect>
            {JSON.stringify({optionsLen: selectConfig.options.length, val: state.formData.code, loading: !!selectConfig.dfd})}
        </DemoRow>
    </>
})

export const asyncDemoWithInitialValue = designPage(() => {
    const state = reactive({
        formData: {
            code: '440000' as any,
            display: '广东省' as any,
        },
    })

    const data = (addressData as any[]).map(({name, code}) => ({name, code}))

    const selectConfig = reactive({
        // 保存输入的搜索关键字，用来判断显示的内容
        filterText: '',
        // 选项数据
        options: [] as { label: string, val: string }[],
        // 任何选项都显示，因为选项都是通过搜索关键字异步加载出来的
        filterMethod: () => true,
        // 自定义无数据时显示的内容
        empty: (defaultEmpty: () => VueNode) => {
            if (selectConfig.dfd) {
                return null
            } else {
                if (!selectConfig.filterText) {
                    return (
                        <div class="pl-background-disabled-text" style={{padding: '12px 0', textAlign: 'center'}}>
                            请输入搜索关键字！
                        </div>
                    )
                }
                return defaultEmpty()
            }
        },
        // 只要promise存在，就显示加载状态
        dfd: null as null | DFD,
        // 当搜索关键字变化的时候，刷线promise
        onSearchChange: debounce(async (text: string | null) => {
            if (!!selectConfig.dfd) {
                selectConfig.dfd.reject('')
                selectConfig.dfd = null
            }
            selectConfig.filterText = text!
            if (!text) {
                selectConfig.options = []
            } else {
                // 这里模拟网络异步请求动作，等待1s~2s得到匹配的数据
                selectConfig.dfd = defer<any[]>()
                const timer = Math.random() * 1000 + 1000
                await delay(timer)
                selectConfig.options = data.filter(i => (i.name + i.code).indexOf(text) > -1).map(({name, code}) => ({label: name, val: code}))
                selectConfig.dfd = null
            }
        }, 300),
        // 监听选中变化动作
        onChange: (val?: any) => {
            if (!val) {
                state.formData = {
                    code: null,
                    display: null,
                }
            } else {
                state.formData = {
                    code: val,
                    display: selectConfig.options.find(i => i.val === val)?.label || null
                }
            }
        },
    })

    return () => <>
        <DemoRow title="异步数据:带初始值">
            <PlSelect
                modelValue={state.formData.code}
                filterMethod={selectConfig.filterMethod}
                empty={selectConfig.empty}
                displayValue={state.formData.display!}

                onInputChange={selectConfig.onSearchChange}
                onChange={selectConfig.onChange}
            >
                {!!selectConfig.dfd ? (
                    <div class="pl-background-disabled-text" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '12px 0'}}>
                        <PlLoading style={{fontSize: '24px'}}/>
                        <span>数据加载中</span>
                    </div>
                ) : (
                    selectConfig.options.map((opt, index) => (
                        <PlSelectOption label={opt.label} val={opt.val} key={index}/>
                    ))
                )}
            </PlSelect>
            {JSON.stringify({optionsLen: selectConfig.options.length, val: state.formData.code, loading: !!selectConfig.dfd})}
        </DemoRow>
    </>
})

export default designPage(() => {

    const val = reactive({val: {} as any}).val

    const list = [
        {name: '春节', val: 'Chun'},
        {name: '万圣节', val: 'WanSheng'},
        {name: '青年节', val: 'QinNian'},
        {name: '中年节', val: 'ZhongNian', isDisabled: true,},
        {name: '国庆节', val: 'GuoQing', isDisabled: true,},
        {name: '中秋节', val: 'ZhongQiu', isDisabled: true,},
        {name: '劳动节', val: 'LaoDong', isDisabled: true,},
        {name: '圣诞节', val: 'ShengDan'},
        {name: '儿童节', val: 'ErTong'},
        {name: '妇女节', val: 'FuNv'},
        {name: '教师节', val: 'JiaoShi'},
        {name: '清明节', val: 'QingMing'},
    ]

    const groupData = [
        {
            name: '操作类型',
            children: [
                {name: '添加', val: 'add', i: 'el-icon-folder-add'},
                {name: '删除', val: 'remove', i: 'el-icon-folder-remove'},
                {name: '通过', val: 'checked', i: 'el-icon-folder-checked'},
                {name: '不通过', val: 'delete', i: 'el-icon-folder-delete'},
            ],
        },
        {
            name: '文件夹类型',
            children: [
                {name: '展开', val: 'opened', i: 'el-icon-folder-opened'},
                {name: '收起', val: 'collapse', i: 'el-icon-folder-s'},
                {name: '空文件夹', val: 'empty', i: 'el-icon-folder'},
            ]
        }
    ]

    function customFilterMethod(input: string | undefined, item: { label: string, val: string }) {
        if (!input || !input.trim()) return true
        const {label, val} = item
        return (label.toLowerCase() + val.toLowerCase()).indexOf(input.toLowerCase()) > -1
    }

    return () => (
        <div>
            <DemoRow title={'基本用法'}>
                <DemoLine>{val[3]}</DemoLine>
                <PlSelect v-model={val[3]}>
                    {list.map(item => <PlSelectOption key={item.name} val={item.val} label={item.name}/>)}
                </PlSelect>
                <PlSelect v-model={val[3]}>
                    {list.map(item => <PlSelectOption key={item.name} val={item.val} label={item.name}/>)}
                </PlSelect>
            </DemoRow>
            <DemoRow title={'禁用选项'}>
                <PlSelect>
                    <PlSelectOption label="深圳市" val="shenzhen"/>
                    <PlSelectOption label="韶关市" val="shaoguan"/>
                    <PlSelectOption label="珠海市" val="zhuhai"/>
                    <PlSelectOption label="汕头市" val="shantou" disabled/>
                    <PlSelectOption label="佛山市" val="foshan"/>
                    <PlSelectOption label="江门市" val="jiangmen"/>
                    <PlSelectOption label="湛江市" val="zhanjiang" disabled/>
                    <PlSelectOption label="茂名市" val="maoming"/>
                    <PlSelectOption label="肇庆市" val="zhaoqing" disabled/>
                    <PlSelectOption label="惠州市" val="huizhou"/>
                    <PlSelectOption label="梅州市" val="meizhou"/>
                </PlSelect>
            </DemoRow>
            <DemoRow title={'分组'}>
                <PlSelect>
                    {groupData.map(group => (
                        <PlSelectGroup label={group.name} key={group.name}>
                            {group.children.map(child => (
                                <PlSelectOption label={child.name} val={child.val} key={child.val}/>
                            ))}
                        </PlSelectGroup>
                    ))}
                </PlSelect>
            </DemoRow>
            <DemoRow title={'图标'}>
                <PlSelect>
                    {groupData.map(group => (
                        <PlSelectGroup label={group.name} key={group.name}>
                            {group.children.map(child => (
                                <PlSelectOption label={child.name} val={child.val} key={child.val} icon={child.i}/>
                            ))}
                        </PlSelectGroup>
                    ))}
                </PlSelect>
            </DemoRow>
            <DemoRow title={'自定义内容'}>
                <PlSelect>
                    {groupData.map((group, groupIndex) => (
                        <PlSelectGroup label={group.name} key={groupIndex} v-slots={{
                            title: () => <>
                                    <span style={{
                                        fontStyle: 'italic',
                                        fontSize: '1.2em',
                                        marginRight: '6px',
                                        opacity: '0.5',
                                    }}>{groupIndex + 1}、</span>
                                <span>{group.name}</span>
                            </>,
                            default: () => <>
                                {group.children.map((child, childIndex) => (
                                    <PlSelectOption label={child.name} key={child.val} val={child.val}>
                                            <span style={{
                                                fontStyle: 'italic',
                                                fontSize: '1.2em',
                                                marginRight: '6px',
                                                opacity: '0.5',
                                            }}>{childIndex + 1}、</span>
                                        <span>{child.name}</span>
                                    </PlSelectOption>
                                ))}
                            </>
                        }}/>
                    ))}
                </PlSelect>
            </DemoRow>
            <DemoRow title={'加载状态'}>
                <PlCheckbox label={'loading'} v-model={val.loadingFlag}/>
                <PlSelect v-model={val[3]} loading={val.loadingFlag}>
                    {list.map(item => <PlSelectOption key={item.name} val={item.val} label={item.name}/>)}
                </PlSelect>
            </DemoRow>
            <DemoRow title={'filterable:false，禁用可输入筛选'}>
                <PlSelect v-model={val[3]} filterable={false}>
                    {list.map(item => <PlSelectOption key={item.name} val={item.val} label={item.name}/>)}
                </PlSelect>
            </DemoRow>
            <DemoRow title={'filterMethod，自定义输入筛选逻辑，支持中文以及拼音'}>
                <DemoLine>{val[4]}</DemoLine>
                <PlSelect v-model={val[4]} filterMethod={customFilterMethod}>
                    {list.map(item => <PlSelectOption key={item.name} val={item.val} label={item.name}/>)}
                </PlSelect>
            </DemoRow>
            <DemoRow title={'禁用以及只读'}>
                <DemoLine><PlCheckbox label={'禁用/只读'} v-model={val.notEditable}/></DemoLine>
                <PlSelect v-model={val[4]} disabled={val.notEditable}>
                    {list.map(item => <PlSelectOption key={item.name} val={item.val} label={item.name}/>)}
                </PlSelect>
                <PlSelect v-model={val[4]} readonly={val.notEditable}>
                    {list.map(item => <PlSelectOption key={item.name} val={item.val} label={item.name}/>)}
                </PlSelect>
            </DemoRow>
            <DemoRow title={'多选'}>
                <DemoLine>{val[5]}</DemoLine>
                <PlSelect v-model={val[5]} multiple>
                    {list.map(item => <PlSelectOption key={item.name} val={item.val} label={item.name}/>)}
                </PlSelect>
                <PlSelect v-model={val[5]} multiple>
                    {list.map(item => <PlSelectOption key={item.name} val={item.val} label={item.name}/>)}
                </PlSelect>
            </DemoRow>
            <DemoRow title={'多选：最多可以选择3个元素，最少可以选择1个元素'}>
                <DemoLine>{val[6]}</DemoLine>
                <PlSelect v-model={val[6]} multiple multipleMaxLimit={3} multipleMinLimit={1}>
                    {list.map(item => <PlSelectOption key={item.name} val={item.val} label={item.name}/>)}
                </PlSelect>
            </DemoRow>
        </div>
    )
})
