<template>
    <div class="plt-body" :style="styles">
        <plt-body-item/>
    </div>
</template>

<script lang="ts">
    import {TableComponentMixin} from "./table-utils";
    import {RefsMixinFactory} from "../../../utils/mixins";

    export default {
        name: "plt-body",
        provide() {
            return {
                pltBody: this,
            }
        },
        mixins: [
            TableComponentMixin,
            RefsMixinFactory({
                scroll: Object
            })
        ],
        data() {
            return {
                bodyItems: {
                    center: null,
                    left: null,
                    right: null,
                },
            }
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
        },
    }
</script>

<style lang="scss">

</style>