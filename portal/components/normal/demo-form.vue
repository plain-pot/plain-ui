<template>
    <div class="demo-form">
        <!--<im-demo-row title="基本用法">
            <im-form>
                <im-form-column>
                    <im-form-item label="普通输入框：">
                        <im-input required/>
                    </im-form-item>
                    <im-form-item label="输入框（密码）：">
                        <im-input inputType="password"/>
                    </im-form-item>
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

                    <im-form-item>
                        <im-button-group>
                            <im-button label="重置"/>
                            <im-button label="登录"/>
                        </im-button-group>
                    </im-form-item>
                </im-form-column>
            </im-form>
        </im-demo-row>-->

        <im-demo-row title="校验">
            <im-form ref="form">
                <im-form-column>
                    <im-form-item label="必输：">
                        <im-input required/>
                    </im-form-item>
                    <im-form-item label="长度5-10，字符串：">
                        <im-input rules="length:{max:10,min:5}"/>
                    </im-form-item>
                    <im-form-item label="长度5-10，对象：">
                        <im-input :rules="{rule:'length',max:10,min:5}"/>
                    </im-form-item>
                    <im-form-item label="邮箱：">
                        <im-input rules="email"/>
                    </im-form-item>
                    <im-form-item label="手机号码：">
                        <im-input rules="phone"/>
                    </im-form-item>
                    <im-form-item label="QQ号码：">
                        <im-input rules="qq"/>
                    </im-form-item>
                    <im-form-item label="身份证号：">
                        <im-input rules="cardId"/>
                    </im-form-item>
                    <im-form-item label="自定义正则表达式：">
                        <im-input :rules="{rule:'regexp',reg:'^(www\\.)[1-9a-zA-Z]+(\\.com)$',msg:'自定义正则表达式校验不正确'}"/>
                    </im-form-item>
                    <im-form-item label="多重校验【必输，手机号码】：">
                        <im-input :rules="['phone','required']"/>
                    </im-form-item>
                    <im-form-item>
                        <im-button label="保存" @click="$plain.log('save')"/>
                        <im-button label="提交"/>
                    </im-form-item>
                </im-form-column>
            </im-form>
            <im-button-group>
                <im-button label="校验" @click="pl_valid"/>
                <im-button label="取消校验状态" @click="$refs.form.cancelValid()"/>
                <im-button label="禁用" @click="$refs.form.setDisabled()"/>
                <im-button label="取消禁用" @click="$refs.form.setDisabled(false)"/>
                <im-button label="只读" @click="$refs.form.setReadonly()"/>
                <im-button label="取消只读" @click="$refs.form.setReadonly(false)"/>
            </im-button-group>
        </im-demo-row>

        <!--<im-demo-row title="列布局">
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
        </im-demo-row>-->
    </div>
</template>

<script>
    export default {
        name: "demo-form",
        data() {
            return {
                textAlign: 'right',
            }
        },
        methods: {
            pl_valid() {
                const {isValid, validMsg} = this.$refs.form.valid()
                console.log(isValid ? 'pass' : validMsg)
            },
        }
    }
</script>

<style lang="scss">
    .demo-form {
    }
</style>