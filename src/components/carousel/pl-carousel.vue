<template>
    <div class="pl-carousel">
        pl-carousel
    </div>
</template>

<script>
    import {EmitMixin} from "../../utils/mixins";

    export default {
        name: "pl-carousel",
        mixins: [
            EmitMixin,
        ],
        props: {
            value: {type: Number},
            data: {type: Array, default: () => []},                     //遍历的数组数据
            autoPlay: {type: Boolean},                                  //自定播放
            autoPlayDuration: {type: Number, default: 3000},            //自动播放的时间间隔
            disabledButton: {type: Boolean},                            //禁用左右翻页按钮
            disabledDot: {type: Boolean},                               //禁用指示器
        },
        emitters: {
            emitInput: Function,
        },
        watch: {
            value(val) {

            },
        },
        data() {
            return {}
        },
        mounted() {

        },
        computed: {},
        methods: {}
    }
</script>

<style lang="scss">
    @include themify {
        .pl-carousel {
            @include public-style;
            height: 100%;
            width: 100%;
            position: relative;
        }
    }
</style>
