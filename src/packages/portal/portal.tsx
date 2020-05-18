import {computed, defineComponent, onBeforeUnmount, reactive, watch} from "@vue/composition-api";
import {EmitFunc, useListener} from "@/use/useEvent";
import {useRefs} from "@/use/useRefs";

import {$plain} from "@/packages/base";

export default defineComponent({
    name: 'pl-portal',
    props: {
        value: {type: Boolean, default: true},                          // 是否将组件移动到body下
        container: {},                                                  // 移动所在的父节点
        autoCreateContainer: {type: Boolean},                           // 通过 querySelector 查询 container 不存在时。是否自动 创建 container
        contentClass: {},                                               // content节点的class
        contentStyle: {},                                               // content节点的style
    },
    setup(props, context) {

        const content = useRefs('content', context)
        const el = useRefs('el', context)

        const {emit} = useListener(context, {
            clickContent: EmitFunc,
        })

        const state = reactive({
            contentEl: null as null | HTMLElement,                      // content节点
            parentNode: null as null | HTMLElement,                     // pl-portal 在 mounted 的时候的父节点
            containerNode: null as null | HTMLElement,                  // 移动内容所挂载的父节点
            commentNode: document.createComment('pl-portal'),     // 注释节点，用来在 parentNode 中替代 childNode
            isMoved: false,                                             // 标志位，判断当前是否已经移动到containerNode下
        })

        const targetContainer = computed(() => {
            if (!props.container || props.container === 'document.body' || props.container === 'body') return document.body
            if (props.container instanceof window.Node) return props.container
            if (typeof props.container === "string") {
                const node = document.querySelector(props.container)
                if (!node) {
                    if (!!props.autoCreateContainer) {
                        const container = document.createElement('div')
                        $plain.utils.addClass(container, props.container.replace('.', ''))
                        document.body.appendChild(container)
                        return container
                    } else {
                        console.error(`can'y find node:${props.container}`)
                        return document.body
                    }
                } else {
                    return node
                }
            }
        })

        /*---------------------------------------methods-------------------------------------------*/

        const methods = {
            update: (val) => {
                if (val) {
                    if (!state.isMoved) {
                        // 当前没有移动
                        state.contentEl = content.value
                        state.containerNode = targetContainer.value as HTMLElement

                        // @ts-ignore
                        el.value.replaceChild(state.commentNode, state.contentEl)
                        state.containerNode.appendChild(state.contentEl)

                        state.isMoved = true
                    } else {
                        // 当前已经移动过 do nothing
                    }
                } else {
                    if (!!state.isMoved) {
                        state.containerNode!.removeChild(state.contentEl!)
                        // @ts-ignore
                        el.value.replaceChild(state.contentEl, state.commentNode)

                        state.contentEl = null
                        state.containerNode = null

                        state.isMoved = false
                    }
                }
            }
        }

        watch(() => props.value, (val) => {
            $plain.nextTick(() => methods.update(val))
        })

        watch(() => props.container, () => {
            methods.update(false)
            methods.update(true)
        }, {
            lazy: true,
        })

        onBeforeUnmount(() => {
            methods.update(false)
        })

        return () => (
            <span class="pl-portal" ref="el">
                <span ref="content" class={['pl-portal-content', props.contentClass]} style={props.contentStyle} onClick={emit.clickContent}>
                    {!!context.slots.default && context.slots.default()}
                </span>
            </span>
        )
    },
})