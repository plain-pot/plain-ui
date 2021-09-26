import {designComponent, reactive, useRefList} from "plain-ui-composition"
import {useClasses} from "plain-ui-composition";
import {MessageServiceFormatOption} from "./index";
import {delay} from "plain-utils/utils/delay";

import PlMessage from "./PlMessage";

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
                    {state.options.map((option, index) =>
                        <div class="pl-item" key={option.id}>
                            <PlMessage
                                option={option}
                                ref={onRefList(index) as any}
                                onClose={() => utils.closeMessage(index)}
                            />
                        </div>
                    )}
                </div>
            )
        }
    },
})
