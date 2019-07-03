<template>
    <div class="pl-justify" v-if="p_initialized">
        <div class="pl-justify-item" v-for="(item,index) in data"
             :key="index"
             ref="items"
             :name="!!labelKey?item[labelKey]:item"
             :class="{'pl-justify-item-active':value === (!!valueKey?item[valueKey]:item)}"
             @click="pl_click(item)"
             @dblclick="pl_dblclick(item)">
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
            maxSpace: {type: Number, default: 12},
            minSpace: {type: Number, default: 6},
        },
        data() {
            return {
                dialog: null,
                p_initialized: false,
            }
        },
        watch: {
            data() {
                this.refresh()
            },
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
                this.p_initialized = false
                await this.$plain.nextTick()
                this.p_initialized = true
                await this.$plain.nextTick()
                await this.$plain.$utils.delay(0)
                if (!this.$refs.items) return
                const contentWidth = this.$el.offsetWidth
                if (contentWidth === 0) return
                const itemData = []
                for (let i = 0; i < this.$refs.items.length; i++) {
                    const itemEl = this.$refs.items[i];
                    let width = itemEl.offsetWidth + 1;
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
            async pl_dblclick(item) {
                this.$emit('dblclick', item)
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
                white-space: nowrap;

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
