<template>
    <button class="pl-button" :class="classes">
        <slot>
            {{label}}
        </slot>
    </button>
</template>

<script>
    export default {
        name: "pl-button",
        props: {
            type: {type: String, default: 'fill'},
            color: {type: String, default: 'primary'},
            shape: {type: String, default: 'fillet'},
            size: {type: String, default: 'default'},
            label: {type: String},

            loading: {type: Boolean},                                       //loading 图标
            loadingType: {type: String, default: 'default'},                //loading默认类型
            loadingColor: {type: String, default: 'white'},                 //loading默认颜色
            long: {type: Boolean,},                                         //长按钮
            padding: {type: Boolean, default: true},                        //左右边距

        },
        computed: {
            classes() {
                return [
                    `pl-type-${this.type}`,
                    `pl-color-${this.color}`,
                    `pl-shape-${this.shape}`,
                    `pl-size-${this.size}`,
                ]
            }
        },
    }
</script>

<style lang="scss">

</style>