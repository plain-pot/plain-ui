import {designComponent} from "../../../src/use/designComponent";
import {PropType} from 'vue';
import {ProHomeMenuData} from "./home.utils";
import {ProHomeMenuItem} from "./home-menu-item";

export const ProHomeMenu = designComponent({
    props: {
        menus: {type: Array as PropType<ProHomeMenuData[]>, required: true},
    },
    setup({props}) {
        return {
            render: () => (
                <div class="pro-home-menu">
                    <div class="pro-home-menu-header">
                        PLAINUIPRO
                    </div>
                    <div class="pro-home-menu-content">
                        <pl-scroll fitHostWidth>
                            {props.menus.map((menu, index) => <ProHomeMenuItem key={index} menu={menu}/>)}
                        </pl-scroll>
                    </div>
                </div>
            )
        }
    },
})