<template>
    <span class="pl-dom">
        <span class="pl-dom-content" ref="content" :class="contentClass" :style="contentStyle" @click="emitClickContent">
            <slot></slot>
        </span>
    </span>
</template>

<script>
    import {EmitMixin} from "../../utils/mixins";

    export default {
        name: "pl-dom",
        mixins: [
            EmitMixin,
        ],
        emitters: {
            emitClickContent: Function
        },
        props: {
            value: {type: Boolean, default: true},                          // 是否将组件移动到body下
            container: {},                                                  // 移动所在的父节点
            autoCreateContainer: {type: Boolean},                           // 通过 querySelector 查询 container 不存在时。是否自动 创建 container
            contentClass: {},                                               // content节点的class
            contentStyle: {},                                               // content节点的style
        },

        data() {
            return {
                contentEl: null,                                            // content节点

                parentNode: null,                                           // pl-dom 在 mounted 的时候的父节点
                containerNode: null,                                        // 移动内容所挂载的父节点
                commentNode: document.createComment('pl-dom'),        // 注释节点，用来在 parentNode 中替代 childNode
                isMoved: false,                                             // 标志位，判断当前是否已经移动到containerNode下
            }
        },
        watch: {
            value: {
                immediate: true,
                async handler(val) {
                    await this.$plain.nextTick()
                    this.update(!!val)
                },
            },
            async container() {
                this.update(false)
                this.update(true)
            },
        },
        computed: {
            targetContainer() {
                if (!this.container || this.container === 'document.body' || this.container === 'body') return document.body
                if (this.container instanceof window.Node) return this.container
                if (typeof this.container === "string") {
                    const node = document.querySelector(this.container)
                    if (!node) {
                        if (!!this.autoCreateContainer) {
                            const container = document.createElement('div')
                            this.$plain.utils.addClass(container, this.container.replace('.', ''))
                            document.body.appendChild(container)
                            return container
                        } else {
                            console.error(`can'y find node:${this.container}`)
                            return document.body
                        }
                    } else {
                        return node
                    }
                }
            },
        },
        methods: {
            update(val) {
                if (val) {
                    if (!this.isMoved) {
                        // 当前没有移动
                        this.contentEl = this.$refs.content
                        this.containerNode = this.targetContainer

                        this.$el.replaceChild(this.commentNode, this.contentEl)
                        this.containerNode.appendChild(this.contentEl)

                        this.isMoved = true
                    } else {
                        // 当前已经移动过 do nothing
                    }
                } else {
                    if (!!this.isMoved) {
                        this.containerNode.removeChild(this.contentEl)
                        this.$el.replaceChild(this.contentEl, this.commentNode)

                        this.contentEl = null
                        this.containerNode = null

                        this.isMoved = false
                    }
                }
            },
        },
        beforeDestroy() {
            this.update(false)
        }
    }
</script>

<style lang="scss">
</style>