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

        const map = reactive({})

        return () => {
            console.log('render')
            return (
                <div class="test-table">
                    {JSON.stringify(map)}
                    <ul>
                        {formatData.value.map(item => (
                            <li>
                                <pl-checkbox v-model={map[item.key]}/>
                                <span>{item.key}-{item.data.name}</span>
                            </li>
                        ))}
                    </ul>
                    <button onClick={() => console.log(map)}>LOG</button>
                </div>
            )
        }
    },
})