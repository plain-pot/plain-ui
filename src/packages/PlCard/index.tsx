import './card.scss'
import {designComponent, useClasses,InheritHtmlElement, useRefs, useStyles} from "plain-ui-composition";
import {unit} from "plain-utils/string/unit";

export const PlCard = designComponent({
    name: 'pl-card',
    props: {
        width: {type: [String, Number], default: '300'},        // 卡片宽度
        noPadding: {type: Boolean},                             // 去掉标题以及内容的内边距
        mini: {type: Boolean},                                  // 小型卡片
        shadow: {type: String},                                 // 阴影, normal,hover
        title: {type: String},                                  // 卡片标题
    },
    slots: [
        'head',
        'desc',
        'default',
        'operator',
        'poster',
        'foot',
    ],
    inheritPropsType: InheritHtmlElement,
    setup({props, slots}) {

        const {refs, onRef} = useRefs({el: HTMLDivElement})

        const classes = useClasses(() => [
            'pl-card',
            {
                'pl-card-mini': props.mini,
                'pl-card-no-padding': props.noPadding,
                [`pl-card-shadow-${props.shadow}`]: !!props.shadow,
            }
        ])

        const styles = useStyles(style => {
            !!props.width && (style.width = unit(props.width))
        })

        return {
            refer: {refs,},
            render: () => (
                <div class={classes.value} style={styles.value} ref={onRef.el}>
                    {slots.poster.isExist() && <div class="pl-card-poster">
                        {slots.poster()}
                    </div>}
                    {(props.title || slots.head.isExist() || slots.desc.isExist() || slots.operator.isExist()) && (
                        <div class="pl-card-head">
                            <div class="pl-card-head-content">
                                {(props.title || slots.head.isExist()) && <div class="pl-card-title">
                                    {slots.head(props.title)}
                                </div>}
                                {(slots.desc.isExist()) && <div class="pl-card-desc">
                                    {slots.desc()}
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

export default PlCard
