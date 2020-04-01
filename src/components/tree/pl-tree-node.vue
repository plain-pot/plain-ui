<script>
    import {TreeMark} from "./tree";

    export default {
        name: "pl-tree-node",
        props: {
            treeNode: {type: Object},
        },
        inject: {
            plTree: {default: null},
        },
        data() {
            const init = !this.plTree.renderAfterExpand
            const show = init
            return {
                init,
                show,
            }
        },
        render(h) {

            const nodeDirectives = [{
                name: 'show',
                value: this.treeNode.isVisible
            }]
            const nodeListDirectives = [{
                name: 'show',
                value: this.isExpand && this.show
            }]

            return (
                <li class="pl-tree-node" class={this.classes} {...{directives: nodeDirectives}}>
                    <div class="pl-tree-node-content" style={this.contentStyles} onClick={() => this.plTree.onClickNodeContent(this.treeNode)}>
                        <div class="pl-tree-node-content-expand-wrapper">
                            {
                                this.isLoading ?
                                    <pl-loading type="beta"/>
                                    :
                                    (!this.treeNode.isLeaf && <pl-icon icon={this.plTree.expandIcon || 'el-icon-arrow-right'} onClick={e => this.plTree.onClickExpandIcon(e, this.treeNode)} class="pl-tree-expand-icon"/>)
                            }
                        </div>
                        {!!this.plTree.showCheckbox && <pl-checkbox-indeterminate
                            checkboxProps={{value: this.treeNode.checkStatus === 'check'}}
                            status={this.treeNode.checkStatus}
                            disabled={this.isDisabled || !this.treeNode.isCheckable}
                            {...{nativeOn: {click: e => this.plTree.onClickCheckbox(e, this.treeNode)}}}
                        />}
                        <div class="pl-tree-node-content-label">
                            {!this.plTree.nodeIcon ? null : <pl-icon icon={this.plTree.nodeIcon(this.treeNode)}/>}
                            {!!this.plTree.$scopedSlots.default ?
                                this.plTree.$scopedSlots.default(this.treeNode)
                                :
                                (!!this.plTree.renderContent ?
                                    this.plTree.renderContent(h, this.treeNode)
                                    :
                                    <span>{this.treeNode.label}</span>)
                            }
                        </div>
                    </div>

                    <pl-collapse-transition>
                        {!this.treeNode.isLeaf && this.init && <ul class="pl-tree-node-list" {...{directives: nodeListDirectives}}>
                            {!!this.treeNode.children && this.treeNode.children.length > 0 ?
                                this.treeNode.children.map((item, index) => <pl-tree-node key={index} tree-node={item} level={this.level + 1}/>)
                                :
                                <li class="pl-tree-node-empty-text" style={this.emptyTextStyles}>
                                    <pl-icon icon="el-icon-reading"/>
                                    <span>{this.plTree.emptyText}</span>
                                </li>
                            }
                        </ul>}
                    </pl-collapse-transition>
                </li>
            )
        },
        computed: {
            level(){
                return this.treeNode.level - 1
            },
            classes() {
                return [
                    'pl-tree-node',
                    {'pl-tree-node-expand': this.isExpand, 'pl-tree-node-current': this.treeNode.key === this.plTree.p_currentKey}
                ]
            },
            /**
             * content节点style
             * @author  韦胜健
             * @date    2020/3/31 9:32
             */
            contentStyles() {
                return {
                    paddingLeft: `${this.plTree.intent * this.level + 6}px`
                }
            },
            /**
             * 无子节点显示的文本样式
             * @author  韦胜健
             * @date    2020/3/31 15:04
             */
            emptyTextStyles() {
                return {
                    paddingLeft: `${this.plTree.intent * this.level + 6 + 6 + 14}px`
                }
            },
            /**
             * 当前是否已经展开
             * @author  韦胜健
             * @date    2020/3/31 9:32
             */
            isExpand() {
                let isExpand = this.treeNode.isExpand
                if (!this.init && !!isExpand) {
                    this.init = true
                    this.$nextTick(() => this.show = true)
                }
                return isExpand
            },
            /**
             * 当前节点是否处于加载状态
             * @author  韦胜健
             * @date    2020/3/31 10:54
             */
            isLoading() {
                return this.plTree.getMark(this.treeNode.key, TreeMark.loading)
            },
        },
    }
</script>

<style lang="scss">
</style>