<template>
    <div class="pl-tree" :style="styles">
        <pl-scroll :scroll-x="scrollX" :scroll-y="true">
            <pl-tree-node v-for="(item,index) in data"
                          ref="nodes"
                          :key="index"
                          :data="item"
                          :label-key="labelKey"
                          :children-key="childrenKey"
                          :check-key="checkKey"
                          :width="width"
                          :auto-close="autoClose"
                          :empty-text="emptyText"
                          :toggle-on-click-content="toggleOnClickContent"
                          :initialized-after-open="initializedAfterOpen"
                          :checkbox="checkbox"
                          @open="val=>$emit('open',val)"
                          @close="val=>$emit('close',val)"
                          @click="val=>$emit('click',val)"
                          @childToggle="p_childToggle">
                <template slot-scope="{data:nodeData}">
                    <slot :data="nodeData">
                        {{nodeData[labelKey]}}
                    </slot>
                </template>
            </pl-tree-node>
        </pl-scroll>
    </div>
</template>

<script>
    import PlTreeNode from "./pl-tree-node";
    import {TreeMixin} from "./index";
    import PlScroll from "../pl-scroll";

    export default {
        name: "pl-tree",
        components: {PlScroll, PlTreeNode},
        mixins: [TreeMixin],

        methods: {
            /*
             *  打开树节点
             *  @author     martsforever
             *  @datetime   2019/2/13 23:05
             */
            async open(data) {
                let dataArray = this.findParentDataArray(this.data, data, [])
                for (let i = 0; i < dataArray.length; i++) {
                    const itemData = dataArray[i];
                    const node = this.findNode(itemData, this.$refs.nodes)
                    if (!!node) {
                        node.open()
                        await this.$plain.nextTick()
                    }
                }
            },
            /*
             *  关闭树节点
             *  @author     martsforever
             *  @datetime   2019/2/13 23:05
             */
            close(data) {
                const targetNode = this.findNode(data, this.$refs.nodes)
                !!targetNode && targetNode.close()
            },
            /*
             *  选中节点
             *  @author     martsforever
             *  @datetime   2019/2/14 22:27
             */
            check(data) {
                this.p_changeChildrenDataCheck(data, true)
            },
            /*
             *  取消选中节点
             *  @author     martsforever
             *  @datetime   2019/2/14 22:27
             */
            uncheck(data) {
                this.p_changeChildrenDataCheck(data, false)
            },
            /*
             *  获取选中的data
             *  @author     martsforever
             *  @datetime   2019/2/14 22:33
             */
            getCheckData(formatArray = true) {
                if (!this.data || this.data.length === 0) return []
                if (formatArray) {
                    return (this.data || []).reduce((ret, item) => {
                        this.p_getCheckDataToArray(item, ret)
                        return ret
                    }, [])
                } else return this.data.map(item => this.p_getCheckDataWithChildren(item)).filter(item => item != null)
            },
            /*
             *  找到数据的父级数据
             *  @author     martsforever
             *  @datetime   2019/2/13 23:06
             */
            findParentDataArray(treeData, targetData, ret = []) {
                if (!treeData || treeData.length === 0) return null
                for (let i = 0; i < treeData.length; i++) {
                    const itemData = treeData[i];
                    ret.push(itemData)
                    if (targetData === itemData) return ret
                    const itemRet = this.findParentDataArray(itemData[this.childrenKey], targetData, [...ret])
                    if (itemRet != null) return itemRet
                    ret.pop()
                }
                return null
            },
            /*
             *  根据数据获取对应节点组件对象
             *  @author     martsforever
             *  @datetime   2019/2/13 23:06
             */
            findNode(data, nodes) {
                if (!nodes || nodes.length === 0) return null
                for (let i = 0; i < nodes.length; i++) {
                    const node = nodes[i];
                    if (node.data === data) return node
                    const ret = this.findNode(data, node.$refs.nodes)
                    if (!!ret) return ret
                }
                return null
            },
            /*
             *  递归获取被选中的节点数据
             *  @author     martsforever
             *  @datetime   2019/2/15 22:38
             */
            p_getCheckDataWithChildren(data) {
                if (!data[this.checkKey]) return null
                const childrenData = (data[this.childrenKey] || []).map(itemData => this.p_getCheckDataWithChildren(itemData)).filter(item => item != null)
                return {data, childrenData}
            },
            /*
             *  获取被选中的节点数据，最后转化为一个一维的数组
             *  @author     martsforever
             *  @datetime   2019/2/15 22:41
             */
            p_getCheckDataToArray(data, array) {
                if (!data[this.checkKey]) return
                array.push(data)
                if (!data[this.childrenKey] || data[this.childrenKey].length === 0) return
                for (let i = 0; i < data[this.childrenKey].length; i++) {
                    const itemData = data[this.childrenKey][i];
                    this.p_getCheckDataToArray(itemData, array)
                }
            }
        }
    }
</script>