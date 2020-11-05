import {designComponent} from "../../src/use/designComponent";
import {reactive} from 'vue';
import {useSlots} from "../../src/use/useSlots";
import './demo-row.scss'
import {AppNavigator} from "../app/app-navigator";

const DEMO_ROW_STORAGE_KEY = 'DEMO_ROW'

const cache = (() => {
    let str = localStorage.getItem(DEMO_ROW_STORAGE_KEY)
    const cache: Record<string, boolean> = !!str ? JSON.parse(str) : {}

    return {
        get: (id: string) => {
            const flag = cache[id]
            return flag == null ? true : flag
        },
        set: (id: string, flag: boolean) => {
            cache[id] = flag
            localStorage.setItem(DEMO_ROW_STORAGE_KEY, JSON.stringify(cache))
        }
    }
})()

export const DemoRow = designComponent({
    name: 'demo-row',
    props: {
        title: {type: String},
    },
    emits: {
        change: (val: boolean) => true
    },
    setup({props, event}) {

        const navigator = AppNavigator.use.inject()

        const demoRow = DemoRow.use.inject(null) as { id: string } | null

        const id = navigator.nav.route.path + props.title + (!!demoRow ? demoRow.id : '')

        const state = reactive({
            show: cache.get(id),
        })

        const {slots} = useSlots()

        const handler = {
            clickTitle: () => {
                state.show = !state.show
                cache.set(id, state.show)
                event.emit.change(state.show)
            }
        }


        return {
            refer: {
                id,
                state,
            },
            render: () => (
                <div class={['demo-row', {'demo-row-show': state.show}]}>
                    {!!props.title && (
                        <div class="demo-row-title">
                            <span onClick={handler.clickTitle}>{props.title}</span>
                            <pl-icon icon="el-icon-d-arrow-right" class="demo-row-icon-expand"/>
                        </div>
                    )}
                    {state.show && (
                        <div class="demo-row-content">
                            {slots.default()}
                        </div>
                    )}
                </div>
            )
        }
    },
})