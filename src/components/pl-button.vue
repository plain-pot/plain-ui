<template>
    <button class="pl-button" :class="classes" :disabled="loading" @click="e=>$emit('click',e)">
        <slot>
            <pl-icon v-if="!!icon" :icon="icon"/>
            <span v-if="!!label">{{label}}</span>
        </slot>
        <pl-loading v-if="loading"/>
    </button>
</template>

<script>
    import PlLoading from "./pl-loading";
    import PlIcon from "./pl-icon";

    export default {
        name: "pl-button",
        components: {PlIcon, PlLoading},
        props: {
            type: {type: String, default: 'fill'},
            color: {type: String, default: 'primary'},
            shape: {type: String, default: 'fillet'},
            size: {type: String, default: 'default'},
            label: {type: String},
            icon: {type: String},
            active: {type: Boolean},

            circle: {type: Boolean},                                        //圆形按钮
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
                        'pl-button-active': this.active,
                        'pl-button-loading': this.loading,
                        'pl-button-circle': this.circle,
                        'pl-button-no-padding': this.noPadding,
                    },
                ]
            }
        },
    }
</script>

<style lang="scss">

</style>