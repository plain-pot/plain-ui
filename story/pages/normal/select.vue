<template>
    <div class="demo-select">
        <demo-row title="SelectPanel" group>
            <demo-row title="基本测试">
                <pl-checkbox label="测试动态销毁/初始化选项，顺序是否正常" v-model="initFlag"/>
                <pl-select-panel showDebug>
                    <pl-select-group v-for="group in groupData" :key="group.name" :label="group.name">
                        <template v-for="item in group.children">
                            <pl-select-option :key="item.val" :label="item.name" :val="item.val" v-if="initFlag || item.name !== '岳阳市'"/>
                        </template>
                    </pl-select-group>
                </pl-select-panel>
            </demo-row>

            <demo-row title="基本单选">
                <demo-line>
                    {{val[0]}}
                </demo-line>
                <pl-select-panel v-model="val[0]">
                    <pl-select-group v-for="group in groupData" :key="group.name" :label="group.name">
                        <template v-for="item in group.children">
                            <pl-select-option :key="item.val" :label="item.name" :val="item.val" v-if="initFlag || item.name !== '岳阳市'"/>
                        </template>
                    </pl-select-group>
                </pl-select-panel>
            </demo-row>

            <demo-row title="基本多选">
                <demo-line>
                    {{val[1]}}
                </demo-line>
                <pl-select-panel v-model="val[1]" multiple multipleMaxLimit="3" multipleMinLimit="1">
                    <pl-select-group v-for="group in groupData" :key="group.name" :label="group.name">
                        <template v-for="item in group.children">
                            <pl-select-option :key="item.val" :label="item.name" :val="item.val" v-if="initFlag || item.name !== '岳阳市'"/>
                        </template>
                    </pl-select-group>
                </pl-select-panel>
            </demo-row>

            <demo-row title="无数据">
                <pl-select-panel/>
            </demo-row>
            <demo-row title="输入筛选">
                <demo-line>
                    <pl-input v-model="filterText"/>
                </demo-line>
                <pl-select-panel v-model="val[2]" :filterMethod="filterMethod">
                    <pl-select-group v-for="group in groupData" :key="group.name" :label="group.name">
                        <template v-for="item in group.children">
                            <pl-select-option :key="item.val" :label="item.name" :val="item.val" v-if="initFlag || item.name !== '岳阳市'"/>
                        </template>
                    </pl-select-group>
                </pl-select-panel>
            </demo-row>

        </demo-row>
        <demo-row title="SelectService" group>
            <demo-row title="基本用法">
                <pl-button :label="selectValue || 'open select'" @click="basic.toggle" ref="basic"/>
                {{selectValue || 'open select'}}
            </demo-row>
        </demo-row>

        <demo-row title="pl-select">
            <demo-line>
                <span>{{val[3]}}</span>
            </demo-line>
            <pl-select v-model="val[3]">
                <pl-select-option v-for="item in list" :key="item.val" :label="item.name" :val="item.val"/>
            </pl-select>
            <pl-select v-model="val[3]">
                <pl-select-option v-for="item in list.slice(0, 4)" :key="item.val" :label="item.name" :val="item.val"/>
            </pl-select>
        </demo-row>

        <demo-row title="禁用选项">
            <pl-select>
                <pl-select-option label="深圳市" val="shenzhen"/>
                <pl-select-option label="韶关市" val="shaoguan"/>
                <pl-select-option label="珠海市" val="zhuhai"/>
                <pl-select-option label="汕头市" val="shantou" disabled/>
                <pl-select-option label="佛山市" val="foshan"/>
                <pl-select-option label="江门市" val="jiangmen"/>
                <pl-select-option label="湛江市" val="zhanjiang" disabled/>
                <pl-select-option label="茂名市" val="maoming"/>
                <pl-select-option label="肇庆市" val="zhaoqing" disabled/>
                <pl-select-option label="惠州市" val="huizhou"/>
                <pl-select-option label="梅州市" val="meizhou"/>
            </pl-select>
        </demo-row>

        <demo-row title="分组">
            <pl-select>
                <pl-select-group v-for="group in groupData" :key="group.name" :label="group.name">
                    <pl-select-option v-for="item in group.children" :key="item.val" :label="item.name" :val="item.val"/>
                </pl-select-group>
            </pl-select>
        </demo-row>

        <demo-row title="图标">
            <pl-select>
                <pl-select-group v-for="group in groupData" :key="group.name" :label="group.name">
                    <pl-select-option v-for="item in group.children"
                                      :key="item.val"
                                      :label="item.name"
                                      :val="item.val"
                                      :icon="item.i"
                    />
                </pl-select-group>
            </pl-select>
        </demo-row>

        <demo-row title="自定义内容">
            <pl-select>
                <pl-select-group v-for="(group,groupIndex) in groupData" :key="group.name" :label="group.name">
                    <template #label>
                        <span style="font-style: italic;font-size: 1.2em;margin-right: 6px;opacity: 0.5">{{groupIndex+1}}</span>
                        <span>{{group.name}}</span>
                    </template>
                    <pl-select-option v-for="(item,itemIndex) in group.children" :key="item.val" :label="item.name" :val="item.val">
                        <span style="font-style: italic;margin-right: 6px;opacity: 0.5">{{groupIndex+1}}.{{itemIndex+1}}</span>
                        <span>{{item.name}}</span>
                    </pl-select-option>
                </pl-select-group>
            </pl-select>
        </demo-row>


    </div>
