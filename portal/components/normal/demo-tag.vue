<template>
    <div class="demo-tag">
        <im-demo-row title="基本用法">
            <im-tag label="针织"/>
            <im-tag label="棉纺"/>
        </im-demo-row>
        <im-demo-row title="颜色">
            <im-tag v-for="item in colors" :key="item" :label="item" :color="item"/>
        </im-demo-row>
        <im-demo-row title="可删除">
            <im-tag v-for="item in colors" :key="item" :label="item" :color="item" close @click="$message.show('click:'+item)" @close="$message.show('close:'+item)"/>
        </im-demo-row>
        <im-demo-row title="大小尺寸">
            <im-tag v-for="item in ['large','default','small']" :key="item" :label="item" :size="item"/>
        </im-demo-row>
        <im-demo-row title="自定义渲染内容">
            <im-tag>
                <im-icon icon="pad-plus"/>
                <span>搜索</span>
                <im-icon icon="pad-search"/>
            </im-tag>
        </im-demo-row>
        <im-demo-row title="标签输入框">
            <im-tag-input :value="['北京','上海','广州']"/>
        </im-demo-row>

        <im-demo-row title="标签输入框">
            <im-tag-input :value="['北京','上海','广州']" icon="pad-search"/>
        </im-demo-row>

        <im-demo-row title="标签输入框颜色">
            <im-tag-input :value="['北京','上海','广州']" v-for="item in colors" :key="item" :color="item"/>
        </im-demo-row>

        <im-demo-row title="标签输入框，可输入">
            <im-tag-input v-model="val" input/>
            <im-tag-input v-model="val" input/>
        </im-demo-row>
        <im-demo-row title="标签输入框，设置宽度">
            <im-demo-row-item title="width=null">
                <im-tag-input :value="['北京','上海','广州']" input width/>
            </im-demo-row-item>
            <im-demo-row-item title="width=100%">
                <im-tag-input :value="['北京','上海','广州']" input width="100%"/>
            </im-demo-row-item>
        </im-demo-row>

        <im-demo-row title="标签输入框，自定义处理添加删除动作">
            <im-tag-input :value="val2" :onCreate="val=>val2.push('hello:'+val)" :onRemove="(item,index)=>val2.splice(index,1)" input/>
        </im-demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-tag",
        data() {
            return {
                val: ['北京', '上海', '广州'],
                val2: ['北京', '上海', '广州'],
                colors: ['primary', 'success', 'warn', 'error', 'info', 'disabled']
            }
        },
    }
</script>

<style lang="scss">

</style>