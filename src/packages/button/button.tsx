import {getCurrentInstance, ref} from "vue";
import {designComponent} from "@/use/designComponent";

export const Button = designComponent({
    name: 'pl-button',
    props: {
        name: {type: String},
        age: {type: Number, default: 10},
    },
    setup({props, event}) {

        const ctx = getCurrentInstance()!
        const text = ref('hello world')
        const showFlag = ref(true)

        return {
            refer: {},
            render: () => {
                return (
                    <div>
                        <button>
                            BUTTON:{text.value}
                        </button>
                        <div>
                            <input id="checkbox" type="checkbox" v-model={showFlag.value}/>
                            <label for="checkbox">showFlag:{JSON.stringify(showFlag.value)}</label>
                        </div>
                        {showFlag.value && <input ref="input" type="text" v-model={text.value}/>}
                        <hr/>
                        <div>
                            <div>hasInput:{JSON.stringify(!!((ctx as any).ctx.$refs.input))}</div>
                            <div>hasInput:{JSON.stringify(!!(ctx.refs.input))}</div>
                        </div>
                    </div>
                )
            }
        }
    },
})