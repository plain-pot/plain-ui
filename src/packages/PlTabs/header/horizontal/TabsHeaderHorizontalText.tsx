import {computed, designComponent, onMounted, onUpdated, reactive, useStyles, watchEffect} from "plain-design-composition";

import {TabCommonProps} from "../../tabs.utils";
import './tabs-header-text.scss'
import {PlTabsHeaderHorizontal} from "./TabsHeaderHorizontal";
import {unit} from "plain-utils/string/unit";

interface ElItemInfo {
    left: number,
    width: number,
    active: boolean,
}

export const PlTabsHeaderHorizontalText = designComponent({
    props: {
        ...TabCommonProps,
    },
    slots: ['default'],
    setup({props, slots}) {

        const state = reactive({
            elInfo: {
                data: [] as ElItemInfo[],
                key: '',
            },
        })

        const parent = PlTabsHeaderHorizontal.use.inject()

        onUpdated(() => {
            const {el} = parent.refs
            if (!el) {
                if (state.elInfo.data.length > 0) {state.elInfo = {data: [], key: ''}}
                return
            }
            const tabItemEls = Array.from<HTMLElement>(el.querySelectorAll('.pl-tabs-header-item'))
            const elInfoData: ElItemInfo[] = tabItemEls.map((itemEl) => {
                const {offsetWidth: width, offsetLeft: left} = itemEl
                const active = itemEl.getAttribute('data-active')?.toString() == '1'
                return {width, left, active}
            })
            const elInfo = {
                data: elInfoData,
                key: JSON.stringify(elInfoData)
            }
            if (elInfo.key !== state.elInfo.key) {
                state.elInfo = elInfo
            }
        })

        const indicatorStyles = useStyles(() => {
            const activeInfo = state.elInfo.data.find(i => i.active)
            if (!activeInfo) {
                return {width: 0, left: 0}
            } else {
                return {width: unit(activeInfo.width), left: unit(activeInfo.left)}
            }
        })

        return () => <>
            {slots.default()}
            <div class="pl-tabs-header-horizontal-text-indicator-container">
                <i class="pl-tabs-header-horizontal-text-indicator" style={indicatorStyles.value}/>
            </div>
        </>
    },
})
