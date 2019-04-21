<template>
    <div class="demo-plain-dom">
        <im-demo-row>
            <im-button label="toggle" @click="under = !under"/>
            <div v-plain-dom="under" :class="{'fixed-box':under}">
                <im-input v-model="text"/>
            </div>
            <im-input v-model="text" color="primary"/>

        </im-demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-plain-dom",
        data() {
            return {
                text: null,
                under: false,
            }
        }
    }
</script>

<style lang="scss">
    .fixed-box {
        background-color: #f2f2f2;
        height: 100px;
        width: 250px;
        padding: 12px;
        border-radius: 4px;
        top: 300px;
        left: 300px;
        position: fixed;
    }
</style>