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
        <demo-row title="两个元素，三个元素">
            <pl-carousel style="width: 200px;display: inline-flex">
                <pl-carousel-item style="background-color: #8A2BE2;color: white;display: flex;align-items: center;justify-content: center;font-size: 28px">
                    panel 1
                </pl-carousel-item>
                <pl-carousel-item style="background-color: #409EFF;color: white;display: flex;align-items: center;justify-content: center;font-size: 28px">
                    panel 2
                </pl-carousel-item>
            </pl-carousel>
            <pl-carousel style="width: 200px;display: inline-flex">
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

        <demo-row title="禁用前后按钮">
            <pl-carousel disabledOperator>
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

        <demo-row title="指示器">
            <demo-line title="禁用指示器">
                <pl-carousel disabledIndicator style="width: 300px">
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
            </demo-line>
            <demo-line title="鼠标悬浮激活指示器">
                <pl-carousel style="width: 300px" indicatorTrigger="hover">
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
            </demo-line>
            <demo-line title="自定义指示器">
                <pl-carousel style="width: 300px" indicatorTrigger="hover">
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

                    <template v-slot:indicator="{active}">
                        <div :style="`margin-right:8px;height:5px;width:5px;background-color:rgba(255,255,255,${active?'1':'0.5'})`"/>
                    </template>

                </pl-carousel>
            </demo-line>
        </demo-row>

        <demo-row title="Cover覆盖内容">
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

                <template #cover>
                    <div style="pointer-events: none;text-align: center;padding: 20px;color: white;box-sizing: border-box">
                        this is cover content
                    </div>
                </template>
            </pl-carousel>
        </demo-row>

        <demo-row title="自动播放">
            <demo-line title="禁用自动播放">
                <pl-carousel :autoplay="0" style="width: 300px">
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
            </demo-line>
            <demo-line title="时间间隔6s">
                <pl-carousel :autoplay="6000" style="width: 300px">
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
            </demo-line>
        </demo-row>

        <demo-row title="纵向切换">
            <pl-carousel vertical>
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
        <demo-row title="卡片形式切换">
            <pl-carousel card>
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