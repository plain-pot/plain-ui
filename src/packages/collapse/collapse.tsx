import {designComponent} from "../../use/designComponent";
import {useSlots} from "../../use/useSlots";
import {useModel} from "../../use/useModel";
import {useClass} from "../../use/useClasses";
import {computed} from 'vue';
import {createCounter} from "../../utils/createCounter";
import './collapse.scss'
import {PlCollapseGroup} from "./collapse-group";

const valCounter = createCounter('collapse')

export const PlCollapse = designComponent({
    name: 'pl-collapse',
    props: {
        modelValue: {type: Boolean, default: true},
        title: {type: String},
        detail: {type: String},
        noArrow: {type: Boolean},
        disabled: {type: Boolean, default: null},
        val: {type: String},
    },
    emits: {
        onUpdateModelValue: (val: boolean) => true
    },
    setup({props, event: {emit}}) {

        const model = useModel(() => props.modelValue, emit.onUpdateModelValue)
        const group = PlCollapseGroup.use.inject(null)

        const selfVal = computed(() => props.val || valCounter())

        const isOpen = computed(() => {
            if (!!group) {
                return group.utils.isOpen(selfVal.value)
            } else {
                return model.value
            }
        })

        const {slots} = useSlots([
            'title',
        ], true)

        const classes = useClass(() => [
            'pl-collapse',
            {
                'pl-collapse-has-arrow': !props.noArrow,
                'pl-collapse-is-open': isOpen.value,
            }
        ])

        const isDisabled = computed(() => {
            if (props.disabled != null) {
                return props.disabled
            }
            if (!!group) {
                return group.props.disabled
            }
            return false
        })

        const handler = {
            onClickTitle: () => {
                if (isDisabled.value) {
                    return
                }
                if (!!group) {
                    group.handler.clickCollapseTitle(selfVal.value)
                } else {
                    model.value = !model.value
                }
            }
        }

        return {
            render: () => (
                <div class={classes.value}>
                    {(!!props.title || slots.title.isExist()) && <div class="pl-collapse-title" onClick={handler.onClickTitle}>
                        {slots.title(props.title)}

                        {!props.noArrow && !isDisabled.value && <div class="pl-collapse-arrow">
                            <pl-icon icon="el-icon-arrow-right"/>
                        </div>}
                    </div>}
                    <pl-collapse-transition>
                        {isOpen.value && (!!props.detail || slots.default.isExist()) && <div class="pl-collapse-detail">
                            {slots.default(props.detail)}
                        </div>}
                    </pl-collapse-transition>
                </div>
            )
        }
    },
})