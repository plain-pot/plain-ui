<template>
    <pl-popper class="pl-popover"
               v-bind="popperProps"
               :value="p_value"
               @input="onInput"

               :open="open"
               @update:open="emitUpdateOpen"

               @open="onOpen"
               @close="emitClose"

               @init="emitInit"
               @dstry="emitDstry"
               @show="emitShow"
               @hide="emitHide"
               @click-refernece="emitClickReference"
               @click-popper="emitClickPopper"
               @click-body="emitClickBody"
    >
        <slot v-if="!!$slots.default"/>
        <slot slot="popper" name="popper" v-if="width == null && height==null && !sizeEqual"/>
        <pl-scroll v-else slot="popper" ref="scroll" fitHostWidth v-bind="scrollProps">
            <slot name="popper"/>
        </pl-scroll>
    </pl-popper>
</template>

<script>
    import {EmitMixin} from "../../utils/mixins";
    import popper from '../popper/pl-popper.vue'

    export default {
        name: "pl-popover",
        mixins: [EmitMixin],
        props: {
            /*---------------------------------------popper props-------------------------------------------*/
            ...popper.props,

            sizeEqual: {default: true},
            trigger: {default: 'click'},
            transition: {default: 'pl-transition-popper-drop'},
            placement: {default: 'bottom-start'},
            offset: {default: 2},
            arrow: {default: false},
            height: {default: '156px'},

            /*---------------------------------------popover props-------------------------------------------*/
            scrollProps: {},
        },
        emitters: {
            emitInit: null,                                             // 初始化事件，reference el以及popper el已经确认，popper实例已经创建，完成popper el的定位工作
            emitDstry: null,                                            // 销毁事件，popper已经销毁
            emitShow: null,                                             // 打开事件，刚刚打开，动画未结束
            emitHide: null,                                             // 关闭事件，刚刚关闭，动画未结束

            emitClickReference: null,                                   // 点击reference事件
            emitClickPopper: null,                                      // 点击popper的内容的事件
            emitClickBody: null,                                        // 点击除了reference 以及popper派发的事件

            emitOpen: null,                                             // 派发打开事件，打开完毕，打开动画执行完毕
            emitClose: null,                                            // 派发关闭事件，关闭完毕，关闭动画执行完毕
            emitUpdateOpen: null,                                       // open属性更新
        },
        computed: {
            popperProps() {
                const result = Object.keys(popper.props).reduce((ret, key) => {
                    switch (key) {
                        case 'popperClass':
                            ret[key] = !!this[key] ? ['pl-popover-popper', this[key]].join(' ') : 'pl-popover-popper'
                            break
                        default:
                            ret[key] = this[key]
                            break
                    }

                    return ret
                }, {})
                console.log('popperProps', result)
                return result
            },
        },
        data() {
            return {
                p_value: this.value,
            }
        },
        watch: {
            value(val) {
                this.p_value = val
                if (!!this.p_value && !!this.$refs.scroll) {
                    this.$nextTick(() => this.$refs.scroll.scroll({y: 0}))
                }
            },
        },
        methods: {
            onInput(val) {
                this.p_value = val
                this.$emit('input', this.p_value)
                if (!!this.p_value && !!this.$refs.scroll) {
                    this.$nextTick(() => this.$refs.scroll.scroll({y: 0}))
                }
            },
            onOpen() {
                if (!!this.$refs.scroll) {
                    this.$refs.scroll.refresh()
                }
                this.emitOpen()
            },
        },
    }
</script>

<style lang="scss">
</style>