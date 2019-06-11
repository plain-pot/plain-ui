<template>
    <div class="pl-step-container" :class="classes">
        <slot></slot>
    </div>
</template>

<script>
    import {ThrottleMixin} from "../../mixin/component-mixin";

    export default {
        name: "pl-step-container",
        mixins: [ThrottleMixin],
        props: {
            vertical: {type: Boolean},
            value: {},
            mini: {type: Boolean},
            reverse: {type: Boolean},
        },
        data() {
            return {
                items: [],
            }
        },
        computed: {
            classes() {
                return [
                    `pl-step-container-${this.vertical ? 'vertical' : 'horizontal'}`,
                    `pl-step-size-${this.mini ? 'mini' : 'default'}`,
                    {
                        'pl-step-container-reverse': this.reverse,
                    },
                ]
            },
        },
        methods: {
            pl_add(item) {
                this.items.push(item)
                this.pl_throttle(item, this.pl_updateItemIndex)
            },
            pl_remove(item) {
                this.items.splice(this.items.indexOf(item), 1)
            },
            async pl_updateItemIndex() {
                await this.$plain.nextTick()
                let itemEls = [];
                for (let item of  this.$el.querySelectorAll('.pl-step')) itemEls.push(item)
                this.items.forEach(item => item.p_index = itemEls.indexOf(item.$el))
            },
        },
    }
</script>

<style lang="scss">


</style>