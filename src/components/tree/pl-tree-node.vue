<template>
    <div class="pl-tree-node" :class="classes">
        <div class="pl-tree-node-content" :style="styles">
            <pl-radio active-icon="pad-minus-square" inactive-icon="pad-plus-square" :value="p_open" size="small" color="primary" @click.stop="toggle"/>
            <pl-check-all :label="null" size="small" :status="checkStatus" @click="p_clickCheck" v-if="checkbox"/>
            <div @click="!!toggleOnClickContent && toggle()">
                <slot :data="data"></slot>
            </div>
        </div>
        <pl-collapse-transition v-if="p_initialized">
            <div v-show="p_open">
                <div class="pl-tree-node-wrapper" v-if="!!data[childrenKey] && data[childrenKey].length>0">
                    <pl-tree-node v-for="(item,index) in data[childrenKey]"
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
                                  @open="val=>$emit('open', val)"
                                  @close="val=>$emit('close',val)"
                                  @click="val=>$emit('click',val)"
                                  @childToggle="p_childToggle">
                        <template slot-scope="{data:nodeData}">
                            <slot :data="nodeData"></slot>
                        </template>
                    </pl-tree-node>
                </div>
                <div v-else>
                    <div class="pl-tree-node-content pl-tree-node-empty-text">
                        {{emptyText}}
                    </div>
                </div>
            </div>
        </pl-collapse-transition>
    </div>
</template>

<script>
    import PlCollapseTransition from "../collapse/pl-collapse-transition";
    import {TreeMixin} from "./index";
    import PlCheckAll from "../radio/pl-check-all";
    import PlRadio from "../radio/pl-radio";
    import PlIcon from "../pl-icon";

    export default {
        name: "pl-tree-node",
        components: {PlIcon, PlRadio, PlCheckAll, PlCollapseTransition, },
        mixins: [TreeMixin],
        props: {
            data: {type: Object, default: () => ({})},
        },
        data() {
            return {
                p_open: false,
                p_initialized: !this.initializedAfterOpen,
                p_parentNode: null,
                p_items: [],
            }
        },
        mounted() {
            /*寻找当前节点的父treeNode*/
            if (this.$parent.$parent.$options.name === 'pl-tree-node') {
                this.p_parentNode = this.$parent.$parent
                this.p_parentNode.p_addItem(this)
            }
            /*检查checkbox以及checkKey*/
            if (this.checkbox && !this.checkKey) {
                this.$dialog.show("Tree组件在使用checkbox功能时，必须指定checkKey")
            }
        },
        beforeDestroy() {
            /*从父元素移除当前节点*/
            if (!!this.p_parentNode) {
                this.p_parentNode.p_removeItem(this)
            }
        },
        computed: {
            /*
             *  当前组件绑定class
             *  @author     martsforever
             *  @datetime   2019/2/14 22:18
             */
            classes() {
                return [
                    // {'pl-tree-node-open': this.p_open,}
                ]
            },
            /*
             *  当前节点是否存在子节点
             *  @author     martsforever
             *  @datetime   2019/2/14 22:18
             */
            hasChild() {
                return this.p_dataHasChildren(this.data)
            },
            /*
             *  当前节点data的子数据
             *  @author     martsforever
             *  @datetime   2019/2/14 22:19
             */
            childrenData() {
                return !!this.data && this.childrenKey && !!this.data[this.childrenKey] ? this.data[this.childrenKey] : []
            },
            /*
             *  当前节点的选中状态
             *  @author     martsforever
             *  @datetime   2019/2/14 22:20
             */
            checkStatus() {
                if (this.hasChild) {
                    if (this.childrenData.every(data => !data[this.checkKey])) this.p_setDataCheck(this.data, false)
                    else this.p_setDataCheck(this.data, true)
                }
                return this.p_getStatusFromData(this.data)
            },

        },
        methods: {
            /*
             *  打开节点
             *  @author     martsforever
             *  @datetime   2019/2/13 23:20
             */
            open() {
                if (!!this.p_open) return
                const next = () => {
                    this.p_open = true
                    this.$emit('open', this.data)
                    if (!!this.p_parentNode && !this.p_parentNode.p_open) this.p_parentNode.open()
                }
                if (!!this.p_initialized) next()
                else {
                    this.p_initialized = true
                    this.$nextTick(next)
                }
            },
            /*
             *  关闭节点
             *  @author     martsforever
             *  @datetime   2019/2/13 23:20
             */
            close() {
                this.p_open = false
                this.$emit('close', this.data)
            },
            /*
             *  打开关闭节点
             *  @author     martsforever
             *  @datetime   2019/2/13 23:20
             */
            toggle() {
                this[!this.p_open ? 'open' : 'close']()
                this.$emit('click', this.data)
                this.$emit('childToggle', this)
            },
            /*
             *  选中当前节点
             *  @author     martsforever
             *  @datetime   2019/2/14 22:14
             */
            check() {
                this.p_changeChildrenDataCheck(this.data, true)
            },
            /*
             *  取消选中当前节点
             *  @author     martsforever
             *  @datetime   2019/2/14 22:14
             */
            unCheck() {
                this.p_changeChildrenDataCheck(this.data, false)
            },
            /*
             *  切换当前节点选中|未选中状态
             *  @author     martsforever
             *  @datetime   2019/2/14 22:15
             */
            toggleCheck() {
                switch (this.checkStatus) {
                    case 'all':
                        this.unCheck()
                        break
                    case 'some':
                        this.unCheck();
                        break
                    case 'none':
                        this.check()
                        break
                }
            },
            /*
             *  添加子节点组件对象
             *  @author     martsforever
             *  @datetime   2019/2/13 23:10
             */
            p_addItem(item) {
                this.p_items.push(item)
            },
            /*
             *  移除子节点对象
             *  @author     martsforever
             *  @datetime   2019/2/13 23:10
             */
            p_removeItem(item) {
                this.$plain.$utils.removeFromArray(this.p_items, item)
            },
            /*
             *  点击复选框
             *  @author     martsforever
             *  @datetime   2019/2/14 21:12
             */
            p_clickCheck() {
                this.toggleCheck()
            },
        },
    }
</script>