import {useClasses} from "plain-ui-composition";
import {designComponent, reactive, useRefList} from "plain-ui-composition";
import {NoticeServiceFormatOption} from "./index";
import {delay} from "plain-utils/utils/delay";

import PlNotice from "./PlNotice";

export const PlNoticeContainer = designComponent({
    name: 'pl-notice-container',
    props: {
        horizontal: {type: String, required: true},
        vertical: {type: String, required: true},
        duration: {type: String, default: "30px"},
    },
    setup({props}) {
        const classes = useClasses(() => [
            'pl-notice-container',
            `pl-notice-container-${props.horizontal}-${props.vertical}`
        ])
        const state = reactive({
            options: [] as NoticeServiceFormatOption[]
        })
        const {refList, onRefList} = useRefList<{ props: { option: NoticeServiceFormatOption } }>()
        const styles = {padding: props.duration}
        const utils = {
            close: (i: number) => {
                state.options.splice(i, 1)
            }
        }
        return {
            refer: {
                props,
                getNotice: async (option: NoticeServiceFormatOption) => {
                    state.options.push(option)
                    await delay()
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
                        <div class={"pl-item"} key={option.id}>
                            <PlNotice
                                option={option}
                                ref={onRefList(index) as any}
                                onClose={() => utils.close(index)}
                            />
                        </div>
                    )}
                </div>
            )
        }
    },
})
