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
    import PlInput from "../pl-input";

    const defaultOption = {
        data: [],
        labelKey: null,
        valueKey: null,
        searchInput: false,
    }

    export default {
        name: "pl-select-service",
        components: {PlInput},
        data() {
            return {
                popper: null,
                isOpen: false,
                hoverIndex: 0,

                option: {},
                rs: null,
                searchText: null,
            }
        },
        methods: {
            async select(option) {
                return new Promise(async rs => {
                    this.hoverIndex = 0
                    this.option = Object.assign({}, defaultOption, option)
                    // console.log(option)
                    this.popper = await this.$plain.$popper.getPopper({
                        ...option,
                        popper: this.$el,
                        onOpen: () => {
                            this.isOpen = true
                            !!option.onOpen && option.onOpen()
                        },
                        onClose: () => {
                            this.isOpen = false
                            !!option.onClose && option.onClose()
                        },
                    })
                    this.popper.show()
                    this.rs = rs
                })
            },
            hide() {
                this.popper.hide()
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