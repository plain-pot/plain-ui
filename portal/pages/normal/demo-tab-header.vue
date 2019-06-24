<template>
    <div class="demo-tab-header">
        <im-demo-row :title="`基本用法,当前位置：${val[0]}`">
            <im-tab-header :data="data" v-model="val[0]"/>
        </im-demo-row>
        <im-demo-row title="删除图标">
            <im-tab-header :data="data" v-model="val[0]" clear-icon @close="({item})=>$message.show(item)"/>
        </im-demo-row>
        <im-demo-row title="监听删除事件以及右击删除">
            <im-tab-header :data="data" clear-icon @close="p_remove" @contextmenu="p_remove"/>
            <im-demo-row>
                <im-button-group>
                    <im-button label="add" @click="p_add"/>
                    <im-button label="substract" @click="p_substract"/>
                </im-button-group>
            </im-demo-row>
        </im-demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-tab-header",
        data() {
            return {
                val: {
                    0: 0,
                },
                data: ['客户基本信息', '相关联系人', '跟进记录']
            }
        },
        methods: {
            p_remove({item}) {
                this.data.splice(this.data.indexOf(item), 1)
            },
            p_add() {
                this.data.push(new Date().getTime())
            },
            p_substract() {
                this.data.pop()
            },
        }
    }
</script>

<style lang="scss">

</style>