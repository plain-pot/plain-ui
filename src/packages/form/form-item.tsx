import {designComponent} from "../../use/designComponent";
import {EditProps} from "../../use/useEdit";
import {StyleProps} from "../../use/useStyle";
import {useSlots} from "../../use/useSlots";
import {useRefs} from "../../use/useRefs";
import {useNumber} from "../../use/useNumber";
import {FormCollector} from "./form";
import {useStyles} from "../../use/useStyles";
import {unit} from "plain-utils/string/unit";
import {reactive, onMounted, computed} from 'vue';
import {useClass} from "../../use/useClasses";

export default designComponent({
    name: 'pl-form-item',
    props: {
        ...EditProps,
        ...StyleProps,

        label: {type: String, default: ' '},                                // 显示文本
        labelWidth: {type: [String, Number]},                               // 显示文本宽度
        column: {type: [String, Number], default: 1},                       // 多列表单的列数
        block: {type: Boolean},                                             // 占用一行
        colon: {type: Boolean, default: null},                              // label的冒号
    },
    emits: {},
    setup({props, event: {emit}}) {

        const form = FormCollector.child()
        const {slots} = useSlots(['label', 'suffix'], true)
        const {refs} = useRefs({label: HTMLDivElement,})

        /*---------------------------------------state-------------------------------------------*/

        const {numberState} = useNumber(props, ['labelWidth', 'column'])
        const state = reactive({
            labelWidth: 0,
        })

        /*---------------------------------------computed-------------------------------------------*/

        const colon = computed(() => props.colon == null ? form.props.colon : props.colon)

        const labelWidth = computed(() => numberState.labelWidth || form.numberState.labelWidth)
        const staticWidth = computed(() => !!labelWidth.value)

        const classes = useClass(() => [
            'pl-form-item',
            {
                'pl-form-item-static-width': staticWidth.value,
            }
        ])

        const styles = useStyles(style => {
            const {col} = form.widthState.value
            if (!!col) {
                style.width = unit(col * numberState.column)
            }
        })

        const labelStyles = useStyles(style => {
            if (!!labelWidth.value) {
                style.width = unit(labelWidth.value)
                style.overflow = 'hidden'
                style.textOverflow = 'ellipsis'
                style.whiteSpace = 'nowrap'
            }
        })

        const bodyStyles = useStyles(style => {
            style.width = unit(form.widthState.value.content)
        })

        /*---------------------------------------hook-------------------------------------------*/

        /**
         * 如果没有写死labelWidth，这mounted的时候计算label节点宽度
         * @author  韦胜健
         * @date    2020/12/11 21:32
         */
        if (!staticWidth.value) {
            onMounted(() => {
                state.labelWidth = refs.label.offsetWidth
            })
        }

        return {
            refer: {
                state,
            },
            render: () => (
                <div class={classes.value} style={styles.value}>
                    <div class="pl-form-item-label" style={labelStyles.value} ref="label">
                        {props.label}{!!colon.value && ' : '}
                    </div>
                    <div class="pl-form-item-body" style={bodyStyles.value}>
                        {slots.default()}
                    </div>
                </div>
            )
        }
    },
})