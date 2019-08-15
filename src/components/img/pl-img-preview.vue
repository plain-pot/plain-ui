<template>
    <pl-dialog v-model="show" noHeader noPadding width="100vw" height="100vh" dialogClass="pl-img-preview-dialog" vertical="center" horizontal="center">
        <pl-carousel :data="imgList" v-model="carouselIndex" ref="carousel">
            <div slot-scope="{item,index}" class="pl-img-preview-item" @dblclick="pl_dblclick">
                <img :src="item">
            </div>
        </pl-carousel>
    </pl-dialog>
</template>

<script>
    export default {
        name: "pl-img-preview",
        data() {
            return {
                show: false,
                imgList: [],
                carouselIndex: 0,
            }
        },
        methods: {
            async preview(imgList, startIndex) {
                this.imgList = imgList
                this.carouselIndex = startIndex || 0
                this.show = true
                await this.$plain.nextTick()
                this.$refs.carousel
            },
            pl_dblclick() {
                this.show = false
            },
        }
    }
</script>

<style lang="scss">
    .pl-img-preview-dialog {
        .pl-dialog-content {
            background-color: transparent !important;
            box-shadow: initial !important;
        }

        .pl-img-preview-item {
            height: 100%;
            width: 100%;

            img {
                width: 100%;
                height: 100%;
                object-position: center;
                object-fit: contain;
                pointer-events: none;
            }
        }
    }
</style>
