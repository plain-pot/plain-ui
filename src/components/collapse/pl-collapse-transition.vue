<template>
    <transition
            v-on:before-enter="beforeEnter"
            v-on:enter="enter"
            v-on:after-enter="afterEnter"

            v-on:before-leave="beforeLeave"
            v-on:leave="leave"
            v-on:after-leave="afterLeave"
    >
        <slot></slot>
    </transition>
</template>

<script>
    export default {
        name: "pl-collapse-transition",
        methods: {
            beforeEnter(el) {
                this.$plain.utils.addClass(el, 'pl-collapse-transition');
                if (!el.dataset) el.dataset = {};

                el.dataset.oldPaddingTop = el.style.paddingTop;
                el.dataset.oldPaddingBottom = el.style.paddingBottom;

                el.style.height = '0';
                el.style.paddingTop = 0;
                el.style.paddingBottom = 0;
            },
            enter(el) {
                el.dataset.oldOverflow = el.style.overflow;
                if (el.scrollHeight !== 0) {
                    el.style.height = el.scrollHeight + 'px';
                    el.style.paddingTop = el.dataset.oldPaddingTop;
                    el.style.paddingBottom = el.dataset.oldPaddingBottom;
                } else {
                    el.style.height = '';
                    el.style.paddingTop = el.dataset.oldPaddingTop;
                    el.style.paddingBottom = el.dataset.oldPaddingBottom;
                }

                el.style.overflow = 'hidden';
            },
            afterEnter(el) {
                this.$plain.utils.removeClass(el, 'pl-collapse-transition');
                el.style.height = '';
                el.style.overflow = el.dataset.oldOverflow;
            },
            beforeLeave(el) {
                if (!el.dataset) el.dataset = {};
                el.dataset.oldPaddingTop = el.style.paddingTop;
                el.dataset.oldPaddingBottom = el.style.paddingBottom;
                el.dataset.oldOverflow = el.style.overflow;

                el.style.height = el.scrollHeight + 'px';
                el.style.overflow = 'hidden';
            },
            leave(el) {
                if (el.scrollHeight !== 0) {
                    this.$plain.utils.addClass(el, 'pl-collapse-transition');
                    el.style.height = 0;
                    el.style.paddingTop = 0;
                    el.style.paddingBottom = 0;
                }
            },
            afterLeave(el) {
                this.$plain.utils.removeClass(el, 'pl-collapse-transition');
                el.style.height = '';
                el.style.overflow = el.dataset.oldOverflow;
                el.style.paddingTop = el.dataset.oldPaddingTop;
                el.style.paddingBottom = el.dataset.oldPaddingBottom;
                this.$emit('afterLeave')
            }
        }
    }
</script>