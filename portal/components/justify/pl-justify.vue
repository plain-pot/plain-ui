<template>
    <div class="pl-justify">
        <div class="pl-justify-item" v-for="(item,index) in data"
             :key="index"
             ref="items"
             :name="!!labelKey?item[labelKey]:item"
             :class="{'pl-justify-item-active':value === (!!valueKey?item[valueKey]:item)}"
             @click="pl_click(item)">
            {{!!labelKey?item[labelKey]:item}}
        </div>
    </div>
</template>

<script>
    export default {
        name: "pl-justify",
        props: {
            data: {},
            labelKey: {},
            valueKey: {},
            value: {},
            maxSpace: {type: Number, default: 24},
            minSpace: {type: Number, default: 12},
        },
        data() {
            return {
                dialog: null
            }
        },
        created() {
            this.dialog = this.$plain.$dom.findComponentUpward(this, 'pl-dialog')
            !!this.dialog && this.dialog.$on('input', this.pl_dialogOpen)
        },
        beforeDestroy() {
            !!this.dialog && this.dialog.$off('input', this.pl_dialogOpen)
        },
        methods: {
            async refresh() {
                await this.$plain.nextTick()
                await this.$plain.$utils.delay(0)
                if (!this.$refs.items) return
                const contentWidth = this.$el.offsetWidth
                const itemData = []
                for (let i = 0; i < this.$refs.items.length; i++) {
                    const itemEl = this.$refs.items[i];
                    let width;
                    if (!!itemEl.dataset.width) {
                        width = itemEl.dataset.width - 0
                    } else {
                        width = Math.ceil(itemEl.offsetWidth + 1)
                        itemEl.dataset.width = width
                        itemEl.style.width = width + 'px'
                    }
                    itemData.push({
                        width: width,
                        el: itemEl,
                    })
                }
                let lineData = []
                let lineWidth = 0

                while (itemData.length > 0) {
                    const itd = itemData.shift()
                    let nowWidth = lineWidth + itd.width
                    if ((nowWidth > contentWidth) || ((contentWidth - nowWidth) / (lineData.length) < this.minSpace)) {
                        itemData.unshift(itd)
                        let len = lineData.length
                        let space = Math.floor((contentWidth - lineWidth) / (len - 1))
                        lineData.forEach((it, i) => {
                            i !== len - 1 && (it.el.style.marginRight = `${space}px`)
                        })
                        lineData = []
                        lineWidth = 0
                    } else {
                        lineData.push(itd)
                        lineWidth += itd.width
                    }
                }
            },
            async pl_dialogOpen(val) {
                if (!!val) {
                    this.refresh()
                }
            },
            async pl_click(item) {
                this.$emit('click', item)
            },
        }
    }
</script>

<style lang="scss">
    @include themeWrap {
        .pl-justify {
            .pl-justify-item {
                display: inline-block;
                padding: 4px 9px;
                box-sizing: border-box;
                margin-bottom: 1px;
                cursor: pointer;

                &:hover {
                    background-color: plVar(colorPrimaryLighter);
                }

                &.pl-justify-item-active {
                    background-color: plVar(colorPrimary);
                    color: white;
                }
            }
        }
    }
</style>
