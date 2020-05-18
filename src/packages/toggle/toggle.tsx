import {computed, defineComponent, reactive} from "@vue/composition-api";
import {StyleProps, useStyle} from "@/use/useStyle";
import {EditProps, useEdit} from "@/use/useEdit";
import {EmitFunc, useListener} from "@/use/useEvent";
import {useModel} from "@/use/useModel";

import {getKey, KEY} from "@/packages/keyboard";
import ClickWave from "@/directives/click-wave";

export default defineComponent({
    name: 'pl-toggle',
    directives: {ClickWave},
    props: {
        ...EditProps,
        ...StyleProps,

        value: {},                                                              // 双向绑定值
        trueValue: {default: true},                                             // 选中时绑定的值
        falseValue: {default: false},                                           // 未选中时绑定的值
    },
    setup(props, context) {

        const {emit} = useListener(context, {
            input: EmitFunc,
            mouseup: EmitFunc,
            mousedown: EmitFunc,
            click: EmitFunc,
            focus: EmitFunc,
            blur: EmitFunc,
        })

        /*---------------------------------------state-------------------------------------------*/

        const {editComputed} = useEdit()
        const styleState = useStyle()

        const model = useModel(() => props.value, emit.input)

        const state = reactive({
            isActive: false,
        })

        /*---------------------------------------computer-------------------------------------------*/

        const isChecked = computed(() => model.value === props.trueValue)

        const classes = computed(() => ([
            `pl-toggle`,
            `plain-click-node`,
            `pl-toggle-status-${styleState.value.status}`,
            `pl-toggle-size-${styleState.value.size}`,
            {
                'pl-toggle-on': !!isChecked.value,
                'pl-toggle-active': !!state.isActive,
                'pl-toggle-disabled': editComputed.value.disabled,
            },
        ]))

        /*---------------------------------------handler-------------------------------------------*/

        const handler = {
            mousedown: (e: MouseEvent) => {
                state.isActive = true
                window.addEventListener('mouseup', handler.mouseup)
                emit.mousedown(e)
            },
            mouseup: (e: MouseEvent) => {
                state.isActive = false
                window.removeEventListener('mouseup', handler.mouseup)
                emit.mouseup(e)
            },
            click: (e: MouseEvent) => {
                if (!editComputed.value.editable) {
                    return
                }
                model.value = isChecked.value ? props.falseValue : props.trueValue
                emit.click(e)
            },
            keydown: (e: KeyboardEvent) => {
                const key = getKey(e)
                if (key === KEY.space || key === KEY.enter) {
                    e.preventDefault()
                    e.stopPropagation()
                    handler.click(e as any)
                }
            },
            focus: emit.focus,
            blur: emit.blur,
        }

        return () => (
            <div class={classes.value}
                 tabindex={0}
                 onMousedown={handler.mousedown}
                 onClick={handler.click}
                 onkeydown={handler.keydown}
                 onFocus={handler.focus}
                 onBlur={handler.blur}
                 {...{directives: [{name: 'click-wave', value: 'large'}]}}
            >
                <div class="pl-toggle-inner"/>
            </div>
        )
    },
})