<template>
    <div class="pl-scroll-option-item"
         @click.stop="!disabled && $emit('click')"
         :style="styles"
         :class="{
            'pl-scroll-option-item-disabled':disabled,
            'pl-scroll-option-item-active':currentIndex === index
         }">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: "pl-scroll-option-item",
        props: {
            labelKey: {type: String},
            valueKey: {type: String},
            disabledKey: {type: String},
            itemHeight: {type: Number, default: 24},
            itemNum: {type: Number, default: 3},

            index: {},
            currentIndex: {},
            itemData: {},
            scrollTop: {},
        },
        computed: {
            styles() {
                const styles = {
                    height: `${this.itemHeight}px`
                }
                if (this.index != null) {
                    const deg = ((Math.abs((this.scrollTop - (this.index * this.itemHeight))) / this.itemHeight).toFixed(1) - 0) * (100 / (this.itemNum * 2))
                    styles.transform = `rotateX(${deg}deg)`
                    styles.opacity = `${(80 - deg) / 100}`
                }
                return styles
            },
            disabled() {
                return (!!this.disabledKey && !!this.itemData[this.disabledKey])
            },
        },
    }
</script>