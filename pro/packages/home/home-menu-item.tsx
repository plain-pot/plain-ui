import {designComponent} from "../../../src/use/designComponent";
import {PropType, computed} from 'vue';
import {ProHomeMenuData} from "./home.utils";
import {NavigatorManager, PageConfig} from "../../../src/packages/nav/NavigatorManager";

export const ProHomeMenuItem = designComponent({
    props: {
        menu: {type: Object as PropType<ProHomeMenuData>, required: true},
        basePadding: {type: Number, default: 16},
        nav: {type: Object as PropType<NavigatorManager>, required: true},
    },
    setup({props}) {

        const hasChildren = computed(() => !!props.menu.children && props.menu.children.length > 0)

        const onClickContent = async (menu: ProHomeMenuData) => {
            if (!!menu.path) {
                const pageConfig: PageConfig = {
                    title: menu.title,
                    path: menu.path,
                    icon: menu.icon,
                    data: {menu},
                }
                await props.nav.openTab(pageConfig)
            }
            if (!hasChildren.value) return
            menu.expand = !menu.expand
        }

        const renderContent = (menu: ProHomeMenuData) => (
            <div class={[
                'pro-home-menu-item-content',
                {
                    'pro-home-menu-item-expand': menu.expand,
                    'pro-home-menu-item-active': !!props.nav.currentStack &&
                        menu.title == props.nav.currentStack.pageConfig.title &&
                        menu.path == props.nav.currentStack.pageConfig.path,
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
                                        <ProHomeMenuItem menu={child} basePadding={props.basePadding + 8} nav={props.nav}/>
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