import {designComponent} from "plain-ui-composition";
import {Fragment} from 'vue'
import {Menu} from "./menu.utils";
import {PlIcon} from "../../src/packages/PlIcon";
import {PlScroll} from "../../src/packages/PlScroll";

export const AppMenu = designComponent({
    setup() {
        return () => (
            <div class="app-menu">
                <PlScroll fitHostWidth>
                    {Menu.data.map(group => <Fragment key={group.name}>
                        <div class="app-menu-group" key={`group_${group.name}`}>
                            <span>{group.name}</span>
                        </div>
                        {group.children.map(menu => (
                            <div class="app-menu-item" key={`item_${menu.page}`} onClick={() => Menu.openMenu(menu)}>
                                <span>{menu.name}</span>
                                <span>{menu.title}</span>

                                {!!menu.complete && (
                                    <div class="app-menu-item-is-done">
                                        <PlIcon icon="el-icon-star-on"/>
                                    </div>
                                )}
                            </div>
                        ))}
                    </Fragment>)}
                </PlScroll>
            </div>
        )
    },
})
