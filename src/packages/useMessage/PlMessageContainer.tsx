import {useClasses, designComponent, reactive, useRefList} from "plain-design-composition"
import {MessageServiceFormatOption} from "./index";
import {delay} from "plain-utils/utils/delay";
import PlMessage from "./PlMessage";
import PlList from "../PlList";
import PlItem from "../PlItem";

export default designComponent({
    name: 'pl-message-container',
    props: {
        horizontal: {type: String, required: true},
        vertical: {type: String, required: true},
        duration: {type: String, default: "30px"},
    },
    setup({props}) {
        const classes = useClasses(() => [
            'pl-message-container',
            `pl-message-container-${props.horizontal}-${props.vertical}`
        ])
        const state = reactive({
            options: [] as MessageServiceFormatOption[]
        })
        const {refList, onRefList} = useRefList<{ props: { option: MessageServiceFormatOption } }>()
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
                    await delay(0)
                    const messages = refList.filter(Boolean)
                    for (let i = 0; i < messages.length; i++) {
                        const message = messages[i];
                        if (message.props.option === option) {
                            return message
                        }
                    }
                    return null
                },
            },
            render: () => (
                <div class={classes.value} style={styles}>
                    <PlList direction="top">
                        {state.options.map((option, index) =>
                            <PlItem key={option.id}>
                                <PlMessage
                                    option={option}
                                    ref={onRefList(index)}
                                    onClose={() => utils.closeMessage(index)}
                                />
                            </PlItem>
                        )}
                    </PlList>
                </div>
            )
        }
    },
})
