<script>
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
            const nodeOn = {
                ...(!!this.plTree.draggable ? {
                    dragstart: this.plTree.dragState.dragstart,
                    dragend: this.plTree.dragState.dragend,
                    dragover: this.plTree.dragState.dragover,
                } : {})
            }

            const nodeListDirectives = [{
                name: 'show',
                value: this.isExpand && this.show
            }]

            return (
                <div class={this.classes} {...{directives: nodeDirectives, on: nodeOn}} draggable={this.plTree.draggable}>
                    <div class="pl-tree-node-wrapper">
                        <div class="pl-tree-node-operator" style={this.expanderStyles}>
                            <span class="pl-tree-node-expander">
                                {
                                    this.treeNode.isLoading ?
                                        <pl-loading type="beta"/>
                                        :
                                        (!this.treeNode.isLeaf && <pl-icon icon={this.plTree.expandIcon || 'el-icon-arrow-right'} onClick={e => this.plTree.onClickExpandIcon(e, this.treeNode)} class="pl-tree-expand-icon"/>)
                                }
                            </span>
                            {!!this.plTree.showCheckbox && <pl-checkbox-indeterminate
                                checkboxProps={{value: this.treeNode.checkStatus === 'check'}}
                                status={this.treeNode.checkStatus}
                                disabled={this.isDisabled || !this.treeNode.isCheckable}
                                {...{nativeOn: {click: e => this.plTree.onClickCheckbox(e, this.treeNode)}}}
                            />}
                        </div>
                        <div class="pl-tree-node-content" onClick={() => this.plTree.onClickNodeContent(this.treeNode)} style={this.contentStyles}>
                            {!!this.plTree.$scopedSlots.default ?
                                this.plTree.$scopedSlots.default(this.treeNode)
                                :
                                (!!this.plTree.renderContent ?
                                    this.plTree.renderContent(h, this.treeNode)
                                    :
                                    [
                                        !this.plTree.nodeIcon ? null : <pl-icon icon={this.plTree.nodeIcon(this.treeNode)}/>,
                                        <span class="pl-tree-node-label">{this.treeNode.label}</span>
                                    ])
                            }
                        </div>
                    </div>

                    <pl-collapse-transition>
                        {!this.treeNode.isLeaf && this.init && <div class="pl-tree-node-list" {...{directives: nodeListDirectives}}>
                            {!!this.treeNode.children && this.treeNode.children.length > 0 ?
                                this.treeNode.children.map((item, index) => <pl-tree-node key={index} tree-node={item}/>)
                                :
                                <div class="pl-tree-node-empty-text" style={this.emptyTextStyles}>
                                    <pl-icon icon="el-icon-reading"/>
                                    <span>{this.plTree.emptyText}</span>
                                </div>
                            }
                        </div>}
                    </pl-collapse-transition>
                </div>
            )
        },
        computed: {
            level() {
                return this.treeNode.level - 1
            },
            classes() {
                return [
                    'pl-tree-node',
                    {
                        'pl-tree-node-expand': this.isExpand,
                        'pl-tree-node-current': this.treeNode.key === this.plTree.p_currentKey,
                        'pl-tree-node-drop-inner': this.plTree.dragState.dropInnerKey === this.treeNode.key
                    },
                ]
            },
            /**
             * content节点style
             * @author  韦胜健
             * @date    2020/3/31 9:32
             */
            contentStyles() {
                return {
                    paddingLeft: `${this.contentPaddingLeft}px`
                }
            },
            contentPaddingLeft() {
                let paddingLeft = this.plTree.intent * this.level + 6
                paddingLeft += 18
                if (this.plTree.showCheckbox) {
                    paddingLeft += 24
                }
                return paddingLeft
            },
            /**
             * expander节点style
             * @author  韦胜健
             * @date    2020/4/2 11:46
             */
            expanderStyles() {
                let paddingLeft = this.plTree.intent * this.level + 6
                return {
                    paddingLeft: `${paddingLeft}px`
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
        },
    }
</script>

<style lang="scss">
</style>