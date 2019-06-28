<template>
    <pl-dom :value="transferDom">
        <transition :name="transition">
            <div class="pl-dialog"
                 :class="classes"
                 v-show="p_value"
                 :style="styles"
                 @click="p_clickShadow"
                 @mouseenter="pl_mouseenter"
                 @mouseleave="pl_mouseleave">
                <div class="pl-dialog-content"
                     ref="content"
                     v-if="p_initialized"
                     @click="p_clickContent"
                     :style="contentStyles">
                    <div class="pl-dialog-head" v-if="!noHeader">
                        <div class="pl-dialog-title">
                            <pl-icon :icon="TYPE[type]" v-if="!!type" class="pl-dialog-type-icon"/>
                            <span>{{title}}</span>
                        </div>
                        <div class="pl-dialog-head-operator">
                            <!--<pl-icon icon="pl-minimize"/>-->
                            <pl-icon icon="pad-plus" v-show="!p_isFull && !!max" @click="p_isFull=true"/>
                            <pl-icon icon="pad-minus" v-show="!!p_isFull && !!max" @click="p_isFull=false"/>
                            <pl-icon icon="pad-close" @click="hide" class="pl-dialog-close-icon" v-if="!noClose" hover/>
                        </div>
                    </div>
                    <div class="pl-dialog-body" :style="bodyStyles">
                        <slot></slot>
                    </div>
                    <div class="pl-dialog-foot" :class="[`pl-dialog-foot-align-${footAlign}`]" v-if="!noFooter && (cancelButton || confirmButton || !!$slots.foot)">
                        <slot name="foot">
                            <pl-button type="line" label="取消" @click="p_cancel" v-if="!!cancelButton"/>
                            <pl-button label="确认" @click="p_confirm" v-if="!!confirmButton"/>
                        </slot>
                    </div>
                </div>
            </div>
        </transition>
    </pl-dom>
</template>

