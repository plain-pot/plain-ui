import {designComponent} from "../../use/designComponent";
import {PROGRESS_DEFAULT_PROPS} from "./progress.utils";
import {useScopedSlots} from "../../use/useScopedSlots";
import {useStyles} from "../../use/useStyles";
import {unit} from 'plain-utils/string/unit';

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

rx：x轴半径
ry：y轴半径
x-axis-rotation：指椭圆的X轴与水平方向顺时针方向夹角，可以想像成一个水平的椭圆绕中心点顺时针旋转的角度
large-arc-flag：1表示大角度弧线，0为小角度弧线。
sweep-flag：1为顺时针方向，0为逆时针方向
x：结束点x坐标
y：结束点y坐标

<path
    d="
        M cx cy
        m 0 -r
        a r r 0 1 0 0 2r
        a r r 0 1 0 0 -2r"
>
></path>

*/

export const ProgressCircle = designComponent({
    name: 'pl-progress-circle',
    props: {
        ...PROGRESS_DEFAULT_PROPS,

        size: {type: Number, default: 100},                                                     // 大小尺寸
        lineSize: {type: Number, default: 6},                                                   // 线条尺寸
        startAngle: {type: Number, default: -0.5 * Math.PI},                                    // 起始角度
        dashboard: {type: Boolean},                                                             // 仪表盘形式的进度条
    },
    setup({props}) {

        const {scopedSlots} = useScopedSlots({
            default: {animatePercent: Number, value: Number}
        })

        const styles = useStyles(style => {
            style.width = unit(props.size)
            style.height = unit(props.size)
        })

        return {
            render: () => (
                <div class="pl-progress-circle" style={styles.value}>
                    <svg viewBox="0 0 100 100">
                        <path
                            d="M 50 50 m -40 0 a 40 40 0 1 0 80 0  a 40 40 0 1 0 -80 0"
                            fill="none"
                            stroke="#e5e9f2"
                            stroke-width="5">
                        </path>
                    </svg>
                </div>
            )
        }
    },
})