import {computed, defineComponent} from "@vue/composition-api";
import {PROGRESS_DEFAULT_PROPS} from "@/packages/progress/progress";

export default defineComponent({
    name: 'pl-progress-bar',
    props: {
        width: {type: String, default: '300px'},
        height: {type: String, default: '6px'},
        inlineText: {type: Boolean},

        ...PROGRESS_DEFAULT_PROPS,
    },
    setup(props) {

        const iconColor = computed(() => {
            switch (props.status) {
                case 'success':
                    return props.successColor
                case 'error':
                    return props.errorColor
                default:
                    return null
            }
        })

        const outerStyles = computed(() => ({
            height: !!props.inlineText ? '16px' : props.height,
            width: props.width,
            backgroundColor: props.outerColor,
            borderRadius: props.width,
        }))

        const innerStyles = computed(() => ({
            width: `${props.value}%`,
            backgroundColor: iconColor.value || props.innerColor,
            borderRadius: props.width,
        }))

        return () => (
            <div class="pl-progress-bar">
                <div class="pl-progress-bar-outer" style={outerStyles.value}>
                    <div class="pl-progress-bar-inner" style={innerStyles.value}>
                        {props.inlineText && props.value > 20 && (
                            <div>
                                <div class="pl-progress-bar-content">
                                    {props.status === 'success' && <pl-icon icon="el-icon-check" class="pl-progress-bar-icon-success" style={{color: 'white'}}/>}
                                    {props.status === 'error' && <pl-icon icon="el-icon-close" class="pl-progress-bar-icon-error" style={{color: 'white'}}/>}
                                    {props.status !== 'success' && props.status !== 'error' && <span>{props.value}%</span>}
                                </div>
                            </div>
                        )}
                    </div>
                    {props.inlineText && props.value < 20 && (
                        <div>
                            <div class="pl-progress-bar-content">
                                {props.status === 'success' && <pl-icon icon="el-icon-check" class="pl-progress-bar-icon-success" style={{color: props.successColor}}/>}
                                {props.status === 'error' && <pl-icon icon="el-icon-close" class="pl-progress-bar-icon-error" style={{color: props.errorColor}}/>}
                                {props.status !== 'success' && props.status !== 'error' && <span>{props.value}%</span>}
                            </div>
                        </div>
                    )}
                </div>
                {
                    !props.inlineText && (
                        <div class="pl-progress-bar-content">
                            {props.status === 'success' && <pl-icon icon="el-icon-success" class="pl-progress-bar-icon-success" style={{color: props.successColor}}/>}
                            {props.status === 'error' && <pl-icon icon="el-icon-error" class="pl-progress-bar-icon-error" style={{color: props.errorColor}}/>}
                            {props.status !== 'success' && props.status !== 'error' && <span>{props.value}%</span>}
                        </div>
                    )
                }
            </div>
        )
    },
})