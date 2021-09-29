import {computed, designComponent, InheritHtmlElement, reactive, useNumber, useRefs, useStyles, watch} from 'plain-ui-composition'
import './button.scss'
import {PropType} from "plain-ui-composition";
import {DEFAULT_STATUS, StyleProps, useStyle} from "../../use/useStyle";
import {throttle} from 'plain-utils/utils/throttle'
import {unit} from 'plain-utils/string/unit'

import {useClasses} from "plain-ui-composition";
import {PlLoading} from "../PlLoading";
import {PlIcon} from "../PlIcon";
import {EditProps, useEdit} from "../../use/useEdit";
import {ButtonModeProvider} from "../PlButtonGroup";
import {useClickWave} from "../../directives/ClickWave";
import {HtmlHTMLAttributes} from "vue";

console.log('load button component')

export const PlButton = designComponent({
    name: 'pl-button',
    props: {
        mode: {type: String},                                   // fill,stroke,text
        label: {type: String},                                  // 按钮文本
        width: {type: [String, Number]},                        // 按钮宽度
        icon: {type: String},                                   // 按钮图标
        active: {type: Boolean},                                // 按钮是否高亮
        noPadding: {type: Boolean},                             // 按钮是否无边距
        block: {type: Boolean},                                 // 块级元素
        throttleClick: {type: [Boolean, Number]},               // click节流
        asyncHandler: {type: Function as PropType<(e: MouseEvent) => void>},    // 异步处理函数，会自动开启关闭loading状态

        ...EditProps,
        ...StyleProps,

        /*native*/
        type: {type: String, default: 'button'},
        nativeAttrs: {type: Object},
    },
    inheritPropsType: InheritHtmlElement,
    emits: {
        onClick: (e: MouseEvent) => true,
    },
    slots: ['default'],
    setup({props, event: {emit}, slots}) {

        const {refs, onRef} = useRefs({
            el: HTMLButtonElement,
        })
        const {numberState} = useNumber(props, ['width'])

        const {styleComputed} = useStyle({status: DEFAULT_STATUS})
        const {editState, editComputed} = useEdit()
        const buttonGroup = ButtonModeProvider.inject()
        const otherComputed = computed(() => ({
            mode: props.mode || (!!buttonGroup ? buttonGroup.value.mode : 'fill')
            // mode: 'fill',
        }))
        const state = reactive({
            handleClick: null as ((e: MouseEvent) => void) | null,
            handleClickInner: async (e: MouseEvent) => {
                e.stopPropagation()
                if (!editComputed.value.editable) {
                    return
                }
                if (!props.asyncHandler) {
                    return emit.onClick(e)
                }
                editState.loading = true
                try {
                    await props.asyncHandler(e)
                } catch (e) {
                    console.error(e)
                } finally {
                    editState.loading = null
                }
            },
        })

        watch(
            () => props.throttleClick,
            (val) => {
                if (!val) {
                    return state.handleClick = state.handleClickInner
                }
                if (val === true) {
                    val = 1000
                }
                state.handleClick = throttle(state.handleClickInner, val, {trailing: false})
            },
            {immediate: true}
        )

        const classes = useClasses(() => ([
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
                'pl-button-icon-only': !!props.icon && !props.label,
            },
        ]))

        const styles = useStyles(style => {
            style.width = unit(numberState.width)
        })

        useClickWave({elGetter: () => refs.el, optionsGetter: () => ({size: 'large', disabled: !editComputed.value.editable}),})

        return {
            refer: {
                refs,
            },
            render: () => {
                return (
                    <button
                        ref={onRef.el}
                        style={styles.value}
                        class={classes.value}
                        type={props.type as any}
                        disabled={editComputed.value.disabled!}
                        {...{
                            ...(props.nativeAttrs || {}),
                            onClick: state.handleClick!,
                        }}
                    >
                        {!!editComputed.value.loading && <PlLoading type="gamma"/>}
                        {
                            slots.default(<>
                                {(!!props.icon && !editComputed.value.loading) ? <PlIcon icon={props.icon}/> : null}
                                {props.label ? <span>{props.label}</span> : null}
                            </>)
                        }
                    </button>
                )
            }
        }
    },
})

export default PlButton