</template>

<script>
    export default {
        name: "demo-select",
        data() {
            return {
                val: {},
                initFlag: true,
                groupData: [
                    {
                        name: '操作类型',
                        children: [
                            {name: '添加', val: 'add', i: 'el-icon-folder-add'},
                            {name: '删除', val: 'remove', i: 'el-icon-folder-remove'},
                            {name: '通过', val: 'checked', i: 'el-icon-folder-checked'},
                            {name: '不通过', val: 'delete', i: 'el-icon-folder-delete'},
                        ],
                    },
                    {
                        name: '文件夹类型',
                        children: [
                            {name: '展开', val: 'opened', i: 'el-icon-folder-opened'},
                            {name: '收起', val: 'collapse', i: 'el-icon-folder-s'},
                            {name: '空文件夹', val: 'empty', i: 'el-icon-folder'},
                        ]
                    }
                ],

                filterText: null,
                filterMethod: (option) => {
                    if (!this.filterText || !this.filterText.trim()) {
                        return true
                    }
                    return option.label.indexOf(this.filterText) > -1
                },

                /*---------------------------------------service-------------------------------------------*/
                selectValue: null,
                basic: (() => {
                    let agent;
                    const toggle = () => {
                        if (!agent) {
                            agent = this.$select({
                                reference: () => this.$refs['basic'],
                                renderAttrs: () => ({
                                    modelValue: this.selectValue,
                                    content: () => <>
                                        <pl-select-option label="深圳市" val="shenzhen"/>
                                        <pl-select-option label="广州市" val="gungzhou"/>
                                        <pl-select-option label="佛山市" val="foshan"/>
                                    </>,
                                    onChange: (val) => {
                                        this.selectValue = val
                                        this.$message(val)
                                    }
                                }),
                            })
                        }
                        agent.toggle()
                    }
                    const target = {
                        toggle,
                    }
                    return target
                })(),

                log(...args) {
                    console.log(...args)
                },

                list: [
                    {name: '春节', val: 'Chun'},
                    {name: '万圣节', val: 'WanSheng'},
                    {name: '青年节', val: 'QinNian'},
                    {name: '中年节', val: 'ZhongNian', isDisabled: true,},
                    {name: '国庆节', val: 'GuoQing', isDisabled: true,},
                    {name: '中秋节', val: 'ZhongQiu', isDisabled: true,},
                    {name: '劳动节', val: 'LaoDong', isDisabled: true,},
                    {name: '圣诞节', val: 'ShengDan'},
                    {name: '儿童节', val: 'ErTong'},
                    {name: '妇女节', val: 'FuNv'},
                    {name: '教师节', val: 'JiaoShi'},
                    {name: '清明节', val: 'QingMing'},
                ],
            }
        },
    }
</script>

<style lang="scss">

</style>