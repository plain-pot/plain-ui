import {designComponent} from "../../use/designComponent";
import {useClass} from "../../use/useClasses";
import {MessageServiceFormatOption} from "./index";
import {useRefList} from "../../use/useRefList";
import {nextTick, reactive} from 'vue';
import Message from "./message";
import List from '../list'
import Item from '../item'

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
            options: [] as MessageServiceFormatOption[]
        })
        const refs = useRefList<{ option: MessageServiceFormatOption }>()
        const styles = {padding: props.duration}

        const utils = {
            closeMessage: (i: number) => {
                state.options.splice(i, 1)
            }
        }

        return {
            refer: {
                props,
                getMessage: async (option: MessageServiceFormatOption) => {
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
                <List direction="top" class={classes.value} style={styles}>
                    {state.options.map((option, index) =>
                        <Item key={option.id}>
                            <Message option={option}
                                     ref={(proxy: any) => refs[index] = proxy}
                                     {...{onClose: () => utils.closeMessage(index)}}
                            />
                        </Item>
                    )}
                </List>
            )
        }
    },
})