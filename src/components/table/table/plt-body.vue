<template>
    <div class="plt-body" :style="styles">
        <pl-scroll scrollX ref="scroll">
            <plt-body-item/>
        </pl-scroll>
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
        computed: {
            styles() {
                return {
                    height: `${this.plTable.bodyRowHeight * this.plTable.showRows}px`
                }
            },
        },
    }
</script>

<style lang="scss">

</style>