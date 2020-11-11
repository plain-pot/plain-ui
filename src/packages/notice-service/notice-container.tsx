import {designComponent} from "../../use/designComponent";
import {useClass} from "../../use/useClasses";
import {NoticeServiceDirection, NoticeServiceFormatOption} from "./index";
import {useRefList} from "../../use/useRefList";
import {nextTick, reactive} from 'vue';
import Nontice from "./notice";

export default designComponent({
    name: 'pl-notice-container',
    props: {
        horizontal: {type: String, required: true},
        vertical: {type: String, required: true},
        duration: {type: String, default: "30px"},
    },
    setup({props}) {
        const classes = useClass(() => [
            'pl-notice-container',
            `pl-notice-container-${props.horizontal}-${props.vertical}`
        ])
        const state = reactive({
            options: [] as NoticeServiceFormatOption[]
        })
        const refs = useRefList<{ option: NoticeServiceFormatOption }>()
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
                <pl-list direction={props.horizontal === NoticeServiceDirection.start ? 'left' : 'right'}
                         class={classes.value}
                         style={styles}>
                    {state.options.map((option, index) =>
                        <pl-item key={option.id}>
                            <Nontice option={option}
                                     ref={(proxy: any) => refs[index] = proxy}
                                     {...{onClose: () => utils.close(index)}}
                            />
                        </pl-item>
                    )}
                </pl-list>
            )
        }
    },
})