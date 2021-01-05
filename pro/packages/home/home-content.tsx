import {designComponent} from "../../../src/use/designComponent";
import {NavigatorManager} from "../../../src/packages/nav/NavigatorManager";
import {PropType} from 'vue';
import Nav from '../../../src/packages/nav/nav'

export const ProHomeContent = designComponent({
    props: {
        nav: {type: Object as PropType<NavigatorManager>, required: true},
    },
    setup({props}) {
        return {
            render: () => (
                <div class="pro-home-content">
                    <Nav nav={props.nav}
                         height="100%"
                         width="100%"
                    />
                </div>
            )
        }
    },
})