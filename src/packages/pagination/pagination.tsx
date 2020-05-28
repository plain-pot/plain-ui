import {defineComponent} from "@vue/composition-api";
import {StyleProps} from "@/use/useStyle";
import {EditProps} from "@/use/useEdit";

export default defineComponent({
    name: 'pl-pagination',
    props: {
        ...StyleProps,
        ...EditProps,
    },
    setup(props) {
        return () => (
            <div>

            </div>
        )
    },
})