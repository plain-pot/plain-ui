import {designPage} from "plain-ui-composition";
import './DemoColor.scss'
import {DemoRow} from "../../components/DemoRow";

export default designPage(() => {

    const state = {
        status: [
            {name: '基础', status: 'primary'},
            {name: '成功', status: 'success'},
            {name: '警告', status: 'warn'},
            {name: '错误', status: 'error'},
            {name: '帮助', status: 'info'},
        ],
        statusBackground: {
            title: '状态背景色',
            data: [
                {desc: '基础背景', clz: 'pl-background-primary'},
                {desc: '成功背景', clz: 'pl-background-success'},
                {desc: '警告背景', clz: 'pl-background-warn'},
                {desc: '危险背景', clz: 'pl-background-error'},
                {desc: '提示背景', clz: 'pl-background-info'},
            ],
        },
        disabledBackgroundColor: {
            title: '禁用背景色',
            data: [
                {desc: '禁用背景', clz: 'pl-background-disabled'},
                {desc: '禁用背景(轻)', clz: 'pl-background-disabled-light'},
                {desc: '禁用背景(深)', clz: 'pl-background-disabled-deep'},
            ],
        },
        fontColor: [
            {
                title: '状态字体色',
                data: [
                    {desc: '基础文字', clz: 'pl-text-primary'},
                    {desc: '成功文字', clz: 'pl-text-success'},
                    {desc: '警告文字', clz: 'pl-text-warn'},
                    {desc: '危险文字', clz: 'pl-text-error'},
                    {desc: '提示文字', clz: 'pl-text-info'},
                ],
            },
            {
                title: '其他字体色',
                data: [
                    {desc: '正文', clz: 'pl-text-color'},
                    {desc: '正文(轻)', clz: 'pl-text-color-light'},
                    {desc: '标题', clz: 'pl-title-color'},
                    {desc: '占位符', clz: 'pl-placeholder-color'},
                    {desc: '图标', clz: 'pl-icon-color'},
                    {desc: '禁用文字', clz: 'pl-background-disabled-text'},
                ],
            },
        ],
    }

    return () => (
        <div class={'demo-color'}>
            {state.fontColor.map(list => (
                <DemoRow key={list.title} title={list.title}>
                    <div class={'doc-theme-font-color-list'}>
                        {list.data.map(item => (
                            <div class={'doc-theme-font-color-item'} key={item.clz}>
                                <div class={item.clz}>{item.desc}</div>
                                <div>.{item.clz}</div>
                            </div>
                        ))}
                    </div>
                </DemoRow>
            ))}

            <DemoRow title={state.statusBackground.title}>
                <div class={'doc-theme-background-color-list doc-theme-background-status'}>
                    {state.statusBackground.data.map(item => (
                        <div class={`doc-theme-font-color-item ${item.clz}`} key={item.clz}>
                            <div>
                                <span>{item.desc}</span>
                                <span>.{item.clz}</span>
                            </div>
                            <div></div>
                        </div>
                    ))}
                </div>
            </DemoRow>

            <DemoRow title={state.disabledBackgroundColor.title}>
                <div class={'doc-theme-background-color-list doc-theme-background-status doc-theme-background-disabled'}>
                    {state.disabledBackgroundColor.data.map(item => (
                        <div class={`doc-theme-font-color-item ${item.clz}`} key={item.clz}>
                            <div>
                                <span>{item.desc}</span>
                                <span>.{item.clz}</span>
                            </div>
                            <div></div>
                        </div>
                    ))}
                </div>
            </DemoRow>
        </div>
    )
})