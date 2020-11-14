<template>
    <div class="demo-tag">
        <demo-row title="基本用法">
            <pl-tag label="标签"/>
        </demo-row>

        <demo-row title="删除图标">
            <pl-tag label="标签" close @click="$message('click')" @close="$message.warn('close')"/>
        </demo-row>
        <demo-row title="插槽">
            <pl-tag label="标签" close>
                <pl-icon icon="el-icon-search"/>
                <span>标签</span>
            </pl-tag>
        </demo-row>

        <demo-row title="状态">
            <pl-tag v-for="item in ['primary','success','warn','error','info']" :key="item" :status="item" :label="item"/>
        </demo-row>

        <demo-row title="类型">
            <pl-tag label="标签" mode="fill"/>
            <pl-tag label="标签" mode="stroke"/>
            <pl-tag label="标签" mode="text"/>
        </demo-row>

        <demo-row title="大小">
            <pl-tag v-for="item in ['large','normal','mini']" :key="item" :label="item" :size="item"/>
        </demo-row>

        <demo-row title="禁用">
            <pl-tag label="标签" mode="fill" disabled/>
            <pl-tag label="标签" mode="stroke" disabled/>
            <pl-tag label="标签" mode="text" disabled/>
        </demo-row>

        <demo-row title="标签输入框">
            <pl-tag-input v-model="val[0]"/>
            {{val[0]}}
        </demo-row>

        <demo-row title="标签输入框：添加前、删除前校验">
            <pl-tag-input v-model="val[1]" :beforeAdd="beforeAdd" :beforeRemove="beforeRemove"/>
            {{val[1]}}
        </demo-row>

        <demo-row title="自定义标签内容与格式化显示值">
            <pl-tag-input v-model="val[2]" :formatValue="formatValue">
                <template v-slot="{item,index}">
                    <pl-tag :status="item.status" :disabled="item.disabled" close @close="val[2].splice(index,1)">
                        <pl-icon :icon="item.icon"/>
                        <span>{{item.name}}</span>
                    </pl-tag>
                </template>
            </pl-tag-input>
            {{val[2]}}
        </demo-row>

        <demo-row title="禁用与只读">
            <demo-line>
                <pl-toggle v-model="val[3]"/>
            </demo-line>
            <demo-line>
                <pl-tag-input v-model="val[4]" :disabled="val[3]"/>
                <pl-tag-input v-model="val[4]" :readonly="val[3]"/>
            </demo-line>
        </demo-row>


    </div>
</template>

<script>

    export default {
        name: "tag",
        props: {},
        data() {
            return {
                val: {
                    0: ['山脉', '海洋', '丛林'],
                    2: [
                        {name: '丛林', icon: 'el-icon-message-solid', disabled: false, status: 'primary',},
                        {name: '火山', icon: 'el-icon-s-ticket', disabled: false, status: 'error',},
                        {name: '山脉', icon: 'el-icon-s-comment', disabled: true, status: 'warn',},
                    ],
                    4: ['山脉', '海洋', '丛林'],
                },
            }
        },
        methods: {
            beforeAdd(str) {
                if (!/^\d+$/.test(str)) {
                    this.$message.error('请输入数字')
                    return Promise.reject()
                }
            },
            beforeRemove(item, index) {
                if (item > 100) {
                    this.$message.error('不能删除大于一百的选项')
                    return Promise.reject()
                }
            },
            formatValue(value) {
                return {
                    name: value,
                    icon: 'el-icon-info',
                    disabled: Math.random() < 0.3,
                    status: ['primary', 'success', 'warn', 'error', 'info'][Math.floor(Math.random() * 5)],
                }
            },
        },
    }
</script>

<style lang="scss">
</style>