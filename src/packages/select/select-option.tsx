import {designComponent} from "../../use/designComponent";
import {useSlots} from "../../use/useSlots";
import {useClass} from "../../use/useClasses";
import {SelectCollector} from "./select-panel";
import {useRefs} from "../../use/useRefs";

export default designComponent({
    name: 'pl-select-option',
    props: {
        label: {type: String},
        val: {type: String},
        icon: {type: String},
        disabled: {type: Boolean},

        group: {type: Boolean},
    },
    setup({props}) {

        const {slots} = useSlots()
        const {refs} = useRefs({
            el: HTMLDivElement,
        })

        const panel = SelectCollector.child({injectDefaultValue: null, sort: () => refs.el})

        const classes = useClass(() => [
            'pl-select-option',
            {
                ['pl-select-option-disabled']: props.disabled
            }
        ])

        return {
            refer: {
                props,
            },
            render: () => {
                return (
                    <div class={classes.value} ref="el">
                        {slots.default(<>
                            {!!props.icon && <pl-icon icon={props.icon} class="pl-select-option-icon"/>}
                            {props.label}
                        </>)}
                    </div>
                )
            }
        }
    },
})