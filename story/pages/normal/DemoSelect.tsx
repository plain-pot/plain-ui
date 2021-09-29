import {designPage} from "plain-ui-composition";
import {DemoRow} from "../../components/DemoRow";
import {DemoLine} from "../../components/DemoLine";
import {PlSelect} from "../../../src/packages/PlSelect";
import {PlSelectOption} from "../../../src/packages/PlSelectOption";
import {PlSelectGroup} from "../../../src/packages/PlSelectGroup";
import {PlCheckbox} from "../../../src/packages/PlCheckbox";
import {reactive} from "vue";

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
