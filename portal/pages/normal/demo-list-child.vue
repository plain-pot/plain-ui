<template>
    <div class="demo-list-child">
        <im-demo-row title="基本用法：设置动画">
            <im-button-group>
                <im-button @click="add">add</im-button>
                <im-button @click="remove">remove</im-button>
                <im-button @click="shuffle">shuffle</im-button>
            </im-button-group>
            <im-button-group>
                <im-button @click="direction = 'top'" :active="direction === 'top'">top</im-button>
                <im-button @click="direction = 'left'" :active="direction === 'left'">left</im-button>
                <im-button @click="direction = 'right'" :active="direction === 'right'">right</im-button>
                <im-button @click="direction = 'bottom'" :active="direction === 'bottom'">bottom</im-button>
                <im-button @click="direction = 'top-left'" :active="direction === 'top-left'">top-left</im-button>
                <im-button @click="direction = 'top-right'" :active="direction === 'top-right'">top-right
                </im-button>
                <im-button @click="direction = 'bottom-left'" :active="direction === 'bottom-left'">bottom-left
                </im-button>
                <im-button @click="direction = 'bottom-right'" :active="direction === 'bottom-right'">bottom-right
                </im-button>
            </im-button-group>
        </im-demo-row>
        <im-demo-row>
            <im-list :direction="direction" draggable :dragList="cities">
                <im-item v-for="(item,index) in cities" :key="item.name" class="test-item"
                         @click="handleClick(item,index)">{{item.name}}
                </im-item>
            </im-list>
        </im-demo-row>
    </div>

</template>

<script>
    export default {
        name: "demo-list-child",
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
                this.cities = this.$plain.$utils.shuffle(this.cities);
            },
        }
    }
</script>

<style lang="scss">
    @include themeWrap {
        .test-item {
            height: 120px;
            width: 200px;
            margin-bottom: 12px;
            margin-right: 12px;
            border-radius: 4px;
            padding: 12px;
            color: white;
            background-color: plVar(colorPrimary);
            display: inline-block !important;
        }
    }
</style>
