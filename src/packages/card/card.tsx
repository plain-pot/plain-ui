import {designComponent} from "../../use/designComponent";
import {useSlots} from "../../use/useSlots";
import {useStyles} from "../../use/useStyles";
import {useProps} from "../../use/useProps";
import {unit} from "plain-utils/string/unit";
import './card.scss'
import {useClass} from "../../use/useClasses";

export default designComponent({
    name: 'pl-card',
    props: {
        width: {type: [String, Number], default: '300'},        // 卡片宽度
        noPadding: {type: Boolean},                             // 去掉标题以及内容的内边距
        mini: {type: Boolean},                                  // 小型卡片
        title: {type: String},                                  // 卡片标题
        desc: {type: String},                                   // 卡片标题描述
        shadow: {type: String},                                 // 阴影, normal,hover
    },
    setup({props, event: {emit}}) {
        const {slots} = useSlots([
            'title',                                // 卡片标题
            'desc',                                 // 标题下方的描述
            // 'default',                              // 卡片内容
            'operator',                             // 卡片标题右侧的操作按钮
            'poster',                               // 卡片海报（标题上方）
            'foot',                                 // 卡片底部操作栏
        ], true)

        const classes = useClass(() => [
            'pl-card',
            {
                'pl-card-mini': props.mini,
                'pl-card-no-padding': props.noPadding,
                [`pl-card-shadow-${props.shadow}`]: !!props.shadow,
            }
        ])

        const {propsState} = useProps(props, {
            width: useProps.NUMBER,
        })

        const styles = useStyles(style => {
            !!propsState.width && (style.width = unit(propsState.width))
        })

        return {
            render: () => (
                <div class={classes.value} style={styles.value}>
                    {slots.poster.isExist() && <div class="pl-card-poster">
                        {slots.poster()}
                    </div>}
                    {(slots.title.isExist() || slots.desc.isExist() || slots.operator.isExist() || props.title || props.desc) && (
                        <div class="pl-card-head">
                            <div class="pl-card-head-content">
                                {(slots.title.isExist() || props.title) && <div class="pl-card-title">
                                    {slots.title(props.title)}
                                </div>}
                                {(slots.desc.isExist() || props.desc) && <div class="pl-card-desc">
                                    {slots.desc(props.desc)}
                                </div>}
                            </div>
                            {slots.operator.isExist() && <div class="pl-card-head-operator">
                                {slots.operator()}
                            </div>}
                        </div>
                    )}
                    {slots.default.isExist() && <div class="pl-card-content">
                        {slots.default()}
                    </div>}
                    {slots.foot.isExist() && <div class="pl-card-foot">
                        {slots.foot()}
                    </div>}
                </div>
            )
        }
    },
})