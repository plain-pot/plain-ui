import {defineComponent, reactive} from "vue";

export default defineComponent(() => {

    const state = reactive({
        count: 0
    })

    return () => <>
        <div>
            <button onClick={() => state.count++}>add</button>
            {state.count}
            <button onClick={() => state.count--}>sub</button>
        </div>
    </>
})