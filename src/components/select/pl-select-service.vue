<template>
    <div class="pl-select-service">
        <div class="pl-select-service-item"
             v-for="(item,index) in option.data"
             ref="items"
             :key="index"
             :class="{'pl-select-service-item-inner-hover':index === hoverIndex}"
             @click="pl_click(item)">
            <div class="pl-select-service-item-inner">
                <pl-render-func v-if="!!option.render" :render-func="option.render" :data="{item,index}"/>
                <pl-scope-slot v-else-if="!!option.slot" :scope-slot-func="option.slot" :data="{item,index}"/>
                <span v-else>{{!!option.labelKey?item[option.labelKey]:item}}</span>
            </div>
        </div>
    </div>
</template>

<script>
    import PlInput from "../pl-input";
    import PlRenderFunc from "../render/pl-render-func";
    import PlScopeSlot from "../render/pl-scope-slot";

    const defaultOption = {
        data: [],
        labelKey: null,
        valueKey: null,
        searchInput: false,
        autoFocus: true,
        render: null,
        slot: null,
    }

    export default {
        name: "pl-select-service",
        components: {PlScopeSlot, PlRenderFunc, PlInput},
        data() {
            return {
                popper: null,
                isOpen: false,
                hoverIndex: 0,

                option: {},
                rs: null,
                searchText: null,
                activeElement: null,

                keyboardListener: {
                    'enter': () => {
                        this.confirm()
                    },
                    'space': () => {
                        this.confirm()
                    },
                    'esc': () => {
                        !!this.popper && this.popper.hide()
                    },
                    'up': () => {
                        this.prev()
                    },
                    'down': () => {
                        this.next()
                    }
                }
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
                            if (this.option.autoFocus) {
                                this.$plain.$keyboard.addListener(this.keyboardListener)
                                this.activeElement = document.activeElement
                                !!this.activeElement && this.activeElement.blur()
                            }
                        },
                        onClose: () => {
                            this.isOpen = false
                            !!option.onClose && option.onClose()
                            if (this.option.autoFocus) {
                                this.$plain.$keyboard.removeListener(this.keyboardListener)
                                !!this.activeElement && this.activeElement.focus()
                            }
                        },
                    })
                    this.popper.show()
                    this.rs = rs
                })
            },
            hide() {
                this.popper.hide()
            },
            confirm(autoClose = true) {
                this.pl_click(this.option.data[this.hoverIndex], autoClose)
            },
            next() {
                if (this.hoverIndex < (this.option.data.length - 1)) {
                    this.hoverIndex++
                    const item = this.$refs.items[this.hoverIndex]
                    const wrapper = this.popper.$refs.scroll.$refs.wrapper
                    const scrollTop = item.offsetTop + item.offsetHeight - wrapper.offsetHeight
                    if (scrollTop > 0 && scrollTop > wrapper.scrollTop) {
                        this.popper.$refs.scroll.scrollTop(scrollTop, 25)
                    }
                } else {
                    this.hoverIndex = 0
                    this.popper.$refs.scroll.scrollTop(0, 25)
                }
            },
            prev() {
                if (this.hoverIndex > 0) {
                    this.hoverIndex--
                    const item = this.$refs.items[this.hoverIndex]
                    const wrapper = this.popper.$refs.scroll.$refs.wrapper
                    if (wrapper.scrollTop > item.offsetTop) {
                        this.popper.$refs.scroll.scrollTop(item.offsetTop, 25)
                    }
                } else {
                    this.hoverIndex = this.option.data.length - 1
                    this.popper.$refs.scroll.scrollTop(this.$refs.items[this.$refs.items.length - 1].offsetTop, 25)
                }
            },
            pl_click(item, autoClose = true) {
                if (!item) return
                !!this.rs && this.rs(item)
                !!autoClose && this.popper.hide()
            },
        },
        beforeDestroy() {
            this.$plain.$keyboard.removeListener(this.keyboardListener)
        },
    }
</script>

<style lang="scss">

</style>