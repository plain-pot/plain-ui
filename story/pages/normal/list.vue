<template>
    <div class="demo-list">
        <demo-row title="基本用法：设置动画">
            <pl-button-group>
                <pl-button @click="add">add</pl-button>
                <pl-button @click="remove">remove</pl-button>
                <pl-button @click="shuffle">shuffle</pl-button>
            </pl-button-group>
            <pl-button-group>
                <pl-button @click="direction = 'top'" :active="direction === 'top'">top</pl-button>
                <pl-button @click="direction = 'left'" :active="direction === 'left'">left</pl-button>
                <pl-button @click="direction = 'right'" :active="direction === 'right'">right</pl-button>
                <pl-button @click="direction = 'bottom'" :active="direction === 'bottom'">bottom</pl-button>
                <pl-button @click="direction = 'top-left'" :active="direction === 'top-left'">top-left</pl-button>
                <pl-button @click="direction = 'top-right'" :active="direction === 'top-right'">top-right
                </pl-button>
                <pl-button @click="direction = 'bottom-left'" :active="direction === 'bottom-left'">bottom-left
                </pl-button>
                <pl-button @click="direction = 'bottom-right'" :active="direction === 'bottom-right'">bottom-right
                </pl-button>
            </pl-button-group>
        </demo-row>
        <demo-row>
            <pl-list :direction="direction">
                <pl-item v-for="(item,index) in cities" :key="item.name" class="test-item"
                         @click="handleClick(item,index)">{{item.name}}
                </pl-item>
            </pl-list>
        </demo-row>
    </div>
</template>

<script>

    import {shuffle} from "plain-utils/object/shuffle";

    export default {
        name: "demo-list",
        data() {
            return {
                direction: 'top',
                cities: [
                    {name: '广州市'},
                    {name: '上海市'},
                    {name: '北京市'},
                    {name: '深圳市'},
                    {name: '长沙市'},
                    {name: '南京市'},
                ]
            }
        },
        methods: {
            randomIndex: function () {
                return Math.floor(Math.random() * this.cities.length);
            },
            handleClick(item, index) {
                this.cities.splice(index, 1);
            },
            add() {
                this.cities.splice(this.randomIndex(), 0, {name: new Date().getTime()});
            },
            remove() {
                this.cities.splice(this.randomIndex(), 1);
            },
            shuffle() {
                this.cities = shuffle(this.cities);
            },
        }
    }
</script>

<style lang="scss">
    @include theme {
        .test-item {
            height: 120px;
            width: 200px;
            margin-bottom: 12px;
            margin-right: 12px;
            border-radius: $popperRadius;
            padding: 12px;
            color: white;
            background-color: $colorPrimary;
            display: inline-block !important;
        }
    }
</style>