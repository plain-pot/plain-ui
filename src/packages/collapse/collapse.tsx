import {designComponent} from "../../use/designComponent";
import {useSlots} from "../../use/useSlots";
import {useModel} from "../../use/useModel";
import {useClass} from "../../use/useClasses";
import './collapse.scss'

export default designComponent({
    name: 'pl-collapse',
    props: {
        modelValue: {type: Boolean, default: true},
        title: {type: String},
        detail: {type: String},
        noArrow: {type: Boolean},
        disabled: {type: Boolean},
    },
    emits: {
        updateModelValue: (val: boolean) => true
    },
    setup({props, event: {emit}}) {

        const model = useModel(() => props.modelValue, emit.updateModelValue)

        const {slots} = useSlots([
            'title',
        ], true)

        const classes = useClass(() => [
            'pl-collapse',
            {
                'pl-collapse-has-arrow': !props.noArrow,
                'pl-collapse-is-open': model.value,
            }
        ])

        const handler = {
            onClickTitle: () => {
                if (props.disabled) {
                    return
                }
                model.value = !model.value
            }
        }

        return {
            render: () => (
                <div class={classes.value}>
                    {(!!props.title || slots.title.isExist()) && <div class="pl-collapse-title" onClick={handler.onClickTitle}>
                        {slots.title(props.title)}

                        {!props.noArrow && <div class="pl-collapse-arrow">
                            <pl-icon icon="el-icon-arrow-right"/>
                        </div>}
                    </div>}
                    <pl-collapse-transition>
                        {model.value && (!!props.detail || slots.default.isExist()) && <div class="pl-collapse-detail">
                            {slots.default(props.detail)}
                        </div>}
                    </pl-collapse-transition>
                </div>
            )
        }
    },
})