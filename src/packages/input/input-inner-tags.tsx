import {defineComponent} from "@vue/composition-api";
import {useScopedSlots} from "@/use/useScopedSlots";

export default defineComponent({
    name: 'pl-input-inner-tags',
    props: {
        data: {type: Array},
        collapseTags: {type: Boolean, default: true},
    },
    setup(props) {

        const {scopedSlots} = useScopedSlots({
            default: {item: Object, index: Number}
        })

        return () => (
            <div class="pl-input-inner-tags">
                <span class="pl-input-inner-tag-item pl-input-inner-tag-item-takeover">&nbsp;</span>
                {
                    (props.collapseTags ? props.data!.slice(0, 3) : props.data!).map((item, index) => (
                        <span key={index} class="pl-input-inner-tag-item">
                            {scopedSlots.default({
                                param: {item, index},
                                content: null
                            })}
                        </span>
                    ))
                }
                {props.collapseTags && props.data!.length > 3 && <span class="pl-input-inner-tag-item">+{props.data!.length - 3}</span>}
            </div>
        )
    },
})