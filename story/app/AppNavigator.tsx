import {designComponent} from 'plain-ui-composition'
import {reactive, watch,Fragment} from 'vue'
import {Router} from "./navigator.utils";

export const AppNavigator = designComponent({
    setup() {

        const state = reactive({
            Page: null as any
        })

        watch(() => Router.route.path, async (path) => {
            if (!path) path = 'normal/DemoButton'
            if (path.charAt(0) === '/') {path = path.slice(1)}

            const Components = Object.values(await import('../pages/' + path)) as any[]
            state.Page = Components.map((Component, index) => (
                <Fragment key={index}>
                    <Component/>
                </Fragment>
            ))
        }, {immediate: true})

        return () => (
            <div class="app-navigator">
                {state.Page}
            </div>
        )
    },
})
