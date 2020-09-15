import {computed, defineComponent, reactive} from "@vue/composition-api";
import {TestMark} from "./TestMark";

export default defineComponent({
    name: 'test-table',
    props: {
        data: {type: Array},
    },
    setup(props) {

        const mark = new TestMark()

        const formatData = computed(() => mark.formatList(props.data))

        const parent: any = {
            name: 'i am parent',
            children: [
                {name: 'child 1'},
                {name: 'child 2'},
                {name: 'child 3'},
            ]
        }

        parent.children.forEach(child => child.parent = parent)

        const state = reactive({
            parent,
        })

        console.log(state.parent)

        return () => {
            return (
                <div class="test-table">
                    <ul>
                        {formatData.value.map(item => (
                            <li>
                                {item.key}-{item.data.name}
                            </li>
                        ))}
                    </ul>
                </div>
            )
        }
    },
})