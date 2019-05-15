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
                        <im-input required :suggestion="['广州','北京','上海']"/>
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
                <im-form-column>
                    <im-form-item label="文本域">
                        <im-textarea required/>
                    </im-form-item>
                    <im-form-item label="输入输入框">
                        <im-number required/>
                    </im-form-item>
                    <im-form-item label="下拉选择框">
                        <im-select required :data="['北京','上海','广州','南京','南昌']"/>
                    </im-form-item>
                    <im-form-item label="下拉选择框：多选">
                        <im-select :data="data" labelKey="trainno12306" valueKey="trainno" multiple required>
                            <template slot-scope="{item,index}">
                                <div class="demo-select-item-line">
                                    <span>{{item.trainno12306}}</span>
                                    <span>{{item.departuretime}}</span>
                                </div>
                                <div class="demo-select-item-line">
                                    <span>{{item.station}} - {{item.endstation}}</span>
                                    <span>{{item.arrivaltime}}</span>
                                </div>
                            </template>
                        </im-select>
                    </im-form-item>
                    <im-form-item label="折叠组件">
                        <im-cascade :data="cascadeData" label-key="label" children-key="children" value-key="value" required/>
                    </im-form-item>
                    <im-form-item label="颜色选择器">
                        <im-color-picker required/>
                    </im-form-item>
                    <im-form-item label="时间选择器">
                        <im-time required/>
                    </im-form-item>
                    <im-form-item label="日期选择器">
                        <im-date required/>
                    </im-form-item>
                    <im-form-item label="标签输入框">
                        <im-tag-input required input/>
                    </im-form-item>
                    <im-form-item label="复选框">
                        <im-radio-group multiple>
                            <im-radio v-for="(item) in ['北京','上海','广州','南京']" :key="item" :id="item" :label="item"/>
                        </im-radio-group>
                    </im-form-item>
                    <im-form-item label="单选框">
                        <im-radio-group>
                            <im-radio v-for="(item) in ['北京','上海','广州','南京']" :key="item" :id="item" :label="item"/>
                        </im-radio-group>
                    </im-form-item>
                    <im-form-item label="开关">
                        <im-toggle/>
                    </im-form-item>


                </im-form-column>
            </im-form>
            <im-button-group>
                <im-button label="校验" @click="pl_valid"/>
                <im-button label="取消校验状态" @click="$refs.form.cancelValid()"/>
                <im-button label="禁用" @click="disabled=true;$refs.form.setDisabled()" :active="disabled"/>
                <im-button label="取消禁用" @click="disabled=false;$refs.form.setDisabled(false)" :active="!disabled"/>
                <im-button label="只读" @click="readonly=true;$refs.form.setReadonly()" :active="readonly"/>
                <im-button label="取消只读" @click="readonly=false;$refs.form.setReadonly(false)" :active="!readonly"/>
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
    import {TableData} from "../../data";

    export default {
        name: "demo-form",
        data() {
            return {
                textAlign: 'right',
                data: [...TableData],
                disabled: false,
                readonly: false,
                cascadeData: [{
                    value: 'beijing',
                    label: '北京',
                    children: [
                        {
                            value: 'gugong',
                            disabled: true,
                            label: '故宫'
                        },
                        {
                            value: 'tiantan',
                            label: '天坛'
                        },
                        {
                            value: 'wangfujing',
                            label: '王府井'
                        },
                        {
                            value: 'gugong',
                            label: '故宫'
                        },
                        {
                            value: 'tiantan',
                            label: '天坛'
                        },
                        {
                            value: 'wangfujing',
                            label: '王府井'
                        },
                        {
                            value: 'gugong',
                            label: '故宫'
                        },
                        {
                            value: 'tiantan',
                            label: '天坛'
                        },
                        {
                            value: 'wangfujing',
                            label: '王府井'
                        },
                        {
                            value: 'gugong',
                            label: '故宫'
                        },
                        {
                            value: 'tiantan',
                            label: '天坛'
                        },
                        {
                            value: 'wangfujing',
                            label: '王府井'
                        },
                    ]
                }, {
                    value: 'jiangsu',
                    label: '江苏',
                    children: [
                        {
                            value: 'nanjing',
                            label: '南京',
                            children: [
                                {
                                    value: 'fuzimiao',
                                    label: '夫子庙',
                                }
                            ]
                        },
                        {
                            value: 'suzhou',
                            label: '苏州',
                            children: [
                                {
                                    value: 'zhuozhengyuan',
                                    label: '拙政园',
                                },
                                {
                                    value: 'shizilin',
                                    label: '狮子林',
                                }
                            ]
                        }
                    ],
                }],
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