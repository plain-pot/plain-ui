import {ModelType} from "@/use/useModel";
import {PopperAgentStateType} from "@/packages/popper/service/PopperAgent";
import {CompRef, useRefs} from "@/use/useRefs";
import {computed} from "@vue/composition-api";
import {$plain} from "@/packages/base";
import {handleKeyboard} from "@/packages/keyboard";
import {useEdit} from "@/use/useEdit";

export function useDateTime(
    {
        value,
        start,
        end,
        props,
        agentState,
        emit,
    }: {
        value: ModelType,
        start: ModelType,
        end: ModelType,
        props: {
            range?: boolean,
        },
        agentState: PopperAgentStateType,
        emit: {
            blur: Function
        },
    }) {

    const {editComputed, editState} = useEdit()

    const refs = useRefs({
        valueInput: CompRef,
        startInput: CompRef,
        endInput: CompRef,
        plInput: CompRef,
    })

    const inputValue = computed(() => {
        return !props.range ? value.value : ((start.value || '') + (end.value || ''))
    })

    const handler = {
        clearHandler: () => {
            if (!props.range) {
                value.value = null
            } else {
                start.value = null
                end.value = null
            }
        },
        clickInput() {
            if (!props.range) {
                agentState.methods.toggle()
            } else {
                agentState.methods.show()
            }
        },
        customInputFocus() {
            agentState.handler.focus()
        },
        async customInputBlur() {
            if (!props.range) {
                agentState.handler.blur()
            } else {
                await $plain.utils.delay(0)
                if ([
                    refs.startInput.refs.$el,
                    refs.endInput.refs.$el,
                ].indexOf(document.activeElement) === -1) {
                    agentState.state.focusCounter--
                    if (agentState.state.focusCounter === 0) {
                        emit.blur()
                        agentState.methods.hide()
                    }
                }
            }
        },
        keydown: handleKeyboard({
            enter: agentState.handler.enter,
            esc: agentState.handler.esc,
        })
    }

    return {
        refs,
        inputValue,
        handler,
        editComputed,
        editState,
    }
}