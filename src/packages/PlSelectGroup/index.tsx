import {computed, designComponent} from "plain-design-composition";
import {PlSelectOption, SelectOption} from "../PlSelectOption";
import {PlSelectPanel} from "../PlSelect/PlSelectPanel";
import {useCollect} from "../../use/useCollect";

export const PlSelectGroup = designComponent({
    name: 'pl-select-group',
    props: {
        label: {type: String},
    },
    slots: ['title', 'default'],
    setup({props, slots}) {

        const options = (SelectGroupCollector as any).parent() as SelectOption[]
        const panel = PlSelectPanel.use.inject(null)
        const isShow = computed(() => !panel || options.filter((option) => !option.props.group).filter(o => panel.utils.isShow(o.props)).length > 0)

        return {
            render: () => {
                return (
                    <>
                        {isShow.value && (props.label || slots.title.isExist()) && (
                            <PlSelectOption class="pl-select-group" group label="" val="">
                                {slots.title(props.label)}
                            </PlSelectOption>
                        )}
                        {slots.default()}
                    </>
                )
            }
        }
    },
})

export const SelectGroupCollector = useCollect(() => ({
    parent: PlSelectGroup,
    child: PlSelectOption,
}))

export default PlSelectGroup