<script>
    import {ValueMixin} from "../../mixin/component-mixin";
    import keyboard from 'src/scripts/keyboard'
    import PlIcon from "../pl-icon";
    import PlButton from "../pl-button";
    import PlDom from "../pl-dom";

    export default {
        name: "pl-dialog",
        components: {PlDom, PlButton, PlIcon},
        mixins: [ValueMixin],
        props: {
            type: {type: String, default: 'info'},                                              //标题类型 info|success|warn|error|help
            title: {type: String, default: '提示'},                                             //标题
            shape: {type: String, default: 'fillet'},                                             //形状 none|fillet
            shadowColor: {type: String, default: 'rgba(0,0,0,0.25)'},                           //遮罩层演策
            disabledHideOnClickShadow: {type: Boolean,},                                        //是否禁用点击遮罩关闭窗口功能
            transition: {type: String, default: 'pl-dialog-animate-drop'},                      //对话框显隐动画
            height: {type: String | Number,},                                                   //对话框内容高度
            minHeight: {type: String | Number},                                                 //对话框内容最小高度
            maxHeight: {type: String | Number},                                                 //对话框内容最大高度
            width: {type: String | Number,},                                                    //对话框内容宽度
            minWidth: {type: String | Number},                                                  //对话框内容最小宽度
            maxWidth: {type: String | Number},                                                  //对话框内容最大宽度
            full: {type: Boolean},                                                              //对话框是否沾满全屏
            confirmButton: {type: Boolean},                                                     //是否带确认按钮
            cancelButton: {type: Boolean},                                                      //是否带取消按钮
            noClose: {type: Boolean},                                                           //是否隐藏关闭按钮
            dialogClass: {type: String,},                                                       //由于对话框有可能被移动到body节点下，这里设置对话框class，以便控制样式
            vertical: {type: String},                                                           //对话框纵向位置 start|center|end
            horizontal: {type: String},                                                         //对话框横向位置 start|center|end
            initialized: {type: Boolean,},                                                      //对话框是否初始化的时候就初始化内容，默认为否
            destroyOnHide: {type: Boolean},                                                     //对话框是否在关闭的时候销毁内容
            transferDom: {type: Boolean},                                                       //对话框是否移动到body节点下
            max: {type: Boolean},                                                               //是否可最大化
            noHeader: {type: Boolean},                                                          //不带顶部栏
            noFooter: {type: Boolean},                                                          //不带底部栏
            noPadding: {type: Boolean},                                                         //对话框内容去掉默认内边距
            // min: {type: Boolean},
            // remove: {type: Boolean},
            top: {type: Number | String,},                                                      //对话框偏移顶部位置
            bottom: {type: Number | String},                                                    //对话框偏移底部位置
            left: {type: Number | String},                                                      //对话框偏移左边界位置
            right: {type: Number | String},                                                     //对话框偏移右边界位置
            footAlign: {type: String, default: 'center'},                                       //对话框底部对其方式left|center|right

            enterToConfirm: {type: Boolean, default: true},                                     //是否回车触发confirm事件
            spaceToConfirm: {type: Boolean, default: true},                                     //是否空格触发confirm事件
            escToCancel: {type: Boolean, default: true},                                        //是否Esc触发cancel事件

            disabledHideOnConfirm: {type: Boolean},                                             //禁用触发确认事件之后的关闭弹框动作
            disabledHideOnCancel: {type: Boolean},                                              //禁用触发取消事件之后的关闭弹框动作
        },
        data() {
            return {
                TYPE: Object.keys(this.$plain.TYPE).reduce((ret, key) => {
                    ret[key] = this.$plain.TYPE[key].icon
                    return ret
                }, {}),
                p_index: 0,
                p_watchValue: false,
                p_isFull: this.full,
                p_initialized: this.initialized || this.value,
                p_activeElement: null,

                keyboardListener: {
                    'enter': () => {
                        !!this.enterToConfirm && this.p_confirm()
                    },
                    'space': () => {
                        !!this.spaceToConfirm && this.p_confirm()
                    },
                    'esc': () => {
                        !!this.escToCancel && this.p_cancel()
                    },
                }
            }
        },
        watch: {
            value(val) {
                if (val !== this.p_value) val ? this.show() : this.hide()
            },
            max() {
                this.p_isFull = null
            },
        },
        computed: {
            classes() {
                return [
                    {
                        'pl-dialog-full-size': this.full || this.p_isFull,
                        'pl-dialog-padding': !this.noPadding,
                    },
                    `pl-dialog-type-${this.type}`,
                    `pl-dialog-shape-${this.shape}`,
                    `pl-dialog-vertical-${this.vertical || 'start'}`,
                    `pl-dialog-horizontal-${this.horizontal || 'center'}`,
                    this.dialogClass,
                ]
            },
            styles() {
                return {
                    backgroundColor: this.shadowColor,
                    zIndex: this.p_index,
                }
            },
            bodyStyles() {
                const styles = {};
                ['width', 'height', 'minWidth', 'minHeight', 'maxWidth', 'maxHeight'].forEach(prop => !!this[prop] && (styles[prop] = this.$plain.$utils.unit(this[prop])))
                if (!this.width && !this.minWidth && !this.maxWidth) {
                    styles.minWidth = '336px'
                    styles.maxWidth = '500px'
                }
                if (!this.height && !this.minHeight) styles.minHeight = '88px'
                return styles
            },
            contentStyles() {
                const styles = {}
                styles.top = `${this.top != null ? this.top : !this.vertical && !this.horizontal ? '10vh' : 0}`
                this.left != null && (styles.left = this.$plain.$utils.unit(this.left))
                this.bottom != null && (styles.bottom = this.$plain.$utils.unit(this.bottom))
                this.right != null && (styles.right = this.$plain.$utils.unit(this.right))
                return styles
            },
        },
        methods: {
            show() {
                const next = () => {
                    this.p_index = this.$plain.getZIndex()
                    this.p_value = true
                    this.$emit('input', this.p_value)
                }
                if (!this.p_initialized) {
                    this.p_initialized = true
                    this.$nextTick(() => next())
                } else next()

                this.p_activeElement = document.activeElement
                !!this.p_activeElement && this.p_activeElement.blur && this.p_activeElement.blur()
            },
            hide() {
                this.p_value = false
                !!this.destroyOnHide && setTimeout(() => this.p_initialized = false, this.$plain.transitionTime)
                !!this.p_activeElement && this.p_activeElement.focus && this.p_activeElement.focus()
                this.$emit('input', this.p_value)
            },
            p_clickShadow(e) {
                if (!this.$refs.content.contains(e.target)) {
                    this.$emit('clickShadow', e)
                    if (!this.disabledHideOnClickShadow) {
                        this.p_cancel()
                    }
                }
            },
            p_clickContent(e) {
                this.$emit('clickContent', e)
            },
            p_confirm() {
                this.$emit('confirm')
                !this.disabledHideOnConfirm && this.hide()
            },
            p_cancel() {
                this.$emit('cancel')
                !this.disabledHideOnCancel && this.hide()
            },
            pl_mouseenter() {
                keyboard.addListener(this.keyboardListener)
            },
            pl_mouseleave() {
                keyboard.removeListener(this.keyboardListener)
            },
        },
        beforeDestroy() {
            keyboard.removeListener(this.keyboardListener)
        },
    }
</script>

<style lang="scss">

</style>