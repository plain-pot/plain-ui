import {designComponent} from "../../use/designComponent";
import {useSlots} from "../../use/useSlots";
import Option from './select-option'
import {useCollect} from "../../use/useCollect";
import {computed} from 'vue';

const Panel = designComponent({
    name: 'pl-select-panel',
    setup() {

        const {slots} = useSlots()

        const items = SelectCollector.parent()
        const options = computed(() => items.filter(i => !i.props.group).map(({props: {label, val, disabled}}) => ({label, val, disabled})))

        return {
            render: () => {
                return (
                    <div class="pl-select-panel">
                        {slots.default()}

                        <div class="pl-select-panel-debug">
                            {options.value.map(option => <div>{option.label}__{option.val}__{option.disabled}</div>)}
                        </div>

                    </div>
                )
            }
        }
    },
})

export default Panel

export const SelectCollector = useCollect(() => ({
    parent: Panel,
    child: Option,
}))