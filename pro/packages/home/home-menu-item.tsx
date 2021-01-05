import {designComponent} from "../../../src/use/designComponent";
import {PropType, computed} from 'vue';
import {ProHomeMenuData} from "./home.utils";

export const ProHomeMenuItem = designComponent({
    props: {
        menu: {type: Object as PropType<ProHomeMenuData>, required: true},
        basePadding: {type: Number, default: 16},
    },
    setup({props}) {

        const hasChildren = computed(() => !!props.menu.children && props.menu.children.length > 0)

        const onClickContent = (menu: ProHomeMenuData) => {
            if (!hasChildren.value) return
            menu.expand = !menu.expand
        }

        const renderContent = (menu: ProHomeMenuData) => (
            <div class={[
                'pro-home-menu-item-content',
                {
                    'pro-home-menu-item-expand': menu.expand
                }
            ]}
                 style={{paddingLeft: `${props.basePadding}px`}}
                 key={menu.title}
                 onClick={() => onClickContent(menu)}
            >
                <span class="pro-home-menu-item-icon">{!!menu.icon && <pl-icon icon={menu.icon}/>}</span>
                <span>{menu.title}</span>
                {hasChildren.value && (
                    <div class="pro-home-menu-item-expander">
                        <pl-icon icon="el-icon-arrow-down"/>
                    </div>
                )}
            </div>
        )

        return {
            render: () => (
                <div class="pro-home-menu-item">
                    {renderContent(props.menu)}
                    {!!props.menu.children && props.menu.children.length > 0 && (
                        <pl-collapse-transition>
                            {props.menu.expand === true && (
                                <div class="pro-home-menu-children">
                                    {props.menu.children.map((child) => (
                                        <ProHomeMenuItem menu={child} basePadding={props.basePadding + 8}/>
                                    ))}
                                </div>
                            )}
                        </pl-collapse-transition>
                    )}
                </div>
            )
        }
    },
})