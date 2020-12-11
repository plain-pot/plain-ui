import {designComponent} from "../../use/designComponent";
import {EditProps} from "../../use/useEdit";
import {StyleProps} from "../../use/useStyle";
import {useSlots} from "../../use/useSlots";
import {useRefs} from "../../use/useRefs";
import {useNumber} from "../../use/useNumber";
import {FormCollector} from "./form";
import {useStyles} from "../../use/useStyles";
import {unit} from "plain-utils/string/unit";

export default designComponent({
    name: 'pl-form-item',
    props: {
        ...EditProps,
        ...StyleProps,

        label: {type: String, default: ' '},                                // 显示文本
        labelWidth: {type: [String, Number]},                               // 显示文本宽度
        column: {type: [String, Number]},                                   // 多列表单的列数
        block: {type: Boolean},                                             // 占用一行
    },
    emits: {},
    setup({props, event: {emit}}) {

        const form = FormCollector.child()
        const {slots} = useSlots(['label', 'suffix'], true)
        const {refs} = useRefs({el: HTMLDivElement,})
        const {numberState} = useNumber(props, ['labelWidth', 'column'])

        const labelStyles = useStyles(style => {
            if (!!numberState.labelWidth) {
                style.width = unit(numberState.labelWidth)
            }

        })

        return {
            render: () => (
                <div class="pl-form-item">
                    <div class="pl-form-item-label">
                        {props.label}
                    </div>
                    <div class="pl-form-item-body">
                        {slots.default()}
                    </div>
                </div>
            )
        }
    },
})