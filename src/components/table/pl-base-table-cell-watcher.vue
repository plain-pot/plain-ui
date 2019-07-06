<template>
    <div class="pl-base-table-cell-watcher" :class="{'pl-base-table-cell-watcher-link':link}" @click="pl_click">
        <pl-scope-slot v-if="!!scopeSlotFunc" :scope-slot-func="scopeSlotFunc" :data="p_data"/>
        <pl-render-func v-else-if="renderFunc" :render-func="renderFunc" :data="p_data"/>
        <span v-else>{{p_text}}</span>
    </div>
</template>

<script>
    import PlScopeSlot from "../render/pl-scope-slot";
    import PlRenderFunc from "../render/pl-render-func";

    import Tippy from 'tippy.js';

    export default {
        name: "pl-base-table-cell-watcher",
        components: {PlRenderFunc, PlScopeSlot},
        props: {
            scopeSlotFunc: {},
            renderFunc: {},
            data: {},
            text: {},
            required: {},

            noUseFormatter: {type: Boolean},
            tooltip: {type: Boolean},
            showInDialog: {type: Boolean},
            link: {type: Boolean},
            click: {type: Function},

        },
        watch: {
            text: {
                immediate: true,
                async handler(val) {
                    if (!!this.data.col.formatter && !this.noUseFormatter) {
                        this.p_text = null
                        this.p_text = await this.data.col.formatter({value: val, rowData: this.data})
                    } else {
                        this.p_text = val
                    }
                    !!this.p_tippy && this.p_tippy.set({content: this.p_text})
                },
            },
            tooltip: {
                immediate: true,
                async handler(val) {
                    await this.$plain.nextTick()
                    !!val ? this.pl_initTooltip() : this.pl_destroyTooltip()
                },
            }
        },
        data() {
            return {
                p_text: this.text,
                p_tippy: null,
            }
        },
        computed: {
            p_data() {
                return Object.assign({}, this.data, {text: this.p_text, required: this.required})
            },
        },
        methods: {
            pl_click(e) {
                !!this.showInDialog && this.$dialog.show(this.p_text, {width: '500px', height: '300px', editType: 'textarea', editReadonly: true})
                !!this.click && this.click({e, data: this.p_data})
            },
            pl_initTooltip() {
                if (!!this.p_tippy) return

                this.$el.addEventListener('mouseenter', this.pl_mouseenter)
                this.$el.addEventListener('mouseleave', this.pl_mouseleave)
                this.p_tippy = new Tippy(this.$el, {
                    content: this.p_text,
                    arrow: true,
                    placement: 'top',
                    trigger: 'mamual',
                    theme: 'dark',
                    boundary: 'window',
                })
            },
            pl_destroyTooltip() {
                if (!this.p_tippy) return

                this.$el.addEventListener('mouseenter', this.pl_mouseenter)
                this.$el.removeEventListener('mouseleave', this.pl_mouseleave)
                this.p_tippy.hide(0)
                this.p_tippy.destroy(true)
            },

            pl_mouseenter() {
                if (!this.p_tippy) return
                const hostWidth = this.$el.offsetWidth
                const contentWidth = this.$el.scrollWidth
                if (contentWidth > hostWidth) {
                    this.p_tippy.show()
                }
            },
            pl_mouseleave() {
                if (!this.p_tippy) return
                this.p_tippy.hide()
            },
        },
        beforeDestroy() {
            this.pl_destroyTooltip()
        }
    }
</script>

<style lang="scss">
    @include themeWrap {
    }
</style>
