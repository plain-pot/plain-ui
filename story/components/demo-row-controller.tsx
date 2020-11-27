import {designComponent} from "../../src/use/designComponent";
import {useSlots} from "../../src/use/useSlots";
import {useCollect} from "../../src/use/useCollect";
import {DemoRow, DemoRowCache} from "./demo-row";

export const DemoRowController = designComponent({
    name: 'demo-row-controller',
    setup() {
        const {slots} = useSlots()

        const children = DemoRowCollector.parent()

        const methods = {
            changeAll: (flag: boolean) => {
                children.forEach(child => child.methods.set(flag))
                DemoRowCache.setAll(flag)
            }
        }

        return {
            render: () => (
                <>
                    {slots.default()}
                    <div class="demo-row-collector-operator">
                        <div onClick={() => methods.changeAll(false)}>
                            <span>全部收起</span>
                            <pl-icon icon="el-icon-d-arrow-left" style="transform: rotate(-90deg)"/>
                        </div>
                        <div onClick={() => methods.changeAll(true)}>
                            <span>全部展开</span>
                            <pl-icon icon="el-icon-d-arrow-left" style="transform: rotate(90deg)"/>
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