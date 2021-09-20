import {designComponent} from "plain-ui-composition"
import {DemoRowCache} from "./DemoRow.utils";
import {DemoRow} from "./DemoRow";
import PlIcon from "../../src/packages/PlIcon";
import {useCollect} from "../../src/use/useCollect";

export const DemoRowController = designComponent({
    name: 'demo-row-controller',
    slots: ['default'],
    setup({slots}) {

        const children = DemoRowCollector.parent()

        const methods = {
            changeAll: (flag: boolean) => {
                children.forEach(child => child.methods.set(flag))
                DemoRowCache.setAll(flag)
            }
        }

        return {
            refer: {
                name: 'i am row controller'
            },
            render: () => (
                <>
                    {slots.default()}
                    <div class="demo-row-collector-operator">
                        <div onClick={() => methods.changeAll(false)}>
                            <span>全部收起</span>
                            <PlIcon icon="el-icon-d-arrow-left" style={{transform: 'rotate(-90deg)'}}/>
                        </div>
                        <div onClick={() => methods.changeAll(true)}>
                            <span>全部展开</span>
                            <PlIcon icon="el-icon-d-arrow-left" style={{transform: 'rotate(90deg)'}}/>
                        </div>
                    </div>
                </>
            )
        }
    },
})

export const DemoRowCollector = useCollect(() => ({
    parent: DemoRowController,
    child: DemoRow,
}))