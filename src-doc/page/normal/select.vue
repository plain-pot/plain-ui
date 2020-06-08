<template>
    <div class="demo-select">
        <demo-row title="select-panel">
            <demo-row title="基本测试">
                <pl-checkbox label="测试动态销毁/初始化选项，顺序是否正常" v-model="initFlag"/>
                <pl-select-panel showDebug>
                    <pl-select-group v-for="group in groupData" :key="group.name" :label="group.name">
                        <pl-select-option v-for="item in group.children" :key="item.val" :label="item.name" :val="item.val" v-if="initFlag || item.name !== '岳阳市'"/>
                    </pl-select-group>
                </pl-select-panel>
            </demo-row>
            <demo-row title="基本单选">
                <demo-line>
                    {{val[0]}}
                </demo-line>
                <pl-select-panel v-model="val[0]">
                    <pl-select-group v-for="group in groupData" :key="group.name" :label="group.name">
                        <pl-select-option v-for="item in group.children" :key="item.val" :label="item.name" :val="item.val" v-if="initFlag || item.name !== '岳阳市'"/>
                    </pl-select-group>
                </pl-select-panel>
            </demo-row>
            <demo-row title="基本多选">
                <demo-line>
                    {{val[1]}}
                </demo-line>
                <pl-select-panel v-model="val[1]" multiple multipleMaxLimit="3" multipleMinLimit="1">
                    <pl-select-group v-for="group in groupData" :key="group.name" :label="group.name">
                        <pl-select-option v-for="item in group.children" :key="item.val" :label="item.name" :val="item.val" v-if="initFlag || item.name !== '岳阳市'"/>
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
                        <pl-select-option v-for="item in group.children" :key="item.val" :label="item.name" :val="item.val" v-if="initFlag || item.name !== '岳阳市'"/>
                    </pl-select-group>
                </pl-select-panel>
            </demo-row>
        </demo-row>
        <demo-row title="select-service">
            <demo-row title="基本用法">
                <pl-button :label="basic.option.props.value || 'open select'" @click="basic.toggle" ref="basic"/>
            </demo-row>
        </demo-row>
        <demo-row title="pl-select">
            <demo-row title="基本用法">
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

                        <span slot="label" style="font-style: italic;font-size: 1.2em;margin-right: 6px;opacity: 0.5">{{groupIndex+1}}</span>
                        <span slot="label">{{group.name}}</span>

                        <pl-select-option v-for="(item,itemIndex) in group.children" :key="item.val" :label="item.name" :val="item.val">
                            <span style="font-style: italic;font-size: 1.2em;margin-right: 6px;opacity: 0.5">{{groupIndex+1}}.{{itemIndex+1}}</span>
                            <span>{{item.name}}</span>
                        </pl-select-option>
                    </pl-select-group>
                </pl-select>
            </demo-row>

            <demo-row title="自定义内容情况下，会私有化select服务实例">
                <pl-select :data="list" labelKey="name" valueKey="val" v-model="val[1]">
                    <template slot-scope="{data}">
                        <div>
                            <span>{{data.name}}</span>
                            <span style="float: right;font-size: 12px;color: #ccc">{{data.val}}</span>
                            <input type="text">
                        </div>
                    </template>
                </pl-select>
                <span>{{val[1]}}</span>
            </demo-row>

            <demo-row title="加载状态">
                <pl-checkbox v-model="flag.loading"/>
                <pl-select :data="list" labelKey="name" valueKey="val" v-model="val[1]" :loading="flag.loading"/>
                <span>{{val[1]}}</span>
            </demo-row>

            <demo-row title="filterable:false，禁用可输入筛选">
                <pl-select :data="list" labelKey="name" valueKey="val" v-model="val[2]" :filterable="false"/>
                <span>{{val[2]}}</span>
            </demo-row>

            <demo-row title="filterMethod，自定义输入筛选逻辑，支持中文以及拼音">
                <pl-select :data="list" labelKey="name" valueKey="val" v-model="val[3]" :filterMethod="customFilterMethod">
                    <template slot-scope="{data}">
                        <div>
                            <span>{{data.name}}</span>
                            <span style="float: right;font-size: 12px;color: #ccc">{{data.val}}</span>
                        </div>
                    </template>
                </pl-select>
                <span>{{val[3]}}</span>
            </demo-row>

            <demo-row title="noMatchText，输入筛选时，没有匹配项显示的文本">
                <pl-select :data="list" labelKey="name" valueKey="val" v-model="val[4]" :noMatchText="'没有数据啦'"/>
                <span>{{val[4]}}</span>
            </demo-row>
            <demo-row title="noDataText，data为空时显示的文本">
                <pl-select :data="[]" labelKey="name" valueKey="val" v-model="val[5]"/>
                <pl-select :data="[]" labelKey="name" valueKey="val" v-model="val[5]" :noDataText="'没有数据啦'"/>
                <span>{{val[5]}}</span>
            </demo-row>

            <demo-row title="派发blur事件">
                <pl-select :data="list" labelKey="name" valueKey="val" @blur="$plain.log('blur',Date.now())" @focus="$plain.log('focus',Date.now())"/>
                <ol>
                    <li>select关闭的时候使用tab触发blur</li>
                    <li>select打开的时候使用tab触发blur</li>
                    <li>select关闭的时候点击其他地方导致触发blur</li>
                    <li>select打开的时候点击其他地方导致触发blur</li>
                    <li>问题：怎么区分是点击select-item失去的焦点，还是点击外部区域失去的焦点 (已解决)</li>
                </ol>
            </demo-row>

            <demo-row title="禁用以及只读">
                <demo-line title="禁用">
                    <pl-checkbox v-model="flag.disabled" label="禁用"/>
                    <pl-select :data="list" labelKey="name" valueKey="val" :disabled="flag.disabled"/>
                </demo-line>
                <demo-line title="只读">
                    <pl-checkbox v-model="flag.readonly" label="只读"/>
                    <pl-select :data="list" labelKey="name" valueKey="val" :readonly="flag.readonly"/>
                </demo-line>
            </demo-row>

            <demo-row title="多选">
                <pl-select multiple :data="list" labelKey="name" valueKey="val" v-model="val[6]"/>
                <pl-select multiple :data="list" labelKey="name" valueKey="val" v-model="val[6]" :collapseTags="false"/>
                <span>{{val[6]}}</span>
            </demo-row>

            <demo-row title="multipleLimit:3，最多可以选择3个元素">
                <pl-select :data="list" labelKey="name" valueKey="val" v-model="val[7]" :multipleLimit="3" multiple/>
                <span>{{val[7]}}</span>
            </demo-row>
        </demo-row>

    </div>
