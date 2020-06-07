<template>
    <div class="demo-select">
        <demo-row title="select-panel">
            <pl-select-panel>
                <pl-select-option v-for="item in list" :key="item.val" :label="item.name" :val="item.val"/>
            </pl-select-panel>
        </demo-row>
        <demo-row title="pl-select">
            <demo-row title="基本用法">
                <pl-select :data="list" labelKey="name" valueKey="val" v-model="val[0]"/>
                <span>{{val[0]}}</span>
            </demo-row>

            <demo-row title="禁用选项">
                <pl-select :data="list" labelKey="name" valueKey="val" disabledKey="row_disabled"/>
            </demo-row>
            <demo-row title="分组">
                <pl-select :data="groupList" labelKey="name" valueKey="val" groupKey="row_group"/>
            </demo-row>
            <demo-row title="图标">
                <pl-select :data="iconList" labelKey="name" valueKey="val" iconKey="row_icon" groupKey="row_group"/>
            </demo-row>

            <demo-row title="自定义内容">
                <pl-select :data="list" labelKey="name" valueKey="val" v-model="val[1]">
                    <template slot-scope="{data}">
                        <div>
                            <span>{{data.name}}</span>
                            <span style="float: right;font-size: 12px;color: #ccc">{{data.val}}</span>
                        </div>
                    </template>
                </pl-select>
                <span>{{val[1]}}</span>
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
            return {
                val: {
                    0: 'WanSheng',
                    1: 'ErTong',
                    6: ['WanSheng', 'GuoQing', 'ZhongQiu'],
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
                groupList: [
                    {name: '广东省', val: 'guangdong', row_group: true},
                    {name: '深圳市', val: 'shenzhen'},
                    {name: '广州市', val: 'guangzhou'},
                    {name: '佛山市', val: 'foshan'},
                    {name: '汕头市', val: 'shantou'},
                    {name: '湖南省', val: 'hunan', row_group: true},
                    {name: '长沙市', val: 'changsha'},
                    {name: '岳阳市', val: 'yueyang'},
                    {name: '邵阳市', val: 'shaoyang'},
                ],
                iconList: [
                    {name: '广东省', val: 'guangdong', row_group: true},
                    {name: '深圳市', val: 'shenzhen', row_icon: 'el-icon-burger'},
                    {name: '广州市', val: 'guangzhou', row_icon: 'el-icon-tableware'},
                    {name: '佛山市', val: 'foshan', row_icon: 'el-icon-sugar'},
                    {name: '汕头市', val: 'shantou', row_icon: 'el-icon-dessert'},
                    {name: '湖南省', val: 'hunan', row_group: true},
                    {name: '长沙市', val: 'changsha', row_icon: 'el-icon-ice-cream'},
                    {name: '岳阳市', val: 'yueyang', row_icon: 'el-icon-hot-water'},
                    {name: '邵阳市', val: 'shaoyang', row_icon: 'el-icon-water-cup'},
                ],
                flag: {
                    disabled: true,
                    readonly: true,
                    loading: true,
                },
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