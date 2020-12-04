import {designComponent} from "../../use/designComponent";
import {useSlots} from "../../use/useSlots";
import {useCollect} from "../../use/useCollect";
import Option, {SelectOption} from './select-option'
import {computed} from 'vue';
import Panel from './select-panel'

const Group = designComponent({
    name: 'pl-select-group',
    props: {
        label: {type: String},
    },
    setup({props}) {

        const {slots} = useSlots(['label'], true)
        const options = (SelectGroupCollector as any).parent() as SelectOption[]
        const panel = Panel.use.inject()
        const isShow = computed(() => options.filter((option) => !option.props.group).filter(o => panel.utils.isShow(o.props)).length > 0)

        return {
            render: () => {
                return (
                    <>
                        {isShow.value && (slots.label.isExist() || !!props.label && (
                            <pl-select-option class="pl-select-group" group label="" val="">
                                {slots.label(props.label)}
                            </pl-select-option>
                        ))}
                        {slots.default()}
                    </>
                )
            }
        }
    },
})

export default Group

export const SelectGroupCollector = useCollect(() => ({
    parent: Group,
    child: Option,
}))