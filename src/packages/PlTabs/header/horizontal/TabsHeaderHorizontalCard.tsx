import {designComponent} from "plain-ui-composition";

import {TabCommonProps} from "../../tabs.utils";
import './tabs-header-card.scss'

export const PlTabsHeaderHorizontalCard = designComponent({
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
