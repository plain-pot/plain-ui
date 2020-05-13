import {computed, defineComponent, reactive} from "@vue/composition-api";
import {FormatPropsType, useEmit, useProps} from "@/util/use";
import PlainUtils from '../../../submodules/plain-utils'
import {button} from "@/index";
import ClickWave from "@/directives/click-wave";

export default defineComponent({
    name: 'pl-button',
    directives: {ClickWave},
    props: {
        mode: {type: String, default: 'fill'},                  // fill,stroke,text
        label: {type: String},                                  // 按钮文本
        width: {type: [String, Number]},                        // 按钮宽度
        icon: {type: String},                                   // 按钮图标
        active: {type: Boolean},                                // 按钮是否高亮
        noPadding: {type: Boolean},                             // 按钮是否无边距
        block: {type: Boolean},                                 // 块级元素
        throttleClick: {type: [Boolean, Number]},               // click节流
        autoLoading: {type: Boolean},                           // 在执行click处理函数时，是否自动变更为加载状态

        /*native*/
        type: {type: String, default: 'button'},
        nativeProps: {},
    },
    setup(props, context) {

        /*---------------------------------------state-------------------------------------------*/

        const propsState = useProps(props, {
            width: FormatPropsType.number,
            label: FormatPropsType.promise,
        })
        const state = reactive({
            wave: false,
        })

        /*---------------------------------------emitter-------------------------------------------*/

        const emit = useEmit(context, {
            click: '单机事件',
            focus: '获取焦点事件',
        })


        /*---------------------------------------computed-------------------------------------------*/

        const classes = computed(() => ([
            'pl-button',
            'plain-click-node',

            // `pl-button-status-${this.p_status || 'primary'}`,
            `pl-button-mode-${props.mode}`,
            // `pl-button-shape-${this.p_shape || 'fillet'}`,
            // `pl-button-size-${this.p_size || 'normal'}`,
            `pl-button-status-primary`,
            `pl-button-shape-fillet`,
            `pl-button-size-normal`,

            {
                'pl-button-icon': !!props.icon,
                'pl-button-active': !!props.active,
                'pl-button-noPadding': !!props.noPadding,

                // 'pl-button-loading': !!this.isLoading,
                'pl-button-wave': !!state.wave,
                'pl-button-has-icon': !!props.icon,
                'pl-button-block': !!props.block,
                // 'pl-button-disabled': !!this.isDisabled,
                'pl-button-icon-only': !!props.icon && !propsState.label,
            },
        ]))

        const styles = computed(() => ({
            width: PlainUtils.suffixPx(propsState.width),
        }))

        /*---------------------------------------handler-------------------------------------------*/

        const handler = {
            click: (e: MouseEvent) => {
                emit.click(e)
            },
        }

        /*---------------------------------------render-------------------------------------------*/

        return () => (
            <button
                style={styles.value}
                class={classes.value}
                {...{directives: [{name: 'click-wave', value: 'large'}]}}
                onClick={handler.click}
            >
                {propsState.label}
            </button>
        )
    },
})