<template>
    <div class="notice-service">
        <demo-row title="基本用法">
            <pl-button label="notice" @click="$notice('保存成功！')"/>
        </demo-row>
        <demo-row title="状态">
            <pl-button v-for="item in status" :key="item" :status="item" :label="item" @click="$notice[item]('正在操作中！')"/>
            <pl-button label="无状态" @click="$notice('正在操作中！',{status:null})"/>
        </demo-row>
        <demo-row title="关闭事件">
            <pl-button label="不自动关闭" @click="$notice('保存成功！',{time:null})"/>
            <pl-button label="1s" @click="$notice('保存成功！',{time:1000})"/>
            <pl-button label="2s" @click="$notice('保存成功！',{time:2000})"/>
        </demo-row>
        <demo-row title="监听点击事件">
            <pl-button label="notice" @click="handleClick"/>
        </demo-row>
        <demo-row title="自定义内容">
            <pl-button label="custom render" @click="customRender"/>
            <pl-input v-model="val[0]"/>
        </demo-row>
        <demo-row title="位置">
            <pl-button label="top left" @click="$notice('正在操作中！',{vertical:'start',horizontal:'start'})"/>
            <pl-button label="top right" @click="$notice('正在操作中！',{vertical:'start',horizontal:'end'})"/>
            <pl-button label="bottom left" @click="$notice('正在操作中！',{vertical:'end',horizontal:'start'})"/>
            <pl-button label="bottom right" @click="$notice('正在操作中！',{vertical:'end',horizontal:'end'})"/>
        </demo-row>
    </div>
</template>

<script>
    import DemoMixins from "../../component/DemoMixins";

    export default {
        name: "notice-service",
        mixins: [DemoMixins],
        data() {
            return {
                val: {
                    0: null,
                },
            }
        },
        methods: {
            async handleClick() {
                let option = await this.$notice('点击事件', {
                    time: null,
                    noClose: true,
                    onClick: () => {
                        option.close()
                    }
                })
            },
            async customRender() {
                this.$notice({
                    render: () => {
                        return <pl-input value={this.val[0]} onInput={val => this.val[0] = val}/>
                    },
                    time: null,
                })
            },
        },
    }
</script>

<style lang="scss">
</style>