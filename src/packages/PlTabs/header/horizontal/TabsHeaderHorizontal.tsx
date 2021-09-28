import {designComponent, onUpdated, reactive, useClasses, useRefs, useStyles} from "plain-design-composition";
import {TabCommonProps} from "../../tabs.utils";
import {PlTabsHeaderHorizontalText} from "./TabsHeaderHorizontalText";
import {PlTabsHeaderHorizontalCard} from "./TabsHeaderHorizontalCard";
import {PlTabsHeaderHorizontalShadow} from "./TabsHeaderHorizontalShadow";
import './tabs-header-horizontal.scss'
import PlButton from "../../../PlButton";
import {delay} from "plain-utils/utils/delay";
import {unit} from "plain-utils/string/unit";

export const PlTabsHeaderHorizontal = designComponent({
    name: 'pl-tabs-header-horizontal',
    provideRefer: true,
    props: {
        ...TabCommonProps,
    },
    slots: ['default'],
    setup({props, slots}) {

        const {refs, onRef} = useRefs({el: HTMLDivElement})

        const state = reactive({
            showMoreButton: false,
            scrollLeft: 0,
            offsetWidth: 0,
            scrollWidth: 0,
        })

        const classes = useClasses(() => [
            'pl-tabs-header',
            'pl-tabs-header-horizontal',
            `pl-tabs-header-type-${props.headType}`,
            `pl-tabs-header-pos-${props.headPosition}`,
            {
                'pl-tabs-header-show-more': state.showMoreButton
            }
        ])

        const listStyles = useStyles(style => {
            if (state.showMoreButton) {
                style.left = unit(state.scrollLeft)
            }
        })

        onUpdated(async () => {
            await delay(50)
            const {scrollWidth, offsetWidth} = refs.el!
            let flag = scrollWidth > offsetWidth + 20
            if (state.showMoreButton !== flag) {
                state.showMoreButton = flag
            }
            state.offsetWidth = offsetWidth
            state.scrollWidth = scrollWidth
        })

        const handler = {
            scrollLeft: () => {
                const scrollLeft = state.scrollLeft + state.offsetWidth
                state.scrollLeft = Math.min(0, scrollLeft)
            },
            scrollRight: () => {
                const scrollLeft = state.scrollLeft - state.offsetWidth
                state.scrollLeft = Math.max(-(state.scrollWidth - state.offsetWidth), scrollLeft)
            },
        }

        return {
            refer: {
                refs,
            },
            render: () => (
                <div class={classes.value} ref={onRef.el}>
                    {state.showMoreButton && (
                        <div class="pl-tabs-header-more-button pl-boxshadow">
                            <PlButton icon="el-icon-arrow-left" mode="text" onClick={handler.scrollLeft}/>
                            <PlButton icon="el-icon-arrow-right" mode="text" onClick={handler.scrollRight}/>
                        </div>
                    )}
                    <div class="pl-tabs-header-list" style={listStyles.value}>
                        {(() => {
                            const Type = props.headType === 'shadow' ? PlTabsHeaderHorizontalShadow :
                                props.headType === 'card' ? PlTabsHeaderHorizontalCard : PlTabsHeaderHorizontalText
                            return (
                                <Type headType={props.headType} headPosition={props.headPosition}>
                                    {slots.default()}
                                </Type>
                            )
                        })()}
                    </div>
                </div>
            )
        }
    },
})
