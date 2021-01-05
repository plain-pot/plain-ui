import {designComponent} from "../../../src/use/designComponent";
import {NavigatorManager} from "../../../src/packages/nav/NavigatorManager";
import {PropType} from 'vue';

export const ProHomeHeader = designComponent({
    props: {
        nav: {type: Object as PropType<NavigatorManager>, required: true},
    },
    setup() {
        return {
            render: () => (
                <div class="pro-home-header">
                    home header
                </div>
            )
        }
    },
})