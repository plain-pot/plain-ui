<template>
    <div class="demo-alert">
        <demo-row title="基本用法">
            <div style="width: 800px">
                <pl-alert style="margin-bottom: 10px">
                    Form校验模式的有点就是能够兼容所有的组件，包括原生表单控件以及其他组件库的组件。
                    当校验失败的时候，FormItem底部必定会显示红色的警告信息；
                </pl-alert>
            </div>
            <pl-alert label="不显示状态图标" :icon="null"/>
        </demo-row>
        <demo-row title="状态">
            <pl-alert v-for="item in ['primary','success','warn','error','info']"
                      :key="item"
                      :label="item.toUpperCase()"
                      :status="item"/>
        </demo-row>
        <demo-row title="带标题">
            <pl-alert desc="默认状态下的提示文本" label="默认状态" status="primary"/>
            <pl-alert desc="成功状态下的提示文本" label="成功状态" status="success"/>
            <pl-alert desc="警告状态下的提示文本" label="警告状态" status="warn"/>
            <pl-alert desc="失败状态下的提示文本" label="失败状态" status="error"/>
            <pl-alert desc="提示状态下的提示文本" label="提示状态" status="info"/>
        </demo-row>
        <demo-row title="文本对其方式">
            <pl-alert label="居中对其" align="center"/>
            <pl-alert desc="默认状态下的提示文本" label="左对齐" status="primary" align="left"/>
            <pl-alert desc="成功状态下的提示文本" label="居中对其" status="success" align="center"/>
            <pl-alert desc="警告状态下的提示文本" label="右对齐" status="warn" align="right"/>
        </demo-row>
        <demo-row title="深色主题">
            <pl-alert v-for="item in ['primary','success','warn','error','info']"
                      theme="deep"
                      :key="item"
                      :label="item.toUpperCase()"
                      :status="item"/>
            <br>
            <pl-alert theme="deep" desc="默认状态下的提示文本" label="默认状态" status="primary"/>
            <pl-alert theme="deep" desc="成功状态下的提示文本" label="成功状态" status="success"/>
            <pl-alert theme="deep" desc="警告状态下的提示文本" label="警告状态" status="warn"/>
            <pl-alert theme="deep" desc="失败状态下的提示文本" label="失败状态" status="error"/>
            <pl-alert theme="deep" desc="提示状态下的提示文本" label="提示状态" status="info"/>
        </demo-row>
        <demo-row title="自定义图标、标题以及内容">
            <pl-alert icon="el-icon-s-opportunity" status="success">
                <div>
                    自定义标题
                    <pl-button icon="el-icon-right" mode="text" size="mini"/>
                </div>
                <template #desc>
                    <div>
                        自定义内容
                        <pl-button label="点击了解更多" mode="text"/>
                    </div>
                </template>
            </pl-alert>
        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-alert",
    }
</script>

<style lang="scss">
    .demo-alert {
        .pl-alert {
            margin-bottom: 8px;
        }
    }
</style>