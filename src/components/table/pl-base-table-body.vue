<template>
    <div class="pl-base-table-body">

        />
    </div>
</template>

<script>
    import {TableMixin} from "./index";

    export default {
        name: "pl-base-table-body",
        mixins: [
            TableMixin,
        ],
        data() {
            return {
                fixeds: ['center', 'left', 'right'],                                        //固定列位置，用于循环
                p_hoverFixed: null,                                                        //当前鼠标hover的位置：center、left、right，用于判断滚动
                p_calculateTimer: null,                                                    //计算左右滚动的计时器
                baseTable: null,                                                            //baseTable父对象
            }
        },

    }
</script>

<style lang="scss">

</style>