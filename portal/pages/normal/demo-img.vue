<template>
    <div class="demo-img">

        <im-demo-row title="Img基本用法">
            <im-img v-model="imgSrc" :uploadOption="uploadOption"/>
            <im-demo-row title="模仿图片地址切换">
                <div class="img-list">
                    <div class="img-item" v-for="(item,index) in  imgList" :key="index" @click="imgSrc = !!item ? `${item}?version=${Date.now()}` : null">
                        <img :src="item">
                    </div>
                </div>
            </im-demo-row>
        </im-demo-row>

        <im-demo-row title="图片预览">
            <div class="img-list">
                <div class="img-item" v-for="(item,index) in  imgList" :key="index" @click="$img.preview(imgList, index)">
                    <img :src="item">
                </div>
            </div>
        </im-demo-row>

        <im-demo-row title="简单图片">
            <im-simple-img :src="imgSrc2"/>
            <im-demo-row-item title="模拟图片切换">
                <div class="img-list">
                    <div class="img-item" v-for="(item,index) in  imgList" :key="index" @click="imgSrc2 = !!item ? `${item}?version=${Date.now()}` : null">
                        <img :src="item">
                    </div>
                </div>
            </im-demo-row-item>
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
                imgSrc: 'http://pic2.sc.chinaz.com/Files/pic/pic9/201908/hpic1327_s.jpg?version' + Date.now(),
                imgSrc2: 'http://pic2.sc.chinaz.com/Files/pic/pic9/201908/hpic1327_s.jpg?version' + Date.now(),
                uploadOption: null
            }
        },
        async created() {
            console.log({
                CONFIG,
                env: await this.$http.getEnv()
            })
            this.uploadOption = {
                action: `${(await this.$http.getEnv()).server}/upload/uploadFile`,
                filename: 'file',
                data: {
                    module: 'test'
                },
                onSuccess: (data) => {
                    if (data.code !== 0) {
                        this.$notice.show(`文件上传失败！${data.ret}`)
                        return false
                    } else {
                        this.$message.show(`文件[${data.ret.name}]上传成功！`, {type: 'success'})
                        console.log(data.ret)
                        return true
                    }
                },
            }
            console.log(this.uploadOption)
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
