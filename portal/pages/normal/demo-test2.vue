<template>
    <div class="demo-test2">
        <im-demo-row title="测试拖拽排序"></im-demo-row>
        <div>
            <im-toggle v-model="draggable"/>
            <span>{{cities}}</span>
        </div>
        <im-list :dragList="cities" :draggable="draggable" @switch="pl_swicth">
            <im-item
                    v-for="(item,index) in cities"
                    :key="item.name"
                    class="test-item-aaa"
                    @click="pl_click(index)">
                <span>{{item.name}}</span>
                <span>{{item.num}}</span>
            </im-item>
        </im-list>
    </div>
</template>

<script>

    export default {
        name: "demo-test2",
        data() {
            return {
                cities: [
                    {name: '上海市', num: 5},
                    {name: '北京市', num: 8},
                    {name: '广州市', num: 11},
                    {name: '深圳市', num: 17},
                    {name: '长沙市', num: 2},
                    {name: '南京市', num: 0},
                ],

                draggable: true,
            }
        },
        mounted() {
            /*for (let i = 0; i < 6; i++) {
                this.cities.push({name: i})
            }*/
        },
        methods: {
            pl_click(index) {
                console.log(index)
            },
            pl_swicth() {
                console.log(arguments[0])
            },
        }
    }
</script>

<style lang="scss">
    @include themeWrap {
        .test-item-aaa {
            height: 36px;
            width: 150px;
            margin-bottom: 12px;
            border-radius: 2px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border: solid 1px #ddd;
            box-sizing: border-box;
            padding: 0 12px;
            background-color: white;
        }
    }
</style>
