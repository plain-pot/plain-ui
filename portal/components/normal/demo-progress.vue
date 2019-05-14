<template>
    <div class="demo-progress">
        <im-demo-row title="基本用法">
            <im-progress ref="progress1"/>
            <im-button label="reload" @click="$refs.progress1.reload()"/>
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