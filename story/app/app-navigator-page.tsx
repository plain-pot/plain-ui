import {reactive, onMounted, onBeforeUnmount, markRaw} from 'vue';
import {AppNavigator, AppRoute} from "./app-navigator";
import {designComponent} from "../../src/use/designComponent";
import {DemoRowController} from "../components/demo-row-controller";

export const AppNavigatorPage = designComponent({
    name: 'app-navigator-page',
    setup() {

        const state = reactive({
            Page: null as any,
        })

        const navigator = AppNavigator.use.inject()

        async function onPathChange({path}: AppRoute) {

            if (!path) {
                return
            }

            try {
                state.Page = markRaw((await import('story/pages/' + path + '.vue')).default)
                return navigator.nav.emit.pageReady()
            } catch (e) {
                console.log(`找不到页面:${'story/pages/' + path + '.vue'}`)
                console.error(e)
                state.Page = null
            }
        }

        const eject = navigator.nav.on.pathChange(onPathChange)

        onMounted(async () => {
            await onPathChange(navigator.nav.route)
        })

        onBeforeUnmount(eject)

        return {
            render() {
                const {Page} = state
                return (
                    <div>
                        {!!Page && (
                            <DemoRowController>
                                <Page/>
                            </DemoRowController>
                        )}
                    </div>
                )
            },
        }
    },
})