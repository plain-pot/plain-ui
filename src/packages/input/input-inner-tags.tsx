import {designComponent} from "../../use/designComponent";
import {useScopedSlots} from "../../use/useScopedSlots";

export const PlInputInnerTags = designComponent({
    name: 'pl-input-inner-tags',
    props: {
        data: {type: Array},
        collapseTags: {type: Boolean, default: true},
        placeholder: {type: String}
    },
    setup({props}) {
        const {scopedSlots} = useScopedSlots({
            default: {item: Object, index: Number},
        })
        return {
            render: () => (
                <div class="pl-input-inner-tags">
                    <span class="pl-input-inner-tag-item pl-input-inner-tag-item-takeover">&nbsp;</span>
                    {(!props.data || props.data.length === 0) && (
                        <span class="pl-input-custom-placeholder">{props.placeholder}</span>
                    )}
                    {
                        (props.collapseTags ? props.data!.slice(0, 3) : props.data!).map((item: any, index) => (
                            <span key={index} class="pl-input-inner-tag-item">
                            {scopedSlots.default({item, index}, null)}
                        </span>
                        ))
                    }
                    {props.collapseTags && props.data!.length > 3 && <span class="pl-input-inner-tag-item">+{props.data!.length - 3}</span>}
                </div>
            )
        }
    },
})