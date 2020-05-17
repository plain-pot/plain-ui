import {defineComponent} from "@vue/composition-api";

export const PLAIN_POPPER_PROVIDER = '@@PLAIN_POPPER_PROVIDER'

export default defineComponent({
    name: 'pl-popper',
    props: {},
    setup(props, context) {
        return () => (
            <div>

            </div>
        )
    },
})