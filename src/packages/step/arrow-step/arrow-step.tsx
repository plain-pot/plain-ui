import {defineComponent} from "@vue/composition-api";

export default defineComponent({
    name: 'pl-arrow-step',
    props: {},
    setup: (props) => {
        return () => (
            <div>
                arrow-step
            </div>
        )
    },
})