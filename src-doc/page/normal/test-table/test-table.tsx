import {computed, defineComponent, reactive} from "@vue/composition-api";
import {TestMark} from "./TestMark";

export default defineComponent({
    name: 'test-table',
    props: {
        data: {type: Array},
    },
    setup(props) {

        const mark = new TestMark()
        const formatData = computed(() => mark.node.getList(props.data))

        return () => {
            return (
                <div class="test-table">
                    {JSON.stringify(mark.check.state.map)}
                    <ul>
                        {formatData.value.map(item => (
                            <li>
                                <pl-checkbox value={item.isChecked()} readonly onClick={() => item.check(!item.isChecked())}/>
                                <span>{item.key}-{item.data.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )
        }
    },
})