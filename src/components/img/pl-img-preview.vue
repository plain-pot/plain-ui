<template>
    <pl-dialog v-model="show" noHeader noPadding width="100vw" height="100vh" dialogClass="pl-img-preview-dialog" vertical="center" horizontal="center" initialized>
        <pl-carousel :data="imgList" ref="carousel">
            <div slot-scope="{item,index}" class="pl-img-preview-item" @dblclick="pl_dblclick">
                <pl-simple-img :src="item"/>
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
            }
        },
        methods: {
            async preview(imgList, startIndex = 0) {
                this.imgList = imgList
                this.$refs.carousel.p_containerWidth = window.innerWidth
                this.$refs.carousel.p_x = -startIndex * this.$refs.carousel.p_containerWidth
                this.show = true
                this.$message.show('双击关闭预览', {vertical: 'end'})
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
            display: flex;
            align-items: center;
            justify-content: center;
            img {
                width: 100%;
                height: 100%;
                object-position: center;
                object-fit: contain;
                pointer-events: none;
            }
        }

        .pl-carousel-prev-button, .pl-carousel-next-button {
            .pl-icon {
                font-size: 50px !important;
            }
        }
    }
</style>
