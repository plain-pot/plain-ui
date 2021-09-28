import {designPage, reactive} from "plain-design-composition";
import {DemoRow} from "../../components/DemoRow";
import PlDropdown from "../../../src/packages/PlDropdown";
import PlButton from "../../../src/packages/PlButton";
import PlDropdownMenu from "../../../src/packages/PlDropdownMenu";
import PlDropdownOption from "../../../src/packages/PlDropdownOption";
import $$message from "../../../src/packages/$$message";
import PlButtonGroup from "../../../src/packages/PlButtonGroup";
import PlDropdownGroup from "../../../src/packages/PlDropdownGroup";
import PlIcon from "../../../src/packages/PlIcon";
import PlCheckbox from "../../../src/packages/PlCheckbox";

export default designPage(() => {

    const state = reactive({
        val: {} as any,
        flag: true,
    })

    return () => (
        <div>
            <DemoRow title={'基本用法'}>
                <PlCheckbox v-model={state.flag} label="响应式内容设计"/>
                <PlButtonGroup>
                    <PlDropdown v-slots={{
                        default: () => <PlButton label={'Dropdown'}/>,
                        popper: () => (
                            <PlDropdownMenu>
                                {state.flag && <>
                                    <PlDropdownOption label={'新建 Create'} onClick={() => $$message('新建 Create')}/>
                                    <PlDropdownOption label={'编辑 Edit'} onClick={() => $$message('编辑 Edit')}/>
                                    <PlDropdownOption label={'删除 Delete'} onClick={() => $$message('删除 Delete')}/>
                                    <PlDropdownOption label={'导入 Import'} onClick={() => $$message('导入 Import')}/>
                                </>}
                                <PlDropdownOption label={'导出 Export'} onClick={() => $$message('导出 Export')}/>
                                <PlDropdownOption label={'筛选 Filter'} onClick={() => $$message('筛选 Filter')}/>
                                <PlDropdownOption label={'排序 Sort'} onClick={() => $$message('排序 Sort')}/>
                                <PlDropdownOption label={'多选 Select'} onClick={() => $$message('多选 Select')}/>
                            </PlDropdownMenu>
                        )
                    }}/>
                </PlButtonGroup>
            </DemoRow>

            <DemoRow title={'选项对其方式'}>
                <PlDropdown v-slots={{
                    default: () => <PlButton label={'Dropdown'}/>,
                    popper: () => (
                        <PlDropdownMenu>
                            <PlDropdownOption label={'左对齐 align left'} align={'left'} onClick={() => $$message('新建 Create')}/>
                            <PlDropdownOption label={'居中对齐'} align={'center'} onClick={() => $$message('编辑 Edit')}/>
                            <PlDropdownOption label={'右对齐'} align={'right'} onClick={() => $$message('删除 Delete')}/>
                        </PlDropdownMenu>
                    )
                }}/>
            </DemoRow>

            <DemoRow title={'选项自定义内容'}>
                <PlDropdown v-slots={{
                    default: () => <PlButton label={'Dropdown'}/>,
                    popper: () => (
                        <PlDropdownMenu>
                            <PlDropdownOption onClick={() => $$message('新建')}>
                                <span>1、新建</span>
                            </PlDropdownOption>
                            <PlDropdownOption onClick={() => $$message('编辑')}>
                                <span>2、编辑</span>
                            </PlDropdownOption>
                            <PlDropdownOption onClick={() => $$message('删除')}>
                                <span>3、删除</span>
                            </PlDropdownOption>
                        </PlDropdownMenu>
                    )
                }}/>
            </DemoRow>
            <DemoRow title={'宽高设置'}>
                <PlDropdown height={150} width={80} v-slots={{
                    default: () => <PlButton label={'Dropdown'}/>,
                    popper: () => (
                        <PlDropdownMenu>
                            <PlDropdownOption label={'新建 Create'} onClick={() => $$message('新建 Create')}/>
                            <PlDropdownOption label={'编辑 Edit'} onClick={() => $$message('编辑 Edit')}/>
                            <PlDropdownOption label={'删除 Delete'} onClick={() => $$message('删除 Delete')}/>
                            <PlDropdownOption label={'导入 Import'} onClick={() => $$message('导入 Import')}/>
                            <PlDropdownOption label={'导出 Export'} onClick={() => $$message('导出 Export')}/>
                            <PlDropdownOption label={'筛选 Filter'} onClick={() => $$message('筛选 Filter')}/>
                            <PlDropdownOption label={'排序 Sort'} onClick={() => $$message('排序 Sort')}/>
                            <PlDropdownOption label={'多选 Select'} onClick={() => $$message('多选 Select')}/>
                        </PlDropdownMenu>
                    )
                }}/>
            </DemoRow>

            <DemoRow title={'触发器'}>
                <PlButtonGroup>
                    {['click', 'focus', 'hover'].map(trigger => (
                        <PlDropdown key={trigger} trigger={trigger} v-slots={{
                            default: () => <PlButton label={trigger}/>,
                            popper: () => (
                                <PlDropdownMenu>
                                    <PlDropdownOption label={'新建 Create'} onClick={() => $$message('新建 Create')}/>
                                    <PlDropdownOption label={'编辑 Edit'} onClick={() => $$message('编辑 Edit')}/>
                                    <PlDropdownOption label={'删除 Delete'} onClick={() => $$message('删除 Delete')}/>
                                    <PlDropdownOption label={'导入 Import'} onClick={() => $$message('导入 Import')}/>
                                    <PlDropdownOption label={'导出 Export'} onClick={() => $$message('导出 Export')}/>
                                    <PlDropdownOption label={'筛选 Filter'} onClick={() => $$message('筛选 Filter')}/>
                                    <PlDropdownOption label={'排序 Sort'} onClick={() => $$message('排序 Sort')}/>
                                    <PlDropdownOption label={'多选 Select'} onClick={() => $$message('多选 Select')}/>
                                </PlDropdownMenu>
                            )
                        }}/>
                    ))}
                </PlButtonGroup>
                <PlButtonGroup>
                    <PlDropdown trigger={'manual'} v-model={state.val[0]} v-slots={{
                        default: () => <PlButton label={'manual'}/>,
                        popper: () => (
                            <PlDropdownMenu>
                                <PlDropdownOption label={'新建 Create'} onClick={() => $$message('新建 Create')}/>
                                <PlDropdownOption label={'编辑 Edit'} onClick={() => $$message('编辑 Edit')}/>
                                <PlDropdownOption label={'删除 Delete'} onClick={() => $$message('删除 Delete')}/>
                                <PlDropdownOption label={'导入 Import'} onClick={() => $$message('导入 Import')}/>
                                <PlDropdownOption label={'导出 Export'} onClick={() => $$message('导出 Export')}/>
                                <PlDropdownOption label={'筛选 Filter'} onClick={() => $$message('筛选 Filter')}/>
                                <PlDropdownOption label={'排序 Sort'} onClick={() => $$message('排序 Sort')}/>
                                <PlDropdownOption label={'多选 Select'} onClick={() => $$message('多选 Select')}/>
                            </PlDropdownMenu>
                        )
                    }}/>
                    <PlButton label={`点击：${state.val[0] ? '展开' : '关闭'}`} onClick={() => state.val[0] = !state.val[0]}/>
                </PlButtonGroup>
            </DemoRow>

            <DemoRow title={'禁用选项'}>
                <PlDropdown v-slots={{
                    default: () => <PlButton label={'Dropdown'}/>,
                    popper: () => (
                        <PlDropdownMenu>
                            <PlDropdownOption label={'新建 Create'} onClick={() => $$message('新建 Create')}/>
                            <PlDropdownOption label={'编辑 Edit'} onClick={() => $$message('编辑 Edit')} disabled/>
                            <PlDropdownOption label={'删除 Delete'} onClick={() => $$message('删除 Delete')}/>
                            <PlDropdownOption label={'导入 Import'} onClick={() => $$message('导入 Import')} disabled/>
                            <PlDropdownOption label={'导出 Export'} onClick={() => $$message('导出 Export')}/>
                            <PlDropdownOption label={'筛选 Filter'} onClick={() => $$message('筛选 Filter')} disabled/>
                            <PlDropdownOption label={'排序 Sort'} onClick={() => $$message('排序 Sort')}/>
                            <PlDropdownOption label={'多选 Select'} onClick={() => $$message('多选 Select')}/>
                        </PlDropdownMenu>
                    )
                }}/>
            </DemoRow>

            <DemoRow title={'选项图标'}>
                <PlDropdown v-slots={{
                    default: () => <PlButton label={'Dropdown'}/>,
                    popper: () => (
                        <PlDropdownMenu>
                            <PlDropdownOption label={'新建 Create'} onClick={() => $$message('新建 Create')} icon="el-icon-document-add"/>
                            <PlDropdownOption label={'编辑 Edit'} onClick={() => $$message('编辑 Edit')} disabled icon="el-icon-document"/>
                            <PlDropdownOption label={'删除 Delete'} onClick={() => $$message('删除 Delete')} icon="el-icon-document-remove"/>
                            <PlDropdownOption label={'导入 Import'} onClick={() => $$message('导入 Import')} disabled icon="el-icon-download"/>
                            <PlDropdownOption label={'导出 Export'} onClick={() => $$message('导出 Export')} icon="el-icon-upload1"/>
                            <PlDropdownOption label={'筛选 Filter'} onClick={() => $$message('筛选 Filter')} disabled icon="el-icon-crop"/>
                            <PlDropdownOption label={'排序 Sort'} onClick={() => $$message('排序 Sort')} icon="el-icon-s-fold"/>
                            <PlDropdownOption label={'多选 Select'} onClick={() => $$message('多选 Select')} icon="el-icon-folder-opened"/>
                        </PlDropdownMenu>
                    )
                }}/>
            </DemoRow>

            <DemoRow title={'选项分组'}>
                <PlDropdown v-slots={{
                    default: () => <PlButton label={'Dropdown'}/>,
                    popper: () => (
                        <PlDropdownMenu>
                            <PlDropdownGroup title={'编辑'}>
                                <PlDropdownOption label={'新建 Create'} onClick={() => $$message('新建 Create')} icon="el-icon-document-add"/>
                                <PlDropdownOption label={'编辑 Edit'} onClick={() => $$message('编辑 Edit')} disabled icon="el-icon-document"/>
                                <PlDropdownOption label={'删除 Delete'} onClick={() => $$message('删除 Delete')} icon="el-icon-document-remove"/>
                            </PlDropdownGroup>
                            <PlDropdownGroup title={'数据'}>
                                <PlDropdownOption label={'导入 Import'} onClick={() => $$message('导入 Import')} disabled icon="el-icon-download"/>
                                <PlDropdownOption label={'导出 Export'} onClick={() => $$message('导出 Export')} icon="el-icon-upload1"/>
                            </PlDropdownGroup>
                            <PlDropdownGroup title={'搜索'}>
                                <PlDropdownOption label={'筛选 Filter'} onClick={() => $$message('筛选 Filter')} disabled icon="el-icon-crop"/>
                                <PlDropdownOption label={'排序 Sort'} onClick={() => $$message('排序 Sort')} icon="el-icon-s-fold"/>
                            </PlDropdownGroup>
                            <PlDropdownGroup title={'其他'}>
                                <PlDropdownOption label={'多选 Select'} onClick={() => $$message('多选 Select')}/>
                                <PlDropdownOption label={'设置 Config'} onClick={() => $$message('多选 Select')}/>
                            </PlDropdownGroup>
                        </PlDropdownMenu>
                    )
                }}/>
            </DemoRow>

            <DemoRow title={'固定高度'}>
                <PlDropdown height={200} v-slots={{
                    default: () => <PlButton label={'200px'}/>,
                    popper: () => (
                        <PlDropdownMenu>
                            <PlDropdownGroup title={'编辑'}>
                                <PlDropdownOption label={'新建 Create'} onClick={() => $$message('新建 Create')} icon="el-icon-document-add"/>
                                <PlDropdownOption label={'编辑 Edit'} onClick={() => $$message('编辑 Edit')} disabled icon="el-icon-document"/>
                                <PlDropdownOption label={'删除 Delete'} onClick={() => $$message('删除 Delete')} icon="el-icon-document-remove"/>
                            </PlDropdownGroup>
                            <PlDropdownGroup title={'数据'}>
                                <PlDropdownOption label={'导入 Import'} onClick={() => $$message('导入 Import')} disabled icon="el-icon-download"/>
                                <PlDropdownOption label={'导出 Export'} onClick={() => $$message('导出 Export')} icon="el-icon-upload1"/>
                            </PlDropdownGroup>
                            <PlDropdownGroup title={'搜索'}>
                                <PlDropdownOption label={'筛选 Filter'} onClick={() => $$message('筛选 Filter')} disabled icon="el-icon-crop"/>
                                <PlDropdownOption label={'排序 Sort'} onClick={() => $$message('排序 Sort')} icon="el-icon-s-fold"/>
                            </PlDropdownGroup>
                            <PlDropdownGroup title={'其他'}>
                                <PlDropdownOption label={'多选 Select'} onClick={() => $$message('多选 Select')}/>
                                <PlDropdownOption label={'设置 Config'} onClick={() => $$message('多选 Select')}/>
                            </PlDropdownGroup>
                        </PlDropdownMenu>
                    )
                }}/>
            </DemoRow>

            <DemoRow title={'无标题，仅有分割线'}>
                <PlDropdown height={200} v-slots={{
                    default: () => <PlButton label={'200px'}/>,
                    popper: () => (
                        <PlDropdownMenu>
                            <PlDropdownGroup>
                                <PlDropdownOption label={'新建 Create'} onClick={() => $$message('新建 Create')} icon="el-icon-document-add"/>
                                <PlDropdownOption label={'编辑 Edit'} onClick={() => $$message('编辑 Edit')} disabled icon="el-icon-document"/>
                                <PlDropdownOption label={'删除 Delete'} onClick={() => $$message('删除 Delete')} icon="el-icon-document-remove"/>
                            </PlDropdownGroup>
                            <PlDropdownGroup>
                                <PlDropdownOption label={'导入 Import'} onClick={() => $$message('导入 Import')} disabled icon="el-icon-download"/>
                                <PlDropdownOption label={'导出 Export'} onClick={() => $$message('导出 Export')} icon="el-icon-upload1"/>
                            </PlDropdownGroup>
                            <PlDropdownGroup>
                                <PlDropdownOption label={'筛选 Filter'} onClick={() => $$message('筛选 Filter')} disabled icon="el-icon-crop"/>
                                <PlDropdownOption label={'排序 Sort'} onClick={() => $$message('排序 Sort')} icon="el-icon-s-fold"/>
                            </PlDropdownGroup>
                            <PlDropdownGroup>
                                <PlDropdownOption label={'多选 Select'} onClick={() => $$message('多选 Select')}/>
                                <PlDropdownOption label={'设置 Config'} onClick={() => $$message('多选 Select')}/>
                            </PlDropdownGroup>
                        </PlDropdownMenu>
                    )
                }}/>
            </DemoRow>

            <DemoRow title={'指示图标'}>
                <PlDropdown v-slots={{
                    reference: ({open}) => (
                        <PlButton>
                            <span>切换图标</span>
                            <PlIcon icon={open ? 'el-icon-arrow-up' : 'el-icon-arrow-down'}/>
                        </PlButton>
                    ),
                    popper: () => (
                        <PlDropdownMenu>
                            <PlDropdownOption label={'新建 Create'} onClick={() => $$message('新建 Create')}/>
                            <PlDropdownOption label={'编辑 Edit'} onClick={() => $$message('编辑 Edit')}/>
                            <PlDropdownOption label={'删除 Delete'} onClick={() => $$message('删除 Delete')}/>
                            <PlDropdownOption label={'导入 Import'} onClick={() => $$message('导入 Import')}/>
                            <PlDropdownOption label={'导出 Export'} onClick={() => $$message('导出 Export')}/>
                            <PlDropdownOption label={'筛选 Filter'} onClick={() => $$message('筛选 Filter')}/>
                            <PlDropdownOption label={'排序 Sort'} onClick={() => $$message('排序 Sort')}/>
                            <PlDropdownOption label={'多选 Select'} onClick={() => $$message('多选 Select')}/>
                        </PlDropdownMenu>
                    )
                }}/>

                <PlDropdown v-slots={{
                    reference: ({open}) => (
                        <PlButton>
                            <span>图标旋转过度</span>
                            <PlIcon icon={'el-icon-arrow-down'} style={{
                                transition: 'transform 200ms linear',
                                transform: `rotateX(${open ? 180 : 0}deg)`,
                            }}/>
                        </PlButton>
                    ),
                    popper: () => (
                        <PlDropdownMenu>
                            <PlDropdownOption label={'新建 Create'} onClick={() => $$message('新建 Create')}/>
                            <PlDropdownOption label={'编辑 Edit'} onClick={() => $$message('编辑 Edit')}/>
                            <PlDropdownOption label={'删除 Delete'} onClick={() => $$message('删除 Delete')}/>
                            <PlDropdownOption label={'导入 Import'} onClick={() => $$message('导入 Import')}/>
                            <PlDropdownOption label={'导出 Export'} onClick={() => $$message('导出 Export')}/>
                            <PlDropdownOption label={'筛选 Filter'} onClick={() => $$message('筛选 Filter')}/>
                            <PlDropdownOption label={'排序 Sort'} onClick={() => $$message('排序 Sort')}/>
                            <PlDropdownOption label={'多选 Select'} onClick={() => $$message('多选 Select')}/>
                        </PlDropdownMenu>
                    )
                }}/>

                <PlButtonGroup>
                    <PlButton label={'搭配按钮组'}/>
                    <PlDropdown v-slots={{
                        reference: ({open}) => (
                            <PlButton>
                                <span>下拉按钮</span>
                                <PlIcon icon={'el-icon-arrow-down'} style={{
                                    transition: 'transform 200ms linear',
                                    transform: `rotateX(${open ? 180 : 0}deg)`,
                                }}/>
                            </PlButton>
                        ),
                        popper: () => (
                            <PlDropdownMenu>
                                <PlDropdownOption label={'新建 Create'} onClick={() => $$message('新建 Create')}/>
                                <PlDropdownOption label={'编辑 Edit'} onClick={() => $$message('编辑 Edit')}/>
                                <PlDropdownOption label={'删除 Delete'} onClick={() => $$message('删除 Delete')}/>
                                <PlDropdownOption label={'导入 Import'} onClick={() => $$message('导入 Import')}/>
                                <PlDropdownOption label={'导出 Export'} onClick={() => $$message('导出 Export')}/>
                                <PlDropdownOption label={'筛选 Filter'} onClick={() => $$message('筛选 Filter')}/>
                                <PlDropdownOption label={'排序 Sort'} onClick={() => $$message('排序 Sort')}/>
                                <PlDropdownOption label={'多选 Select'} onClick={() => $$message('多选 Select')}/>
                            </PlDropdownMenu>
                        )
                    }}/>
                </PlButtonGroup>

                <PlDropdown v-slots={{
                    reference: ({open}) => (
                        <span>
                                <span>任意内容</span>
                                <PlIcon icon={'el-icon-arrow-down'} style={{
                                    transition: 'transform 200ms linear',
                                    transform: `rotateX(${open ? 180 : 0}deg)`,
                                }}/>
                            </span>
                    ),
                    popper: () => (
                        <PlDropdownMenu>
                            <PlDropdownOption label={'新建 Create'} onClick={() => $$message('新建 Create')}/>
                            <PlDropdownOption label={'编辑 Edit'} onClick={() => $$message('编辑 Edit')}/>
                            <PlDropdownOption label={'删除 Delete'} onClick={() => $$message('删除 Delete')}/>
                            <PlDropdownOption label={'导入 Import'} onClick={() => $$message('导入 Import')}/>
                            <PlDropdownOption label={'导出 Export'} onClick={() => $$message('导出 Export')}/>
                            <PlDropdownOption label={'筛选 Filter'} onClick={() => $$message('筛选 Filter')}/>
                            <PlDropdownOption label={'排序 Sort'} onClick={() => $$message('排序 Sort')}/>
                            <PlDropdownOption label={'多选 Select'} onClick={() => $$message('多选 Select')}/>
                        </PlDropdownMenu>
                    )
                }}/>
            </DemoRow>
        </div>
    )
})
