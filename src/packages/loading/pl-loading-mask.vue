<template>
    <transition name="pl-transition-loading-mask">
        <div class="pl-loading-mask" v-if="value || p_value" :style="{background:background,zIndex}" :class="{'pl-loading-mask-unlock':unlock}">
            <pl-loading :type="loadingType"/>
            <span v-if="!!message">
            {{message}}
        </span>
        </div>
    </transition>
</template>

<script>

    export default {
        name: "pl-loading-mask",
        props: {
            value: {type: Boolean},                                         // 是否打开loading遮罩
            message: {type: String},                                        // 提示信息
            loadingType: {type: String, default: 'delta'},                  // loading类型
            background: {type: String, default: 'rgba(255,255,255,0.85)'},   // 遮罩背景色
            unlock: {type: Boolean},                                        // 取消阻止点击事件
        },
        watch: {
            value(val) {
                if (!!val) {
                    this.zIndex = this.$plain.nextIndex()
                }
            },
        },
        data() {
            return {
                p_value: false,
                zIndex: null,
            }
        },
        methods: {},
        mounted() {
            const parentNode = this.$el.parentNode
            if (!!parentNode) {
                const position = parentNode.style.position
                if (['absolute', 'relative', 'fixed'].indexOf(position) === -1) {
                    parentNode.style.position = 'relative'
                }
            }
        }
    }
</script>

<style lang="scss">
    @include theme {

        .pl-loading {
            @include statusMixin(loading) {
                color: $value;
            }
        }

        .pl-loading-mask {
            color: $colorPrimary;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(255, 255, 255, 0.5);
            transition: all linear 300ms;
            transform-origin: center center;
            cursor: progress;
            pointer-events: auto;

            .pl-loading {
                margin-bottom: 20px;
                font-size: 32px;

                & + span {
                    font-size: 14px;
                }
            }

            &.pl-loading-mask-unlock {
                pointer-events: none;
            }
        }
    }

    .pl-transition-loading-mask-enter-active, .pl-transition-loading-mask-leave-active {
        opacity: 1;
    }

    .pl-transition-loading-mask-enter, .pl-transition-loading-mask-leave-to {
        opacity: 0;
    }
</style>