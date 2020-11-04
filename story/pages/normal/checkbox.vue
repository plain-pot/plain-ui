<template>
    <div class="demo-checkbox">
        <demo-row title="checkbox-inner">
            <div style="font-size: 12px" class="demo-checkbox-row">
                <pl-checkbox-inner checkStatus="check" :disabled="disabledFlag"/>
                <pl-checkbox-inner checkStatus="uncheck" :disabled="disabledFlag"/>
                <pl-checkbox-inner checkStatus="minus" :disabled="disabledFlag"/>
            </div>
            <div style="font-size: 14px" class="demo-checkbox-row">
                <pl-checkbox-inner checkStatus="check" :disabled="disabledFlag"/>
                <pl-checkbox-inner checkStatus="uncheck" :disabled="disabledFlag"/>
                <pl-checkbox-inner checkStatus="minus" :disabled="disabledFlag"/>
            </div>
            <div style="font-size: 16px" class="demo-checkbox-row">
                <pl-checkbox-inner checkStatus="check" :disabled="disabledFlag"/>
                <pl-checkbox-inner checkStatus="uncheck" :disabled="disabledFlag"/>
                <pl-checkbox-inner checkStatus="minus" :disabled="disabledFlag"/>
            </div>
        </demo-row>
        <demo-row title="基本用法">
            <pl-checkbox label="标签一" v-model="val[0]"/>
            <pl-checkbox label="标签二" v-model="val[0]"/>
            {{val[0]}}
        </demo-row>
        <demo-row title="状态">
            <pl-checkbox v-for="item in ['primary','success','warn','error','info']" :label="item" :status="item" :key="item" :modelValue="true"/>
        </demo-row>
        <demo-row title="禁用">
            <pl-checkbox :modelValue="true" :disabled="val[1]" label="标签一"/>
            <pl-checkbox :modelValue="false" :disabled="val[1]" label="标签二"/>
            <pl-checkbox v-model="val[1]" label="禁用"/>
        </demo-row>

        <demo-row title="真假值">
            <pl-checkbox label="标签一" v-model="val[2]" :trueValue="10" :falseValue="20"/>
            {{val[2]}}
        </demo-row>

        <demo-row title="大小">
            <pl-checkbox label="mini" size="mini" v-model="val['a']"/>
            <pl-checkbox label="normal" size="normal" v-model="val['a']"/>
            <pl-checkbox label="large" size="large" v-model="val['a']"/>
            <pl-checkbox label="font-size:24px" style="font-size: 24px" v-model="val['a']"/>
        </demo-row>

        <demo-row title="复选框组">
            <pl-checkbox-group v-model="val[3]">
                <pl-checkbox label="全选" checkboxForAll/>
                <pl-checkbox label="标签一" val="tag1"/>
                <pl-checkbox label="标签二" val="tag2"/>
                <pl-checkbox label="标签三" val="tag3"/>
                {{val[3]}}
            </pl-checkbox-group>
        </demo-row>

        <demo-row title="自定义渲染内容">
            <h4>自定义内容</h4>
            <pl-checkbox-group v-model="val[3]">
                <pl-checkbox checkboxForAll>
                    <template v-slot="{status,click}">
                        <div class="demo-checkbox-custom-item"
                             :class="{'demo-checkbox-custom-item-active':status === 'check'}"
                             @click="click"
                        >
                            {{{
                            check:'以全选',
                            uncheck:'未选中',
                            minus:'半选',
                            }[status]}}
                        </div>
                    </template>
                </pl-checkbox>

                <pl-checkbox v-for="item in ['tag1','tag2','tag3']" :val="item" :key="item">
                    <template v-slot="{checked,click}">
                        <div class="demo-checkbox-custom-item"
                             :class="{'demo-checkbox-custom-item-active':checked}"
                             @click="click"
                        >
                            {{item}}
                        </div>
                    </template>
                </pl-checkbox>
            </pl-checkbox-group>
            <br>
            <br>
            <h4>按钮组形式</h4>
            <pl-checkbox-group v-model="val[3]">
                <pl-checkbox checkboxForAll>
                    <template v-slot="{status,click}">
                        <pl-button @click="click" :active="status === 'check'" width="120px">
                            {{{
                            check:'以全选',
                            uncheck:'未选中',
                            minus:'半选',
                            }[status]}}
                        </pl-button>
                    </template>
                </pl-checkbox>
                <pl-button-group>
                    <pl-checkbox v-for="item in ['tag1','tag2','tag3']" :val="item" :key="item">
                        <template v-slot="{checked,click}">
                            <pl-button @click="click" :active="checked">
                                {{item}}
                            </pl-button>
                        </template>
                    </pl-checkbox>
                </pl-button-group>
            </pl-checkbox-group>
        </demo-row>

        <demo-row title="复选框组：状态以及大小">
            <pl-checkbox-group v-model="val[3]" status="warn" size="large">
                <pl-checkbox label="全选" checkboxForAll/>
                <pl-checkbox label="标签一" val="tag1"/>
                <pl-checkbox label="标签二" val="tag2"/>
                <pl-checkbox label="标签三" val="tag3"/>
                {{val[3]}}
            </pl-checkbox-group>
        </demo-row>

        <demo-row title="复选框组：禁用与只读">
            <pl-checkbox-group v-model="val[3]" disabled>
                <pl-checkbox label="全选" checkboxForAll/>
                <pl-checkbox label="标签一" val="tag1"/>
                <pl-checkbox label="标签二" val="tag2"/>
                <pl-checkbox label="标签三" val="tag3"/>
            </pl-checkbox-group>
            <br>
            <pl-checkbox-group v-model="val[3]" readonly>
                <pl-checkbox label="全选" checkboxForAll/>
                <pl-checkbox label="标签一" val="tag1"/>
                <pl-checkbox label="标签二" val="tag2"/>
                <pl-checkbox label="标签三" val="tag3"/>
            </pl-checkbox-group>
            {{val[3]}}
        </demo-row>

        <demo-row title="复选框组：最大最小勾选个数(全选会勾选最大可勾选个数)">
            <pl-checkbox-group v-model="val[4]" :max="3" :min="1">
                <pl-checkbox label="全选" checkboxForAll/>
                <pl-checkbox label="标签一" val="tag1"/>
                <pl-checkbox label="标签二" val="tag2"/>
                <pl-checkbox label="标签三" val="tag3"/>
                <pl-checkbox label="标签四" val="tag4"/>
                <pl-checkbox label="标签五" val="tag5"/>
                {{val[4]}}
            </pl-checkbox-group>
        </demo-row>

        <demo-row title="设置选项宽度使其对其">
            <div style="width: 300px">
                <pl-checkbox-group v-model="val[4]" itemWidth="50%">
                    <pl-checkbox label="全选" checkboxForAll/>
                    <pl-checkbox label="标签一" val="tag1"/>
                    <pl-checkbox label="标签二" val="tag2"/>
                    <pl-checkbox label="标签三" val="tag3"/>
                    <pl-checkbox label="标签四" val="tag4"/>
                    <pl-checkbox label="标签五" val="tag5"/>
                </pl-checkbox-group>
            </div>
        </demo-row>

    </div>
</template>

<script>
    export default {
        name: "demo-checkbox",
        data() {
            return {
                disabledFlag: false,
                val: {
                    a: true
                },
            }
        },
    }
</script>

<style lang="scss">
    @include theme {
        .demo-checkbox {
            .demo-checkbox-row {
                & > * {
                    margin-right: 1em;
                }
            }

            .demo-checkbox-custom-item {
                display: inline-flex;
                height: 80px;
                width: 80px;
                border-radius: 4px;
                border: solid 1px #f1f1f1;
                align-items: center;
                justify-content: center;
                background-color: #f1f1f1;
                cursor: pointer;
                user-select: none;
                transition: all 300ms $transition;

                &.demo-checkbox-custom-item-active {
                    background-color: $colorPrimary;
                    color: white;
                }
            }
        }
    }
</style>