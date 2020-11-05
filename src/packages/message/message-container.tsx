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

        const utils = {
            closeMessage: (i: number) => {
                state.options.splice(i, 1)
            }
        }

        return {
            refer: {
                props,
                getMessage: async (option: MessageServiceOption) => {
                    state.options.push(option)
                    await nextTick()
                    const messages = refs.filter(Boolean)
                    for (let i = 0; i < messages.length; i++) {
                        const message = messages[i];
                        if (message.option === option) {
                            return message
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
                        name: `pl-message-list`
                    }}>
                        {state.options.map((option, index) =>
                            <Message option={option}
                                     key={option.id}
                                     ref={(proxy: any) => refs[index] = proxy}
                                     {...{onClose: () => utils.closeMessage(index)}}
                            />)}
                    </TransitionGroup>
                </div>
            )
        }
    },
})