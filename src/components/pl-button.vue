<template>
    <button class="pl-button" :class="classes">
        <slot>
            {{label}}
        </slot>
        <pl-loading v-if="loading"/>
    </button>
</template>

<script>
    import PlLoading from "./pl-loading";

    export default {
        name: "pl-button",
        components: {PlLoading},
        props: {
            type: {type: String, default: 'fill'},
            color: {type: String, default: 'primary'},
            shape: {type: String, default: 'fillet'},
            size: {type: String, default: 'default'},
            label: {type: String},

            loading: {type: Boolean},                                       //loading 图标
            long: {type: Boolean,},                                         //长按钮
            noPadding: {type: Boolean, default: true},                      //左右边距

        },
        computed: {
            classes() {
                return [
                    `pl-type-${this.type}`,
                    `pl-color-${this.color}`,
                    `pl-shape-${this.shape}`,
                    `pl-size-${this.size}`,

                    {
                        'pl-button-long': this.long,
                        'pl-button-no-padding': this.noPadding,
                    },
                ]
            }
        },
    }
</script>

<style lang="scss">

</style>