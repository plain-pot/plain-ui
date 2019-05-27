<template>
    <pl-popover ref="popover" @show="pl_open" @close="pl_close" v-bind="popoverBinding" :reference="option.reference" class="pl-select-service">
        <div class="pl-select-service">
            <pl-render-func v-if="option.content" :render-func="option.content"/>
            <div v-else
                 class="pl-select-service-item"
                 v-for="(item,index) in option.data"
                 ref="items"
                 :key="index"
                 :class="{'pl-select-service-item-inner-hover':index === hoverIndex}"
                 @click="pl_click(item)">
                <pl-render-func v-if="!!option.render" :render-func="option.render" :data="{item,index}" class="pl-select-service-item-inner"/>
                <pl-scope-slot v-else-if="!!option.slot" :scope-slot-func="option.slot" :data="{item,index}" class="pl-select-service-item-inner"/>
                <div class="pl-select-service-item-inner" v-else>
                    <div class="pl-select-service-item-inner-content">
                        <pl-icon :icon="item[option.iconKey]" v-if="!!option.iconKey"/>
                        <span>{{!!option.labelKey?item[option.labelKey]:item}}</span>
                    </div>
                </div>
            </div>
        </div>
    </pl-popover>
</template>

<script>
    import PlInput from "../pl-input";
    import PlRenderFunc from "../render/pl-render-func";
    import PlScopeSlot from "../render/pl-scope-slot";
    import PlPopover from "../popper/pl-popover";
    import PlIcon from "../pl-icon";

    const defaultOption = {
        reference: null,
        data: [],
        popover: null,
        labelKey: null,
        valueKey: null,
        autoFocus: true,
        render: null,
        slot: null,
        autoClose: true,
        onConfirm: null,
        onClose: null,
        iconKey: null,
    }

    export default {
        name: "pl-select-service",
        components: {PlIcon, PlPopover, PlScopeSlot, PlRenderFunc, PlInput},
        data() {
            return {
                popover: null,
                p_show: false,
                hoverIndex: 0,

                option: {...defaultOption},
                watchData: null,
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
                        !!this.popover && this.popover.hide()
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
        computed: {
            popoverBinding() {
                return {
                    popper: this.option.popper,
                    popover: this.option.popover,
                }
            },
        },
        watch: {
            watchData: {
                deep: true,
                async handler(val) {
                    // console.log('watchData change', val)
                    if (!!this.p_show) {
                        await this.$plain.nextTick()
                        this.$refs.popover.$refs.popper.p_popper.update()
                    }
                },
            },
        },
        mounted() {
            this.popover = this.$refs.popover
        },
        methods: {
            async select(option) {
                return new Promise(async rs => {
                    this.hoverIndex = 0
                    this.option = Object.assign({}, defaultOption, option)
                    this.watchData = option.watchData
                    await this.$plain.nextTick()
                    this.popover.show()
                    this.rs = rs
                })
            },
            hide() {
                this.popover.hide()
            },
            confirm() {
                this.pl_click(this.option.data[this.hoverIndex])
            },
            next() {
                if (this.hoverIndex < (this.option.data.length - 1)) {
                    this.hoverIndex++
                    const item = this.$refs.items[this.hoverIndex]
                    const wrapper = this.popover.$refs.scroll.$refs.wrapper
                    const scrollTop = item.offsetTop + item.offsetHeight - wrapper.offsetHeight
                    if (scrollTop > 0 && scrollTop > wrapper.scrollTop) {
                        this.popover.$refs.scroll.scrollTop(scrollTop, 25)
                    }
                } else {
                    this.hoverIndex = 0
                    this.popover.$refs.scroll.scrollTop(0, 25)
                }
            },
            prev() {
                if (this.hoverIndex > 0) {
                    this.hoverIndex--
                    const item = this.$refs.items[this.hoverIndex]
                    const wrapper = this.popover.$refs.scroll.$refs.wrapper
                    if (wrapper.scrollTop > item.offsetTop) {
                        this.popover.$refs.scroll.scrollTop(item.offsetTop, 25)
                    }
                } else {
                    this.hoverIndex = this.option.data.length - 1
                    this.popover.$refs.scroll.scrollTop(this.$refs.items[this.$refs.items.length - 1].offsetTop, 25)
                }
            },
            pl_click(item) {
                if (!item) return
                !!this.rs && this.rs(item)
                !!this.option.autoClose && this.popover.hide()
                !!this.option.onConfirm && this.option.onConfirm(item)
            },
            pl_open() {
                // console.log('pl_open')
                this.p_show = true
                !!this.option.onOpen && this.option.onOpen()
                if (this.option.autoFocus) {
                    this.$plain.$keyboard.addListener(this.keyboardListener)
                    this.activeElement = document.activeElement
                    !!this.activeElement && this.activeElement.blur()
                }
            },
            pl_close() {
                // console.log('pl_close')
                this.p_show = false
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