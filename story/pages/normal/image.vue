<template>
    <div class="demo-image">
        <demo-row title="pl-image">
            <demo-row title="基本用法">
                <pl-image src="http://pic2.sc.chinaz.com/Files/pic/pic9/201908/hpic1329_s.jpg"/>
            </demo-row>
            <demo-row title="限制图片大小">
                <pl-image src="http://pic2.sc.chinaz.com/Files/pic/pic9/201908/hpic1329_s.jpg" height="60" width="60"/>
            </demo-row>
            <demo-row title="限制图片大小：图片的缩放形式">
                <div v-for="item in ['fill','contain','cover','none','scale-down']" :key="item" style="display: inline-flex;flex-direction: column;align-items: center">
                    <pl-image src="http://pic2.sc.chinaz.com/Files/pic/pic9/201908/hpic1329_s.jpg" height="60" width="60" :fit="item"/>
                    <span style="margin-top: 8px">{{item}}</span>
                </div>
            </demo-row>
            <demo-row title="自定义缩放位置">
                <div v-for="item in ['center top','cetner','center bottom']" :key="item" style="display: inline-flex;flex-direction: column;align-items: center">
                    <pl-image src="http://pic2.sc.chinaz.com/Files/pic/pic9/201908/hpic1329_s.jpg" height="60" width="60" fit="cover" :position="item"/>
                    <span style="margin-top: 8px">{{item}}</span>
                </div>
                <pl-alert>fit以及position为css样式中的 object-fit 以及 object-position，具体请参考MDN文档css样式表</pl-alert>
            </demo-row>
            <demo-row title="四种状态">
                <pl-image status="empty"/>
                <pl-image status="pending"/>
                <pl-image status="success" src="http://pic2.sc.chinaz.com/Files/pic/pic9/201908/hpic1329_s.jpg" height="60" width="60"/>
                <pl-image status="error"/>
            </demo-row>
        </demo-row>
        <demo-row title="pl-image-uploader">
            <demo-row title="基本用法">
                <pl-image-uploader/>
            </demo-row>
        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-image"
    }
</script>

<style lang="scss">

</style>