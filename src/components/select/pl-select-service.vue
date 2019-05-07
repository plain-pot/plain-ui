<template>
    <pl-popper ref="popper" @open="pl_open" @close="pl_close" v-bind="option.popper" :reference="option.reference" class="pl-select-service">
        <div class="pl-select-service">
            <div class="pl-select-service-item"
                 v-for="(item,index) in option.data"
                 ref="items"
                 :key="index"
                 :class="{'pl-select-service-item-inner-hover':index === hoverIndex}"
                 @click="pl_click(item)">
                <pl-render-func v-if="!!option.render" :render-func="option.render" :data="{item,index}" class="pl-select-service-item-inner"/>
                <pl-scope-slot v-else-if="!!option.slot" :scope-slot-func="option.slot" :data="{item,index}" class="pl-select-service-item-inner"/>
                <div class="pl-select-service-item-inner" v-else>
                    <div>{{!!option.labelKey?item[option.labelKey]:item}}</div>
                </div>
            </div>
        </div>
    </pl-popper>
</template>

<script>
    import PlInput from "../pl-input";
    import PlRenderFunc from "../render/pl-render-func";
    import PlScopeSlot from "../render/pl-scope-slot";
    import PlPopper from "../popper/pl-popper";

    const defaultOption = {
        reference: null,
        data: [],
        popper: null,
        labelKey: null,
        valueKey: null,
        autoFocus: true,
        render: null,
        slot: null,
    }

    export default {
        name: "pl-select-service",
        components: {PlPopper, PlScopeSlot, PlRenderFunc, PlInput},
        data() {
            return {
                popper: null,
                isOpen: false,
                hoverIndex: 0,

                option: {...defaultOption},

                rs: null,
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
        mounted() {
            this.popper = this.$refs.popper
        },
        methods: {
            async select(option) {
                return new Promise(async rs => {
                    this.hoverIndex = 0
                    this.option = Object.assign({}, defaultOption, option)
                    await this.$plain.nextTick()
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
            pl_open() {
                // console.log('pl_open')
                this.isOpen = true
                !!this.option.onOpen && this.option.onOpen()
                if (this.option.autoFocus) {
                    this.$plain.$keyboard.addListener(this.keyboardListener)
                    this.activeElement = document.activeElement
                    !!this.activeElement && this.activeElement.blur()
                }
            },
            pl_close() {
                // console.log('pl_close')
                this.isOpen = false
                !!this.option.onClose && this.option.onClose()
                if (this.option.autoFocus) {
                    this.$plain.$keyboard.removeListener(this.keyboardListener)
                    !!this.activeElement && this.activeElement.focus()
                }
            },
        },
        beforeDestroy() {
            this.$plain.$keyboard.removeListener(this.keyboardListener)
        },
    }
</script>

<style lang="scss">

</style>