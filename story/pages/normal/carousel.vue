<template>
    <div class="demo-carousel">

        <demo-row title="基本用法">
            <pl-carousel>
                <pl-carousel-item style="background-color: #8A2BE2;color: white;display: flex;align-items: center;justify-content: center;font-size: 28px">
                    panel 1
                </pl-carousel-item>
                <pl-carousel-item style="background-color: #409EFF;color: white;display: flex;align-items: center;justify-content: center;font-size: 28px">
                    panel 2
                </pl-carousel-item>
                <pl-carousel-item style="background-color: #F38585;color: white;display: flex;align-items: center;justify-content: center;font-size: 28px">
                    panel 3
                </pl-carousel-item>
                <pl-carousel-item style="background-color: #455a64;color: white;display: flex;align-items: center;justify-content: center;font-size: 28px">
                    panel 4
                </pl-carousel-item>
            </pl-carousel>
        </demo-row>
        <demo-row title="两个元素">
            <pl-carousel>
                <pl-carousel-item style="background-color: #8A2BE2;color: white;display: flex;align-items: center;justify-content: center;font-size: 28px">
                    panel 1
                </pl-carousel-item>
                <pl-carousel-item style="background-color: #409EFF;color: white;display: flex;align-items: center;justify-content: center;font-size: 28px">
                    panel 2
                </pl-carousel-item>
            </pl-carousel>
        </demo-row>
        <demo-row title="三个元素">
            <pl-carousel>
                <pl-carousel-item style="background-color: #8A2BE2;color: white;display: flex;align-items: center;justify-content: center;font-size: 28px">
                    panel 1
                </pl-carousel-item>
                <pl-carousel-item style="background-color: #409EFF;color: white;display: flex;align-items: center;justify-content: center;font-size: 28px">
                    panel 2
                </pl-carousel-item>
                <pl-carousel-item style="background-color: #F38585;color: white;display: flex;align-items: center;justify-content: center;font-size: 28px">
                    panel 3
                </pl-carousel-item>
            </pl-carousel>
        </demo-row>

        <demo-row title="基本用法">
            <pl-carousel>
                <pl-carousel-item style="background-color: #8A2BE2;color: white;display: flex;align-items: center;justify-content: center;font-size: 28px">
                    panel 1
                </pl-carousel-item>
                <pl-carousel-item style="background-color: #409EFF;color: white;display: flex;align-items: center;justify-content: center;font-size: 28px">
                    panel 2
                </pl-carousel-item>
                <pl-carousel-item style="background-color: #F38585;color: white;display: flex;align-items: center;justify-content: center;font-size: 28px">
                    panel 3
                </pl-carousel-item>
                <pl-carousel-item style="background-color: #455a64;color: white;display: flex;align-items: center;justify-content: center;font-size: 28px">
                    panel 4
                </pl-carousel-item>
                <pl-carousel-item style="background-color: #8A2BE2;color: white;display: flex;align-items: center;justify-content: center;font-size: 28px">
                    panel 5
                </pl-carousel-item>
                <pl-carousel-item style="background-color: #F56C6C;color: white;display: flex;align-items: center;justify-content: center;font-size: 28px">
                    panel 6
                </pl-carousel-item>
                <pl-carousel-item style="background-color: #4caf50;color: white;display: flex;align-items: center;justify-content: center;font-size: 28px">
                    panel 7
                </pl-carousel-item>
            </pl-carousel>
        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "carousel",
        data() {
            return {
                val: {0: '3'},
            }
        },
    }
</script>

<style lang="scss">

</style>