</template>

<script>
    export default {
        name: "demo-select",
        data() {

            const newData = (name, option) => {
                let result = {
                    service: null,
                    option: {
                        props: {
                            value: null,
                            content: (h) => {
                                return [
                                    <pl-select-option label="深圳市" val="shenzhen"/>,
                                    <pl-select-option label="佛山市" val="foshan"/>,
                                    <pl-select-option label="广州市" val="guangzhou"/>,
                                ]
                            },
                            ...option,
                        },
                        popperProps: {
                            reference: () => this.$refs[name],
                        },
                        listener: {
                            change: (val) => {
                                result.option.props.value = val
                            }
                        },
                    },
                    toggle: async () => {
                        if (!result.service) {
                            result.service = await this.$plain.$select(result.option)
                        }
                        result.service.toggle()
                    },
                }
                return result
            }

            const basic = newData('basic')

            return {
                val: {
                    0: 'shenzhen',

                },
                list: [
                    {name: '春节', val: 'Chun'},
                    {name: '万圣节', val: 'WanSheng'},
                    {name: '青年节', val: 'QinNian'},
                    {name: '中年节', val: 'ZhongNian', row_disabled: true,},
                    {name: '国庆节', val: 'GuoQing', row_disabled: true,},
                    {name: '中秋节', val: 'ZhongQiu', row_disabled: true,},
                    {name: '劳动节', val: 'LaoDong', row_disabled: true,},
                    {name: '圣诞节', val: 'ShengDan'},
                    {name: '儿童节', val: 'ErTong'},
                    {name: '妇女节', val: 'FuNv'},
                    {name: '教师节', val: 'JiaoShi'},
                    {name: '清明节', val: 'QingMing'},
                ],
                groupData: [
                    {
                        name: '广东省',
                        children: [
                            {name: '深圳市', val: 'shenzhen', i: 'el-icon-burger'},
                            {name: '广州市', val: 'guangzhou', i: 'el-icon-tableware'},
                            {name: '佛山市', val: 'foshan', i: 'el-icon-sugar'},
                            {name: '梅州市', val: 'meizhou', i: 'el-icon-dessert'},
                        ],
                    },
                    {
                        name: '湖南省',
                        children: [
                            {name: '长沙市', val: 'changsha', i: 'el-icon-ice-cream'},
                            {name: '岳阳市', val: 'yueyang', i: 'el-icon-water-cup'},
                            {name: '邵阳市', val: 'shaoyang', i: 'el-icon-watermelon'},
                        ]
                    }
                ],

                flag: {
                    disabled: true,
                    readonly: true,
                    loading: true,
                },
                initFlag: true,

                basic,

                filterText: null,
                filterMethod: (option) => {
                    if (!this.filterText || !this.filterText.trim()) {
                        return true
                    }
                    return option.label.indexOf(this.filterText) > -1
                }
            }
        },
        methods: {
            customFilterMethod(input, item, index) {
                const {name, val} = item.data
                return (name.toLowerCase() + val.toLowerCase()).indexOf(input.toLowerCase()) > -1
            },
        },
    }
</script>

<style lang="scss">
</style>