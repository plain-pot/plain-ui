import {designPage} from "plain-design-composition";
import {DemoRow} from "../../components/DemoRow";
import PlButton from "../../../src/packages/PlButton";
import useContextmenu from "../../../src/packages/useContextmenu";
import PlDropdownMenu from "../../../src/packages/PlDropdownMenu";
import PlDropdownOption from "../../../src/packages/PlDropdownOption";
import $$message from "../../../src/packages/$$message";

export default designPage(() => {

    const $contextmenu = useContextmenu()

    const useByContextmenu = (e: MouseEvent) => {
        e.preventDefault()
        useByClick(e)
    }

    const useByClick = (e: MouseEvent) => {
        $contextmenu(e, () => (
            <PlDropdownMenu>
                <PlDropdownOption>第一个选项</PlDropdownOption>
                <PlDropdownOption>第二个选项</PlDropdownOption>
                <PlDropdownOption>第三个选项</PlDropdownOption>
            </PlDropdownMenu>
        ))
    }

    const useByReference = (e: MouseEvent) => {
        $contextmenu(e.currentTarget, () => (
            <PlDropdownMenu>
                <PlDropdownOption>第一个选项</PlDropdownOption>
                <PlDropdownOption>第二个选项</PlDropdownOption>
                <PlDropdownOption>第三个选项</PlDropdownOption>
            </PlDropdownMenu>
        ))
    }

    const useWithIcon = (e: MouseEvent) => {
        $contextmenu(e.currentTarget, () => (
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
        ))
    }

    return () => (
        <div>
            <DemoRow title={'reference 类型'}>
                <PlButton label={'右键菜单(contextmenu.target)'} onContextmenu={useByContextmenu}/>
                <PlButton label={'单击菜单(click.target)'} onClick={useByClick}/>
                <PlButton label={'目标菜单(click.currentTarget)'} onClick={useByReference}/>
            </DemoRow>
            <DemoRow title={'选项图标'}>
                <PlButton label={'CONTEXT MENU'} onClick={useWithIcon}/>
            </DemoRow>
        </div>
    )
})
