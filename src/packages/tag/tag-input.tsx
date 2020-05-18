import {computed, defineComponent, onBeforeUnmount, reactive} from "@vue/composition-api";
import {EditProps, EmitFunc, StyleProps, useEdit, useListener, useModel, useRef, useStyle} from "@/util/use";
import {$plain} from "@/packages/base";
import {getKey, KEY} from "@/packages/keyboard";

export default defineComponent({
    name: 'pl-tag-input',
    props: {
        ...EditProps,
        ...StyleProps,

        value: {type: Array},                                                           // 数组，双向绑定值
        close: {type: Boolean, default: true},                                          // 是否可删除
        beforeAdd: {type: Function},                                                    // 添加前校验
        beforeRemove: {type: Function},                                                 // 删除前校验
        formatValue: {type: Function},                                                  // 格式化输入值，返回一个值，或者对象
        noInput: {type: Function},                                                      // 是否显示输入框
    },
    setup(props, context) {

        const input = useRef<any>()

        const {emit} = useListener(context, {
            input: EmitFunc,
        })

        const model = useModel(() => props.value, emit.input)

        const state = reactive({
            isEditing: false,
            inputValue: null as string | null,
        })
        const {editComputed} = useEdit(props)
        const styleState = useStyle(props)

        const classes = computed(() => ([
            'pl-tag-input',
            `pl-tag-input-status-${styleState.value.status}`,
            {
                'pl-tag-input-disabled': editComputed.value.disabled,
            },
        ]))


        onBeforeUnmount(() => {
            window.removeEventListener('click', handler.clickWindow, true)
        })

        const handler = {
            clickWindow: (e: MouseEvent) => {
                if (!input.value.input.contains(e.target as Node)) {
                    state.isEditing = false
                    window.removeEventListener('click', handler.clickWindow, true)
                }
            },
            clickEditButton: async () => {
                if (!editComputed.value.editable) {
                    return
                }
                state.isEditing = true
                await $plain.nextTick()
                input.value.methods.focus()

                // 点击其他元素的时候关闭输入状态
                await $plain.utils.delay(0)
                window.addEventListener('click', handler.clickWindow, true)
            },
            inputEnter: async () => {
                if (!editComputed.value.editable) {
                    return
                }

                let inputValue = state.inputValue

                if (inputValue != '0' && !inputValue) {
                    return
                }

                if (!!props.beforeAdd) {
                    await props.beforeAdd(inputValue)
                }
                if (!!props.formatValue) {
                    inputValue = await props.formatValue(inputValue)
                }

                let value = [...(model.value || [])]
                value.push(inputValue)
                model.value = value
                state.inputValue = null
            },
            tagClose: async (item, index) => {
                if (!editComputed.value.editable) {
                    return
                }
                if (!!props.beforeRemove) {
                    await props.beforeRemove(item, index)
                }

                model.value!.splice(index, 1)
                model.value = [...model.value!]
            },
            input: (val) => {
                state.inputValue = val
            },
            keydown: (e: KeyboardEvent) => {
                if (getKey(e) === KEY.enter) {
                    handler.inputEnter()
                }
            }
        }

        return () => (
            <div class={classes.value}>
                {
                    (model.value || []).map((item, index) => (
                        !!context.slots.default ? context.slots.default({item, index}) : (
                            <pl-tag key={index} label={item} close={editComputed.value.editable && props.close} onClose={() => handler.tagClose(item, index)}/>
                        )
                    ))
                }
                {!props.noInput && (
                    <pl-input value={state.inputValue}
                              onInput={handler.input}
                              refer={input}
                              key={state.isEditing ? 1 : 2}
                              onKeydown={handler.keydown}>
                        {!state.isEditing ? (
                            <div class="pl-tag-input-not-edit"
                                 onClick={handler.clickEditButton}>
                                <pl-icon icon="el-icon-plus"/>
                                <span>添加</span>
                            </div>
                        ) : null}
                    </pl-input>
                )}
            </div>
        )
    },
})