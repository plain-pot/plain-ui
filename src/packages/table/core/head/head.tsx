import {designComponent} from "../../../../use/designComponent";
import {PropType} from 'vue';
import {PlainTable} from "../../table";
import Scroll from '../../../scroll'

export const PltHead = designComponent({
    name: 'plt-head',
    props: {
        table: {type: Object as PropType<PlainTable>, required: true},
    },
    setup({props}) {
        return {
            render: () => (
                <div>
                    <Scroll scrollX>
                        <table>
                            <colgroup>
                                {props.table.plcData.value!.plcList.map((plc) => (
                                    <col style={""}/>
                                ))}
                            </colgroup>
                            <tr>
                                <td>张三</td>
                                <td>李四</td>
                                <td>王五</td>
                                <td>赵六</td>
                            </tr>
                        </table>
                    </Scroll>
                </div>
            )
        }
    },
})