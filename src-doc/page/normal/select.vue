<template>
    <div class="demo-select">
        <demo-row title="基本用法">
            <pl-select :data="list" labelKey="name" valueKey="val" v-model="val[0]"/>
            <span>{{val[0]}}</span>
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
            <span>{{val[6]}}</span>
        </demo-row>

        <demo-row title="multipleLimit:3，最多可以选择3个元素">
            <pl-select :data="list" labelKey="name" valueKey="val" v-model="val[7]" :multipleLimit="3" multiple/>
            <span>{{val[7]}}</span>
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
                    {name: '中年节', val: 'ZhongNian'},
                    {name: '国庆节', val: 'GuoQing'},
                    {name: '中秋节', val: 'ZhongQiu'},
                    {name: '劳动节', val: 'LaoDong'},
                    {name: '圣诞节', val: 'ShengDan'},
                    {name: '儿童节', val: 'ErTong'},
                    {name: '妇女节', val: 'FuNv'},
                    {name: '教师节', val: 'JiaoShi'},
                    {name: '清明节', val: 'QingMing'},
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