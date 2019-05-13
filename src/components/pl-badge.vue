<template>
    <div class="pl-badge">
        <slot></slot>
        <div class="pl-badge-content" :class="contentStyles">
            <slot name="badge">
                <span v-if="data!=null">{{showValue}}</span>
            </slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: "pl-badge",
        props: {
            data: {},                                       //显示的数据
            bottom: {type: Boolean},                        //标记纵向是否在底部
            start: {type: Boolean},                         //标记横向是否在右边
            color: {type: String, default: 'error'},        //标记背景色
            dot: {type: Boolean,},                          //标记是否只是一个小圆点
            max: {type: Number,},                           //标记显示文本最大值
        },
        computed: {
            contentStyles() {
                return [
                    {
                        'pl-badge-content-dot': !!this.dot,
                    },
                    `pl-badge-content-${!!this.bottom ? 'bottom' : 'top'}`,
                    `pl-badge-content-${!!this.start ? 'start' : 'end'}`,
                    `pl-badge-content-color-${this.color}`,
                ]
            },
            showValue() {
                if (this.data == null) return null
                if (this.max != null && (this.data - 0) > this.max) return this.max + '+'
                return this.data
            },
        },
    }
</script>