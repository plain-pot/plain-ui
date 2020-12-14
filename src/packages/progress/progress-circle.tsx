import {designComponent} from "../../use/designComponent";
import {PROGRESS_DEFAULT_PROPS} from "./progress.utils";
import {useStyles} from "../../use/useStyles";
import {unit} from 'plain-utils/string/unit';
import {computed, reactive, watch} from 'vue';
import {useSlots} from "../../use/useSlots";
import {useModel} from "../../use/useModel";
import loading from "../loading/loading";
import {createAnimate} from "../../utils/createAnimate";

/*

SVG path 指令

M x,y 在这里x和y是绝对坐标，分别代表水平坐标和垂直坐标
m dx,dy 在这里dx和dy是相对于当前点的距离，分别是向右和向下的距离。
A 绘制圆弧

SVG提供了一个范围广泛stroke 属性

- stroke: 定义一条线，文本或元素轮廓颜色
- stroke-width: 定义了一条线，文本或元素轮廓厚度
- stroke-linecap: 不同类型的开放路径的终结(开头和结尾是方形还是带圆角的)
- stroke-dasharray: 虚线
- stroke-dashoffset: dash模式到路径开始的距离,使用了一个 <百分比> 值， 那么这个值就代表了当前viewport的一个百分比，值可以取为负值

SVG Path标签 A 参数

A rx ry x-axis-rotation large-arc-flag sweep-flag x y

- rx：x轴半径
- ry：y轴半径
- x-axis-rotation：指椭圆的X轴与水平方向顺时针方向夹角，可以想像成一个水平的椭圆绕中心点顺时针旋转的角度（一般都是0，不知道有什么用，如果希望旋转一定的夹角的话，可以用transform rotate实现）
- large-arc-flag：1表示大角度弧线，0为小角度弧线（如果数值大于50%，则这个应该是1，否则是0）。
- sweep-flag：1为顺时针方向，0为逆时针方向。
- x：结束点x坐标
- y：结束点y坐标

*/

export const ProgressCircle = designComponent({
    name: 'pl-progress-circle',
    props: {
        ...PROGRESS_DEFAULT_PROPS,

        size: {type: Number, default: 100},                                                     // 大小尺寸
        lineSize: {type: Number, default: 6},                                                   // 线条尺寸
        startAngle: {type: Number, default: 0},                                                 // 起始角度

        antiClockwise: {type: Boolean},                                                         // 逆时针
        loading: {type: Boolean},                                                               // 加载动画
    },
    emits: {
        onUpdateModelValue: (val?: number) => true,
    },
    setup({props, event}) {

        const {slots} = useSlots()

        const model = useModel(() => 0, event.emit.onUpdateModelValue, {autoWatch: false})

        const animate = createAnimate({
            time: props.loading ? 1500 : 900,
            initValue: () => model.value != null ? model.value : (props.loading ? loading.min : 0),
            action: val => model.value = val,
        })

        const loading = (() => {
            return reactive({
                isLoading: false,
                max: 75,
                min: 15,
                start: () => {
                    const run = () => {
                        if (model.value == null) {
                            model.value = loading.min
                        }
                        animate.start(model.value <= loading.min ? loading.max : loading.min, run)
                    }
                    animate.start(loading.max, run)
                    loading.isLoading = true
                },
                end: () => {
                    animate.stop()
                    loading.isLoading = false
                },
            })
        })();

        const styles = useStyles(style => {
            style.width = unit(props.size)
            style.height = unit(props.size)
        })

        const percent = computed(() => model.value == null ? 0 : model.value / 100)

        const radius = computed(() => 50 - props.lineSize / 2)

        const pathD = computed(() => {
            let d = [`M 50 ${props.lineSize / 2}`] as (string | number)[]
            const r = radius.value
            const p = percent.value /*小于1的百分比数字*/

            const degrees = Math.PI * 2 * p

            d.push(`A ${r} ${r} 0`)
            d.push(p > 0.5 ? 1 : 0)
            d.push(props.antiClockwise ? 0 : 1)
            d.push(`${50 + r * Math.sin(degrees) * (props.antiClockwise ? -1 : 1)} ${50 - r * Math.cos(degrees)}`)

            return d.join(' ')
        })


        const pathStroke = computed(() => {
            switch (props.status) {
                case 'success':
                    return props.successColor
                case 'error':
                    return props.errorColor
                default:
                    return props.innerColor
            }
        })

        const circleStroke = computed(() => {
            if (percent.value === 1) {
                return pathStroke.value
            }
            return props.outerColor
        })

        const pathStyles = useStyles(style => {
            style.transform = `rotate(${props.startAngle}deg)`
        })

        watch(() => props.loading, val => val ? loading.start() : loading.end(), {immediate: true})

        watch(() => props.modelValue, val => !props.loading && animate.start(val), {immediate: true})

        return {
            refer: {
                animate,
            },
            render: () => (
                <div class={`pl-progress-circle ${loading.isLoading ? 'pl-progress-circle-loading' : ''}`} style={styles.value}>
                    <svg viewBox="0 0 100 100">

                        <circle
                            cx="50"
                            cy="50"
                            r={radius.value}
                            stroke={circleStroke.value}
                            stroke-width={props.lineSize}
                            fill="none"/>

                        {percent.value !== 1 && <path
                            d={pathD.value}
                            stroke={pathStroke.value}
                            stroke-width={props.lineSize}
                            fill="none"
                            stroke-linecap="round"
                            style={pathStyles.value}
                        />}

                    </svg>

                    <div class="pl-progress-circle-label">
                        {props.loading ? slots.default() : <>
                            {props.status === 'normal' && slots.default(`${model.value}%`)}
                            {props.status === 'success' && <pl-icon icon="el-icon-check-bold" class="pl-progress-bar-icon-success" style={{color: props.successColor}}/>}
                            {props.status === 'error' && <pl-icon icon="el-icon-close-bold" class="pl-progress-bar-icon-error" style={{color: props.errorColor}}/>}
                        </>}
                    </div>
                </div>
            )
        }
    },
})