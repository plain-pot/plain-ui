import {defineComponent} from '@vue/composition-api'

export default defineComponent({
    name: 'pl-input',
    props: {},
    setup() {
        return () => (
            <input type="text" class={'pl-input'}/>
        )
    },
})