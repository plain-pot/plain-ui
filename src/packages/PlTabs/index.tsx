import {computed, designComponent, useClasses, useModel, watch} from "plain-ui-composition";
import './tabs.scss'
import {useCollect} from "../../use/useCollect";
import PlTab from "../PlTab";
import {TabCommonProps, TabData} from "./tabs.utils";
import {PlTabsInner} from "./TabsInner";
import {PlTabsHeaderHorizontal} from "./header/horizontal/TabsHeaderHorizontal";
import {PlTabsHeaderVertical} from "./header/vertical/TabsHeaderVertical";
import PlIcon from "../PlIcon";

export const PlTabs = designComponent({
    props: {
        modelValue: {type: [String, Number]},                   // 双向绑定值，控制当前显示的tab
        closeable: {type: Boolean},                             // 是否显示关闭按钮，会派发onClose事件
        fitHeight: {type: Boolean},                             // 适配高度
        ...TabCommonProps,
    },
    emits: {
        onUpdateModelValue: (val?: string | number) => true,
    },
    slots: ['default', 'operator'],
    setup({props, event: {emit}, slots}) {

        const model = useModel(() => props.modelValue, emit.onUpdateModelValue)
        const items = TabCollector.parent()

        const tabs = computed(() => items.map((item, index) => {
            const {val} = item.props
            return {
                item,
                index,
                val: val == null ? index : val,
                active: (() => {
                    if (val != null) {
                        return model.value == val
                    }
                    if (model.value != null) {
                        return model.value == index
                    }
                    return index == 0
                })(),
            }
        }))

        watch(() => tabs.value.map(i => i.val).join('_'), () => {
            const activeItem = tabs.value.find(i => i.active)
            if (!activeItem) {
                model.value = tabs.value[0]?.val
            }
        })

        const classes = useClasses(() => [
            'pl-tabs',
            `pl-tabs-head-position-${props.headPosition}`,
            `pl-tabs-head-type-${props.headType}`,
            {
                'pl-tabs-fit-height': props.fitHeight
            },
        ])

        const handler = {
            onClickTabHeader: ({item, index, active}: TabData) => {
                const {props: {val}} = item
                if (active) {return}
                model.value = val == null ? index : val
            }
        }

        return {
            render: () => {

                const head = (() => {
                    const Header = props.headPosition === 'top' || props.headPosition === 'bottom' ? PlTabsHeaderHorizontal : PlTabsHeaderVertical
                    return (
                        <Header headType={props.headType} headPosition={props.headPosition}>
                            {tabs.value.map((tab, index) => (
                                <div class={([
                                    'pl-tabs-header-item',
                                    {'pl-tabs-header-item-active': tab.active}
                                ])} key={index}
                                     onClick={() => handler.onClickTabHeader(tab)} data-active={tab.active ? 1 : 0}>
                                    <span>{tab.item.scopeSlots.head({active: false}, tab.item.props.title)}</span>
                                    {props.closeable && <PlIcon icon="el-icon-close" onClick={e => {
                                        e.stopPropagation()
                                        tab.item.event.emit.onClose()
                                    }}/>}
                                </div>
                            ))}
                            {slots.operator.isExist() && (
                                <div class="pl-tabs-header-item-operator">
                                    {slots.operator()}
                                </div>
                            )}
                        </Header>
                    )
                })()
                const body = (
                    <div class="pl-tabs-body">
                        {[...tabs.value].sort((a, b) => String(a.val).localeCompare(String(b.val))).map((tab, index) => (
                            <PlTabsInner item={tab.item} key={index} active={tab.active}/>
                        ))}
                    </div>
                )

                return (
                    <div class={classes.value}>
                        <div class="pl-tabs-collector">{slots.default()}</div>
                        {props.headPosition === 'top' || props.headPosition === 'left' ? <>
                            {head}
                            {body}
                        </> : <>
                            {body}
                            {head}
                        </>}
                    </div>
                )
            }
        }
    },
})

export const TabCollector = useCollect(() => ({
    parent: PlTabs,
    child: PlTab,
}))

export default PlTabs
