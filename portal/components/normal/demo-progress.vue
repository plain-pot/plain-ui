<template>
    <div class="demo-progress">
        <im-demo-row title="基本用法">
            <im-progress ref="progress1" :value="100"/>
            <div>
                <im-button label="reload" @click="$refs.progress1.reload()"/>
            </div>
        </im-demo-row>

        <im-demo-row title="圆形进度条">
            <im-progress type="circle" :value="80"/>
        </im-demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-progress"
    }
</script>

<style lang="scss">

</style>