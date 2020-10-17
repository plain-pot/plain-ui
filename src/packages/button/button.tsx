import {defineComponent, ref} from "vue";

export const Button = defineComponent({
    name: 'pl-button',
    setup() {

        const text = ref('hello world')
        const showFlag = ref(true)

        return () => (
            <div>
                <button>
                    BUTTON:{text.value}
                </button>
                <div>
                    <input id="checkbox" type="checkbox" v-model={showFlag.value}/>
                    <label for="checkbox">showFlag:{JSON.stringify(showFlag.value)}</label>
                </div>
                <input type="text" v-model={text.value} v-show={showFlag.value}/>
            </div>
        )
    },
})