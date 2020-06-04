import {computed, defineComponent, onMounted, Ref, watch} from "@vue/composition-api";
import {EditProps, useEdit} from "@/use/useEdit";
import {CompRef, useRefs} from "@/use/useRefs";
import {EmitFunc, useEvent} from "@/use/useEvent";
import {useModel} from "@/use/useModel";
import {$plain} from "@/packages/base";

export default defineComponent({
    name: 'pl-time-base-column',
    props: {
        ...EditProps,

        layout: {type: String, default: 'h'},   // 模式，h：时，m：分，s：秒
        value: {type: Number},                  // 当前值
        max: {type: Number},                    // 最大值
        min: {type: Number},                    // 最小值
        custom: {type: Function},               // 自定义选项函数
        checkDisabled: {type: Function},        // 用来判断选项是否禁用的函数
    },
    setup(props) {

        const {editComputed} = useEdit()

        const refs = useRefs({
            scroll: CompRef,
        })

        const {emit} = useEvent({
            input: EmitFunc,
            clickItem: EmitFunc,
        })

        const model = useModel(() => props.value, emit.input)

        const options: Ref<readonly string[]> = computed(() => {
            if (!!props.custom) {
                return props.custom(props.layout).map(item => $plain.utils.zeroize(item, 2)) as string[]
            }
            let count = props.layout === 'h' ? 24 : 60
            let options: string[] = []
            for (let i = 0; i < count; i++) {
                options.push($plain.utils.zeroize(i, 2))
            }
            return options
        })

        const methods = {
            resetPosition: () => {
                let value = model.value || 0
                let start = 0
                let find = $plain.utils.findOne(options.value, item => item == value, true)
                if (!!find) {
                    start = find.index
                }
                let scrollTop = start * 24
                refs.scroll.methods.scroll({y: scrollTop}, 150)
            },
        }

        const utils = {
            checkDisabled: (item: string | number) => {
                item = Number(item)
                if (editComputed.value.disabled) return true
                if (!!props.checkDisabled && props.checkDisabled(item, props.layout)) return true

                if (props.max != null && props.max < item) return true
                if (props.min != null && props.min > item) return true
                return false
            }
        }

        const handler = {
            clickItem: (item: string | number) => {
                item = Number(item)
                if (utils.checkDisabled(item)) {
                    return
                }
                model.value = item
                emit.clickItem(item)
            }
        }

        watch(() => props.value, methods.resetPosition, {lazy: true})

        onMounted(methods.resetPosition)

        return () => (
            <div class="pl-time-base-column">
                <pl-scroll ref="scroll">
                    <ul class="pl-time-base-column-list">
                        {[1, 2, 3].map(item => (<li class="pl-time-base-column-item" key={-item}/>))}

                        {
                            options.value.map(item => (
                                <li class={[
                                    'pl-time-base-column-item',
                                    'pl-time-base-column-option-item',
                                    {
                                        'pl-time-base-column-item-current': model.value != null && model.value == Number(item),
                                        'pl-time-base-column-item-disabled': utils.checkDisabled(item),
                                    }
                                ]}
                                    key={item}
                                    onClick={() => handler.clickItem(item)}>
                                    {item}
                                </li>
                            ))
                        }

                        {[1, 2, 3].map(item => (<li class="pl-time-base-column-item" key={-item - 3}/>))}
                    </ul>
                </pl-scroll>
            </div>
        )
    }
})