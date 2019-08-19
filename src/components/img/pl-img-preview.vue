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

</style>
