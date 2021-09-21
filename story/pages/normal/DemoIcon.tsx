import {designComponent} from "plain-ui-composition";
import {DemoRow} from "../../components/DemoRow";
import {PlIcon} from "../../../src/packages/PlIcon";

export default designComponent({
    setup() {
        return () => (
            <div>
                <DemoRow title={'基本用法'}>
                    <span>普通的文本：NORMAL normal</span>
                    <PlIcon icon="el-icon-bell"/>
                    <PlIcon icon="el-icon-bottom"/>
                </DemoRow>

                <DemoRow title={"状态"}>
                    {['primary', 'success', 'warn', 'error', 'info'].map(status => <PlIcon icon={"el-icon-search"} status={status} key={status}/>)}
                </DemoRow>
            </div>
        )
    },
})