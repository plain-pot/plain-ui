import {defineComponent} from "@vue/composition-api";

export default defineComponent({
    name: 'pl-table',
    props: {},
    setup(props) {
        return () => (
            <div>
                plain table
            </div>
        )
    },
})