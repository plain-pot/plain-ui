import {defineComponent} from "@vue/composition-api";
import {TreeProps, useTree} from "@/packages/tree/use/use-tree";

export default defineComponent({
    name: 'pl-tree',
    props: {
        ...TreeProps,
    },
    setup(props) {

        const data = useTree(props)

        return () => (
            <div class={data.classes.value} {...{directives: [{name: 'loading', value: data.isLoading.value}]}}>
                {(!data.formatData.value && data.formatData.value!.length === 0) ? (
                    <div class="pl-tree-node-empty-text">
                        <pl-icon icon="el-icon-reading"/>
                        <span>{props.emptyText}</span>
                    </div>
                ) : data.formatData.value!.map((item, index) => (<pl-tree-node key={item.key || index} tree-node={item}/>))}
                {/*{!!props.draggable && <span class="pl-tree-drag-indicator" style={data.indicatorStyles.value} {...{directives: [{name: 'show', value: dragState.show}]}}/>}*/}
            </div>
        )
    },
})