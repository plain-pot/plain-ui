import {defineComponent} from 'vue';

export const DemoParent = defineComponent({
    emits: {
        init: () => true,
        destroy: () => true,
        open: () => true,
        close: () => true,
        show: () => true,
        hide: () => true,

        'update:modelValue': (val: boolean) => true,
        'update:open': (val: boolean) => true,

        'click-reference': (e: MouseEvent) => true,
        'click-popper': (e: MouseEvent) => true,
        'click-body': (e: MouseEvent) => true,
        'mousedown-popper': (e: MouseEvent) => true,

        'enter-reference': (e: MouseEvent) => true,
        'leave-reference': (e: MouseEvent) => true,
        'enter-popper': (e: MouseEvent) => true,
        'leave-popper': (e: MouseEvent) => true,
        'reference-focus': (e: FocusEvent) => true,
        'reference-blur': (e: Event) => true,
    },
    setup(props, setupContext) {
        return () => (
            <>
                <span>SPAN</span>
                <button onClick={(e) => {
                    setupContext.emit('click-reference', e)
                    setupContext.emit('click-body', e)
                }}>PARENT BUTTON
                </button>
            </>
        )
    },
})