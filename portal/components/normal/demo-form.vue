<template>
    <div class="demo-form">
        <im-demo-row title="基本用法">
            <im-form >
                <im-form-column>
                    <im-form-item label="普通输入框："><im-input/></im-form-item>
                    <im-form-item label="输入框（密码）："><im-input inputType="password"/></im-form-item>
                    <im-form-item label="复选框（单选）：">
                        <im-radio-group>
                            <im-radio id="man" label="男"/>
                            <im-radio id="woman" label="女"/>
                        </im-radio-group>
                    </im-form-item>
                    <im-form-item label="复选框（多选）：">
                        <im-radio-group multiple>
                            <im-radio id="beijing" label="北京"/>
                            <im-radio id="shanghai" label="上海"/>
                            <im-radio id="guangzhou" label="广州"/>
                        </im-radio-group>
                    </im-form-item>
                    <im-form-item label="复选框（单独使用）：">
                        <im-radio label="同意使用协议"/>
                    </im-form-item>
                    <im-form-item label="开关：">
                        <im-toggle/>
                    </im-form-item>

                    <im-form-item >
                        <im-button-group>
                            <im-button label="重置"/>
                            <im-button label="登录"/>
                        </im-button-group>
                    </im-form-item>
                </im-form-column>
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
                <im-form-column>
                    <im-form-item label="用户名："><im-input/></im-form-item>
                    <im-form-item label="密码："><im-input inputType="password"/></im-form-item>
                    <im-form-item label="产品编号："><im-input/></im-form-item>
                    <im-form-item label="产品条形码："><im-input/></im-form-item>
                    <im-form-item>
                        <im-button-group>
                            <im-button v-for="item in ['left','center','right']" :key="item" :label="item" @click="textAlign = item" :active="textAlign===item"/>
                        </im-button-group>
                    </im-form-item>
                </im-form-column>
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
    }
</style>