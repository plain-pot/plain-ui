<template>
    <div class="demo-img">
        <im-demo-row title="基本用法">
            <im-img v-model="imgSrc"/>
        </im-demo-row>
        <im-demo-row>
            <div class="img-list">
                <div class="img-item" v-for="(item,index) in  imgList" :key="index" @click="changeImg(item)">
                    <img :src="item">
                </div>
            </div>
        </im-demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-img",
        data() {
            return {
                imgList: [
                    'http://pic2.sc.chinaz.com/Files/pic/pic9/201908/hpic1329_s.jpg',
                    'http://pic2.sc.chinaz.com/Files/pic/pic9/201908/hpic1327_s.jpg',
                    'http://pic2.sc.chinaz.com/Files/pic/pic9/201908/hpic1328_s.jpg',
                    'http://pic2.sc.chinaz.com/Files/pic/pic9/201908/bpic13052_s.jpg',
                    'error.jpg',
                    null,
                ],
                imgSrc: 'http://img4.imgtn.bdimg.com/it/u=508387608,2848974022&fm=26&gp=0.jpg',
            }
        },
        methods: {
            changeImg(item) {
                this.imgSrc = !!item ? `${item}?version=${Date.now()}` : null
                console.log(this.imgSrc)
            },
        }
    }
</script>

<style lang="scss">
    .demo-img {
        .img-item {
            display: inline-block;
            margin-right: 12px;
            cursor: pointer;
            transform-origin: center center;
            transition: transform 0.15s linear;

            &:hover {
                transform: scale(1.1);
            }

            img {
                border-radius: 4px;
                height: 100px;
                width: 100px;
                object-fit: cover;
                object-position: center;
                display: block;
            }
        }
    }
</style>
