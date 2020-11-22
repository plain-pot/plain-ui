<template>
    <div class="demo-carousel">
        <demo-row title="基本用法">
            <pl-radio-group v-model="val[0]">
                <pl-radio label="1" val="1"/>
                <pl-radio label="2" val="2"/>
                <pl-radio label="3" val="3"/>
                <pl-radio label="4" val="4"/>
                <pl-radio label="5" val="5"/>
                <pl-radio label="6" val="6"/>
                <pl-radio label="7" val="7"/>
            </pl-radio-group>
            <pl-carousel style="width: 500px" v-model="val[0]">
                <pl-carousel-item
                        val="1"
                        style="background-color: #8A2BE2;color: white;display: flex;align-items: center;justify-content: center;font-size: 28px">
                    panel 1
                </pl-carousel-item>
                <pl-carousel-item
                        val="2"
                        style="background-color: #409EFF;color: white;display: flex;align-items: center;justify-content: center;font-size: 28px">
                    panel 2
                </pl-carousel-item>
                <pl-carousel-item
                        val="3"
                        style="background-color: #F38585;color: white;display: flex;align-items: center;justify-content: center;font-size: 28px">
                    panel 3
                </pl-carousel-item>
                <pl-carousel-item
                        val="4"
                        style="background-color: #455a64;color: white;display: flex;align-items: center;justify-content: center;font-size: 28px">
                    panel 4
                </pl-carousel-item>
                <pl-carousel-item
                        val="5"
                        style="background-color: #8A2BE2;color: white;display: flex;align-items: center;justify-content: center;font-size: 28px">
                    panel 5
                </pl-carousel-item>
                <pl-carousel-item
                        val="6"
                        style="background-color: #F56C6C;color: white;display: flex;align-items: center;justify-content: center;font-size: 28px">
                    panel 6
                </pl-carousel-item>
                <pl-carousel-item
                        val="7"
                        style="background-color: #4caf50;color: white;display: flex;align-items: center;justify-content: center;font-size: 28px">
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