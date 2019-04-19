<template>
    <button class="pl-button" :class="classes" :disabled="loading" @click="pl_click">
        <pl-loading v-if="p_loading && !circle"/>
        <slot>
            <pl-icon v-if="!!icon" :icon="icon"/>
            <span v-if="!!label">{{label}}</span>
        </slot>
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
            noPadding: {type: Boolean},                                     //左右边距

            duration: {type: Number, default: 500},                         //防止快速点击时间间隔
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
        data() {
            return {
                p_loading: this.loading,
            }
        },
        methods: {
            async pl_click(e) {
                if (!!this.p_loading) return
                this.p_loading = true
                let timerWait, timerClick

                timerWait = setTimeout(() => {
                    timerWait = null
                    if (!timerClick) this.p_loading = false
                }, this.duration)

                timerClick = setTimeout(async () => {
                    if (!!this.$listeners.click) {
                        await this.$listeners.click(e)
                    } else {
                        this.$emit('click', e)
                    }
                    timerClick = null
                    if (!timerWait) this.p_loading = false
                }, 0)
            },
        }
    }
</script>