import {designComponent} from "../../use/designComponent";
import {useClass} from "../../use/useClasses";
import {MessageServiceOption} from "./index";
import {useRefList} from "../../use/useRefList";
import {reactive, nextTick, TransitionGroup} from 'vue';
import Message from "./message";

export default designComponent({
    name: 'pl-message-container',
    props: {
        horizontal: {type: String, required: true},
        vertical: {type: String, required: true},
        duration: {type: String, default: "30px"},
    },
    setup({props}) {
        const classes = useClass(() => [
            'pl-message-container',
            `pl-message-container-${props.horizontal}-${props.vertical}`
        ])
        const state = reactive({
            options: [] as MessageServiceOption[]
        })
        const refs = useRefList<{ option: MessageServiceOption }>()
        const styles = {padding: props.duration}

        return {
            refer: {
                props,
                getMessage: async (option: MessageServiceOption) => {
                    state.options.push(option)
                    await nextTick()
                    for (let i = 0; i < refs.length; i++) {
                        const ref = refs[i];
                        if (ref.option === option) {
                            return ref
                        }
                    }
                    return null
                },
            },
            render: () => (
                <div class={classes.value} style={styles}>
                    <TransitionGroup {...{
                        class: "pl-message-list",
                        tag: "div",
                        name: `pl-message-list-transition`
                    }}>
                        {state.options.map((option, index) =>
                            <Message option={option}
                                     key={index}
                                     ref={(proxy: any) => refs[index] = proxy}/>)}
                    </TransitionGroup>
                </div>
            )
        }
    },
})