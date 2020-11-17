import {defineComponent} from 'vue';

export const DemoChild = defineComponent({
    emits: {
        'click': () => true,
    },
    setup(props, setupContext) {
        return () => (
            <button onClick={() => setupContext.emit('click')}>CHILD BUTTON</button>
        )
    },
})