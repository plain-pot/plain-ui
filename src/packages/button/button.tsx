import {defineComponent} from "@vue/composition-api";

export default defineComponent({
    name: 'pl-button',
    setup() {
        return () => (
            <button class={'pl-button'}>
                111
            </button>
        )
    },
})