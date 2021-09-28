import {designComponent} from "plain-design-composition";
import {reactive} from 'vue'
import './DemoRow.scss'
import {DemoRowCollector} from "./DemoRowController";
import {DemoRowCache} from "./DemoRow.utils";
import {useClasses} from "plain-design-composition";
import {Router} from "../app/navigator.utils";
import PlIcon from "../../src/packages/PlIcon";

export const DemoRow = designComponent({
    name: 'demo-row',
    props: {
        title: {type: String},
        group: {type: Boolean},
    },
    emits: {
        change: (val: boolean) => true
    },
    slots: ['default'],
    provideRefer: true,
    setup({props, slots, event}) {

        DemoRowCollector.child()

        const demoRow = DemoRow.use.inject(null) as { props: { title?: string } } | null

        const id = [Router.route.path, !!demoRow ? demoRow.props.title : '', props.title].filter(Boolean).join(' >> ')

        const state = reactive({
            show: DemoRowCache.get(id),
        })

        const methods = {
            set(val: boolean) {
                state.show = val
                DemoRowCache.set(id, state.show)
                event.emit.change(state.show)
            },
        }

        const handler = {
            clickTitle: () => {
                methods.set(!state.show)
            }
        }

        const classes = useClasses(() => ['demo-row', {'demo-row-show': state.show, 'demo-row-group': props.group}])

        return {
            refer: {
                id,
                state,
                methods,
                props,
            },
            render: () => (
                <div class={classes.value}>
                    {!!props.title && (
                        <div class="demo-row-title">
                            <span onClick={handler.clickTitle}>{props.title}</span>
                            <PlIcon icon={state.show ? 'el-icon-d-arrow-right' : 'el-icon-d-arrow-left'} class="demo-row-icon-expand"/>
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
