import {designComponent} from "../../use/designComponent";
import {useSlots} from "../../use/useSlots";
import {useRefs} from "../../use/useRefs";
import Scroll from '../scroll'

export const VirtualTable = designComponent({
    name: 'pl-virtual-table',
    props: {
        data: {type: Array, require: true, default: []},            // 要渲染的长数据
        size: {type: Number, require: true, default: 40},           // 每一行高度
        dynamicSize: {type: Boolean},                               // 标识列表中的每一行高度不是固定的，但是还是需要提供 size 属性，而且size属性不能与每一行的高度差距太多；
        disabled: {type: Boolean},                                  // 禁用虚拟滚动

        summaryData: {type: Array},                                 // 合计行数据
        width: {type: Number},                                      // 表格总宽度
    },
    setup({props}) {

        const {slots} = useSlots([
            'colgroup'
        ])
        const {refs} = useRefs({
            scroll: Scroll,
        })




        return {
            render: () => slots.default()
        }
    },
})