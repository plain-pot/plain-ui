import {designComponent} from "../../../src/use/designComponent";
import {PropType} from 'vue';
import {ProHomeMenuData} from "./home.utils";

export const ProHomeMenuItem = designComponent({
    props: {
        menu: {type: Object as PropType<ProHomeMenuData>, required: true},
        basePadding: {type: Number, default: 16},
    },
    setup({props}) {
        return {
            render: () => (
                <div class="pro-home-menu-item">
                    <div class="pro-home-menu-item-content" style={{paddingLeft: `${props.basePadding}px`}}>
                        {!!props.menu.icon && <pl-icon icon={props.menu.icon}/>}
                        <span>{props.menu.title}</span>
                        <div class="pro-home-menu-item-expander">
                            <pl-icon icon="el-icon-arrow-down"/>
                        </div>
                    </div>
                </div>
            )
        }
    },
})