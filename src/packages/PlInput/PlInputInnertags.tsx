import {designComponent, useRefs} from "plain-ui-composition";


export const PlInputInnerTags = designComponent({
    name: 'pl-input-inner-tags',
    props: {
        data: {type: Array},
        maxTags: {type: Number, default: 3},
        collapseTags: {type: Boolean, default: true},
        placeholder: {type: [String, Number]}
    },
    scopeSlots: {
        default: (scope: { item: any, index: number }) => {},
    },
    inheritPropsType: HTMLDivElement,
    setup({props, scopeSlots}) {
        const {refs, onRef} = useRefs({el: HTMLDivElement})
        return {
            refer: {
                refs,
            },
            render: () => (
                <div class="pl-input-inner-tags" ref={onRef.el}>
                    {(!props.data || props.data.length === 0) && (
                        <span class="pl-input-custom-placeholder">{props.placeholder}</span>
                    )}
                    {
                        (props.collapseTags ? props.data!.slice(0, props.maxTags) : props.data!).map((item: any, index) => (
                            <span key={index} class="pl-input-inner-tag-item">
                            {scopeSlots.default({item, index}, null)}
                        </span>
                        ))
                    }
                    {props.collapseTags && props.data!.length > props.maxTags && <span class="pl-input-inner-tag-item">+{props.data!.length - props.maxTags}</span>}
                    <span class="pl-input-inner-tag-item pl-input-inner-tag-item-takeover">&nbsp;</span>
                </div>
            )
        }
    },
})
