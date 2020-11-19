<template>
    <div class="demo-alert">
        <demo-row title="基本用法">
            <pl-alert label="默认提示"/>
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
            <pl-alert icon="el-icon-s-opportunity">
                <template #label>
                    自定义标题
                    <pl-button icon="el-icon-right" mode="text" size="mini"/>
                </template>
                <template #desc>
                    <span>
                    自定义内容 <pl-button label="点击了解更多" mode="text"/>
                </span>
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