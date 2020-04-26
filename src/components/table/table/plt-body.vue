<template>
    <div class="plt-body" :style="styles">
        <plt-body-item @scroll="onScroll"/>
        <plt-body-item fixed="left" @scroll="onScroll"/>
        <plt-body-item fixed="right" @scroll="onScroll"/>
    </div>
</template>

<script lang="ts">

    import {TableComponentMixin, TableHoverPart} from "./table-utils";
    import {EmitMixin, RefsMixinFactory} from "../../../utils/mixins";
    import {PlcFixedType} from "../plc/plc-utils";

    export default {
        name: "plt-body",
        provide() {
            return {
                pltBody: this,
            }
        },
        mixins: [
            EmitMixin,
            TableComponentMixin,
            RefsMixinFactory({
                scroll: Object
            })
        ],
        emitters: {
            emitScrollLeft: Function,
        },
        data() {
            return {
                bodyItems: {
                    center: null,
                    left: null,
                    right: null,
                },
                scrollState: {
                    scrollTop: 0,
                    scrollLeft: 0,
                },
            }
        },
        created() {
            this.plTable.$on('scroll-left', this.onScrollLeft)
        },
        beforeDestroy() {
            this.plTable.$off('scroll-left', this.onScrollLeft)
        },
        computed: {
            styles() {
                return {
                    height: `${this.plTable.bodyRowHeight * this.plTable.showRows + 12}px`
                }
            },
        },
        methods: {
            refreshScroll() {
                Object.values(this.bodyItems).filter(Boolean).forEach((bodyItem: any) => bodyItem.virtualTable.scroll.refresh())
            },
            onScroll(e) {
                const {part, fixed} = this.plTable.hoverState

                this.plTable.emitScroll(e, {part, fixed})

                if (this.plTable.hoverState.part === TableHoverPart.body) {

                    if (fixed === PlcFixedType.center) {
                        this.plTable.emitScrollLeft(e, TableHoverPart.body)
                    }

                    Object.values(this.bodyItems).forEach((item: any) => {
                        if (item.fixed !== this.plTable.hoverState.fixed) {
                            console.log('scroll top', item.fixed)
                            item.virtualTable.scroll.scroll({y: e.target.scrollTop})
                        }
                    })
                }
            },
            onScrollLeft(e, part) {
                if (part === TableHoverPart.head) {
                    if (!!this.bodyItems.center) {
                        console.log('scroll left', TableHoverPart.body)
                        this.bodyItems.center.virtualTable.scroll.scroll({x: e.target.scrollLeft})
                    }
                }
            },
        },
    }
</script>

<style lang="scss">

</style>