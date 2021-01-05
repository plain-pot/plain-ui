import {designComponent} from "../../../src/use/designComponent";

export const ProHomeMenu = designComponent({
    setup() {
        return {
            render: () => (
                <div class="pro-home-menu">
                    <div class="pro-home-menu-header">
                        PlainUI Pro
                    </div>
                    <div class="pro-home-menu-content">
                        <pl-scroll fitHostWidth>
                            menu content
                        </pl-scroll>
                    </div>
                </div>
            )
        }
    },
})