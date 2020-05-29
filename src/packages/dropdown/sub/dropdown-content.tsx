import {computed, defineComponent, getCurrentInstance, provide} from "@vue/composition-api";
import {$plain} from "@/packages/base";
import {EmitFunc, useEvent} from "@/use/useEvent";

export const DROPDOWN_CONTENT_PROVIDER = '@@DROPDOWN_CONTENT_PROVIDER'

export default defineComponent({
    name: 'pl-dropdown-content',
    props: {
        width: {type: [String, Number], default: 120},                                  // popper 宽度
        height: {type: [String, Number]},                                               // popper高度
        content: {type: Function},                                                      // 内容渲染函数
    },
    setup(props) {

        const {emit} = useEvent({
            clickItem: EmitFunc,
            enterPopper: EmitFunc,
            leavePopper: EmitFunc,
        })

        const ctx = getCurrentInstance()!

        const styles = computed(() => {
            return {
                width: $plain.utils.suffixPx(props.width),
                height: $plain.utils.suffixPx(props.height),
            }
        })

        provide(DROPDOWN_CONTENT_PROVIDER, {
            handler: {
                clickItem: (e: MouseEvent, dropdownItem: any) => {
                    const {label, icon, disabled} = dropdownItem
                    emit.clickItem({label, icon, disabled})
                }
            }
        })

        return () => {
            return (
                <div class="pl-dropdown-content" style={styles.value} onMouseenter={emit.enterPopper} onMouseleave={emit.leavePopper}>
                    {props.height == null ? (
                        !!props.content && props.content(ctx.$createElement)
                    ) : (
                        <pl-scroll>
                            {!!props.content && props.content(ctx.$createElement)}
                        </pl-scroll>
                    )}
                </div>
            )
        }
    },
})