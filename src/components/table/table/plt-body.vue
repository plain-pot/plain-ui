<template>
    <div class="plt-body" :style="styles">
        <pl-scroll>
            <plt-body-item/>
        </pl-scroll>
    </div>
</template>

<script lang="ts">
    import {TableComponentMixin} from "./table-utils";

    export default {
        name: "plt-body",
        provide() {
            return {
                pltBody: this,
            }
        },
        mixins: [
            TableComponentMixin,
        ],
        computed: {
            styles() {
                return {
                    height: `${this.plTable.bodyRowHeight * this.plTable.showRows}px`
                }
            },
            bodyPlcList() {
                if (!this.plTable.plcList) return []
                const flatPlcList = []
                this.plTable.iterate(this.plTable.plcList, (plc) => {
                    if (!plc.group) {
                        flatPlcList.push(plc)
                    }
                })
                return flatPlcList
            },
        },
    }
</script>

<style lang="scss">

</style>