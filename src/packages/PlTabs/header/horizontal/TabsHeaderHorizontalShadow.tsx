import {designComponent} from "plain-design-composition";

import {TabCommonProps} from "../../tabs.utils";
import './tabs-header-shadow.scss'

export const PlTabsHeaderHorizontalShadow = designComponent({
    props: {
        ...TabCommonProps,
    },
    slots: ['default'],
    setup({props, slots}) {
        return () => <>
            {slots.default()}
        </>
    },
})
