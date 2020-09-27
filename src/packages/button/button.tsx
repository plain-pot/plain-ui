import {computed, defineComponent, inject, reactive, watch} from "@vue/composition-api";

import PlainUtils from '../../../submodules/plain-utils'
import ClickWave from "@/directives/click-wave";
import {BUTTON_GROUP_PROVIDER} from "@/packages/button/button-group";
import {EmitFunc, useEvent} from "@/use/useEvent";
import {EditProps, useEdit} from "@/use/useEdit";
import {StyleProps, useStyle} from "@/use/useStyle";
import {FormatPropsType, useProps} from "@/use/useProps";
import {useSlots} from "@/use/useSlots";
import {DEFAULT_STATUS} from "@/packages/base";
import {designComponent} from "@/use/designComponent";

export default designComponent(
    'pl-button',
    {
        mode: {type: String, default: 'fill'},                  // fill,stroke,text
        label: {type: String},                                  // 按钮文本
        width: {type: [String, Number]},                        // 按钮宽度
        icon: {type: String},                                   // 按钮图标
        active: {type: Boolean},                                // 按钮是否高亮
        noPadding: {type: Boolean},                             // 按钮是否无边距
        block: {type: Boolean},                                 // 块级元素
        throttleClick: {type: [Boolean, Number]},               // click节流
        autoLoading: {type: Boolean},                           // 在执行click处理函数时，是否自动变更为加载状态

        ...EditProps,
        ...StyleProps,

        /*native*/
        type: {type: String, default: 'button'},
        nativeProps: {},
    },
    function (props) {

        const {slots} = useSlots()

        /*---------------------------------------state-------------------------------------------*/

        const propsState = useProps(props, {
            width: FormatPropsType.number,
            label: FormatPropsType.promise,
        })

        const {styleComputed} = useStyle({status: DEFAULT_STATUS})
        const {editState, editComputed} = useEdit()

        const buttonGroup = inject(BUTTON_GROUP_PROVIDER, null) as any

        const otherComputed = computed(() => ({
            mode: !!buttonGroup ? buttonGroup.value.mode : props.mode
        }))

        const state = reactive({
            handleClick: null as any,
            handleClickInner: async (e) => {
                if (editComputed.value.editable) {
                    if (props.autoLoading) {
                        editState.loading = true
                        try {

                            if (!!this.$listeners.click) {
                                // @ts-ignore
                                await this.$listeners.click(e)
                            }
                        } catch (e) {
                        } finally {
                            editState.loading = null
                        }
                    } else {
                        emit.click(e)
                    }
                }
            },
        })

        /*---------------------------------------watch-------------------------------------------*/

        watch(
            () => props.throttleClick,
            (val) => {
                if (!val) {
                    return state.handleClick = state.handleClickInner
                }
                if (val === true) {
                    val = 1000
                }
                state.handleClick = PlainUtils.throttle(state.handleClickInner, val, {trailing: false})
            },
            {immediate: true}
        )

        /*---------------------------------------emitter-------------------------------------------*/

        const {emit} = useEvent({
            click: EmitFunc,
            focus: EmitFunc,
        })

        /*---------------------------------------computed-------------------------------------------*/

        const classes = computed(() => ([
            'pl-button',
            'plain-click-node',

            `pl-button-mode-${otherComputed.value.mode}`,
            `pl-button-status-${styleComputed.value.status}`,
            `pl-button-shape-${styleComputed.value.shape}`,
            `pl-button-size-${styleComputed.value.size}`,

            {
                'pl-button-icon': !!props.icon,
                'pl-button-active': !!props.active,
                'pl-button-noPadding': !!props.noPadding,

                'pl-button-loading': !!editComputed.value.loading,
                'pl-button-has-icon': !!props.icon,
                'pl-button-block': !!props.block,
                'pl-button-disabled': !!editComputed.value.disabled,
                'pl-button-icon-only': !!props.icon && !propsState.label,
            },
        ]))

        const styles = computed(() => ({
            width: !!propsState.width ? PlainUtils.suffixPx(propsState.width) : null,
        }))

        return {
            styles,
            classes,
            props,
            editComputed,
            state,
            propsState,
            slots,

        }
    },
    function (refer) {

        const {
            styles,
            classes,
            props,
            editComputed,
            state,
            propsState,
            slots,
        } = refer

        return () => (
            <button
                style={styles.value}
                class={classes.value}
                type={props.type}
                disabled={editComputed.value.disabled}
                readonly={editComputed.value.readonly}

                {...{
                    attrs: props.nativeProps,
                    directives: [{name: 'click-wave', value: 'large'}],
                }}

                onClick={state.handleClick}
            >
                {!!editComputed.value.loading && <pl-loading type="gamma" v-if="isLoading"/>}
                {slots.default(
                    [
                        (!!props.icon && !editComputed.value.loading) ? <pl-icon icon={props.icon}/> : null,
                        propsState.label ? <span>{propsState.label}</span> : null
                    ]
                )}
            </button>
        )
    },
    {
        mixin: {
            directives: {ClickWave},
        }
    }
)