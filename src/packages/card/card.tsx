import {designComponent} from "../../use/designComponent";
import {useSlots} from "../../use/useSlots";
import {useStyles} from "../../use/useStyles";
import {useProps} from "../../use/useProps";
import {unit} from "plain-utils/string/unit";

export default designComponent({
    name: 'pl-card',
    props: {
        width: {type: [String, Number], default: '300'},// 卡片宽度
        noPadding: {type: Boolean},                 // 去掉标题以及内容的内边距
        mini: {type: Boolean},                      // 小型卡片
        title: {type: String},                      // 小型卡片
        desc: {type: String},                      // 小型卡片

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

        const {propsState} = useProps(props, {
            width: useProps.NUMBER,
        })

        const styles = useStyles(style => {
            !!propsState.width && (style.width = unit(propsState.width))
        })

        return {
            render: () => (
                <div class="pl-card" style={styles.value}>
                    {(slots.title.isExist() || slots.desc.isExist() || slots.operator.isExist()) && (
                        <div class="pl-card-title">

                        </div>
                    )}
                    <div class="pl-card-content">
                        {slots.default()}
                    </div>
                </div>
            )
        }
    },
})