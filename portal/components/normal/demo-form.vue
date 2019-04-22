<template>
    <div class="demo-form">
        <im-demo-row title="基本用法">
            <im-form >
                <im-form-item label="用户名："><im-input/></im-form-item>
                <im-form-item label="密码："><im-input inputType="password"/></im-form-item>
                <im-form-item label="产品编号："><im-input/></im-form-item>
                <im-form-item label="产品名称："><im-input/></im-form-item>
                <im-form-item label="产品条形码："><im-input/></im-form-item>
                <im-form-item label="产品规格："><im-input/></im-form-item>
            </im-form>
        </im-demo-row>
        <im-demo-row title="列布局">
            <im-form>
                <im-form-column>
                    <im-form-item label="用户名："><im-input/></im-form-item>
                </im-form-column>
                <im-form-column>
                    <im-form-item label="产品编号："><im-input/></im-form-item>
                    <im-form-item label="产品名称："><im-input/></im-form-item>
                </im-form-column>
                <im-form-column>
                    <im-form-item label="Select："><im-input/></im-form-item>
                    <im-form-item label="有效开始日期："><im-input/></im-form-item>
                    <im-form-item label="有效结束日期："><im-input/></im-form-item>
                </im-form-column>
            </im-form>
        </im-demo-row>
        <im-demo-row title="文字对其方式">
            <im-form :textAlign="textAlign">
                <im-form-item label="用户名："><im-input/></im-form-item>
                <im-form-item label="密码："><im-input inputType="password"/></im-form-item>
                <im-form-item label="产品编号："><im-input/></im-form-item>
                <im-form-item label="产品条形码："><im-input/></im-form-item>
                <im-form-item>
                    <im-button-group>
                        <im-button v-for="item in ['left','center','right']" :key="item" :label="item" @click="textAlign = item" :active="textAlign===item"/>
                    </im-button-group>
                </im-form-item>
            </im-form>
        </im-demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-form",
        data(){
            return{
                textAlign:'right',
            }
        },
    }
</script>

<style lang="scss">
    .demo-form {
        width: 1200px;
    }
</style>