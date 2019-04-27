<template>
    <div class="pl-select-service">
        <div class="pl-select-service-item"
             v-for="(item,index) in option.data"
             :key="index"
             :class="{'pl-select-service-item-inner-hover':index === hoverIndex}"
             @mouseenter="hoverIndex = index"
             @click="pl_click(item)">
            <div class="pl-select-service-item-inner">
                <span>{{!!option.labelKey?item[option.labelKey]:item}}</span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "pl-select-service",
        data() {
            return {
                popper: null,
                p_show: false,
                hoverIndex: 0,

                option: {},
                rs: null,
            }
        },
        methods: {
            async select(option) {
                return new Promise(async rs => {
                    this.option = Object.assign({
                        data: [],
                        labelKey: null,
                        valueKey: null
                    }, option)
                    // console.log(option)
                    this.popper = await this.$plain.$popper.getPopper({
                        ...option,
                        popper: this.$el,
                    })
                    this.popper.show()
                    this.rs = rs
                })
            },
            pl_click(item) {
                !!this.rs && this.rs(item)
                this.popper.hide()
            },
        },
    }
</script>

<style lang="scss">

</style>