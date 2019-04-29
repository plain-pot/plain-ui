<template>
    <div class="demo-dialog-service">
        <im-demo-row title="基本用法">
            <im-button label="basically" @click="$dialog.show('Hello world')"/>
        </im-demo-row>
        <im-demo-row title="消息类型">
            <im-button label="info" box-color="primary" @click="$dialog.show('Hello world',{type:'info'})"/>
            <im-button label="success" box-color="success" @click="$dialog.show('Hello world',{type:'success'})"/>
            <im-button label="warn" box-color="warn" @click="$dialog.show('Hello world',{type:'warn'})"/>
            <im-button label="error" box-color="error" @click="$dialog.show('Hello world',{type:'error'})"/>
            <im-button label="help" box-color="info" @click="$dialog.show('Hello world',{type:'help'})"/>
        </im-demo-row>
        <im-demo-row title="标题">
            <im-button label="basically" @click="$dialog.show('Hello world',{title:'this is title'})"/>
        </im-demo-row>
        <im-demo-row title="形状">
            <im-button label="fillet" @click="$dialog.show('Hello world',{shape:'fillet'})"/>
            <im-button label="none" @click="$dialog.show('Hello world',{shape:'none'})"/>
        </im-demo-row>
        <im-demo-row title="遮罩色">
            <im-button label="shadowColor" @click="$dialog.show('Hello world',{shadowColor:'transparent'})"/>
        </im-demo-row>
        <im-demo-row title="禁用在点击遮罩时关闭对话框">
            <im-button label="disabledHideOnClickShadow" @click="$dialog.show('Hello world',{disabledHideOnClickShadow:true})"/>
        </im-demo-row>
        <im-demo-row title="显隐动画">
            <im-button label="transition" @click="$dialog.show('Hello world',{transition:'pl-dialog-scale'})"/>
        </im-demo-row>
        <im-demo-row title="高度以及宽度">
            <im-button label="宽高" @click="$dialog.show('Hello world',{height:100,width:400})"/>
        </im-demo-row>
        <im-demo-row title="最大化">
            <im-button label="最大化" @click="$dialog.show('Hello world',{full:true})"/>
        </im-demo-row>
        <im-demo-row title="确认以及取消按钮">
            <im-button label="确认以及取消按钮" @click="$dialog.show('Hello world',{confirmButton:true,cancelButton:true,onConfirm:()=>log('confirm'),onCancel:()=>log('cancel')})"/>
        </im-demo-row>
        <im-demo-row title="无关闭按钮">
            <im-button label="无关闭按钮" @click="$dialog.show('Hello world',{noClose:true})"/>
        </im-demo-row>
        <im-demo-row title="给对话框添加class，以控制样式">
            <im-button label="dialogClass" @click="$dialog.show('Hello world',{dialogClass:'dialogClass'})"/>
        </im-demo-row>
        <im-demo-row title="横向以及纵向位置">
            <im-button-group>
                <im-button box-type="line" label="vertical"/>
                <im-button label="start" @click="vertical = 'start'" :active="vertical === 'start'"/>
                <im-button label="center" @click="vertical = 'center'" :active="vertical === 'center'"/>
                <im-button label="end" @click="vertical = 'end'" :active="vertical === 'end'"/>
            </im-button-group>
            <im-button-group>
                <im-button box-type="line" label="horizontal"/>
                <im-button label="start" @click="horizontal = 'start'" :active="horizontal === 'start'"/>
                <im-button label="center" @click="horizontal = 'center'" :active="horizontal === 'center'"/>
                <im-button label="end" @click="horizontal = 'end'" :active="horizontal === 'end'"/>
            </im-button-group>
            <im-button label="position" @click="$dialog.show('Hello world',{top:0,horizontal,vertical})"/>
        </im-demo-row>
        <im-demo-row title="可最大化">
            <im-button label="max" @click="$dialog.show('Hello world',{max:true})"/>
        </im-demo-row>
        <im-demo-row title="调整位置">
            <im-button label="max" @click="$dialog.show('Hello world',{top:200,left:200,})"/>
        </im-demo-row>
        <im-demo-row title="隐藏头部栏以及底部栏">
            <im-button label="hide head and foot" @click="$dialog.show('Hello world',{noHeader:true,noFooter:true})"/>
        </im-demo-row>
        <im-demo-row title="使用渲染函数自定义渲染内容">
            <im-button label="hide head and foot" @click="customRender"/>
            <im-input v-model="input"/>
        </im-demo-row>
        <im-demo-row title="以option的形式调用">
            <im-button label="option param" @click="$dialog.show({message:'Hello world',noHeader:true,noFooter:true})"/>
        </im-demo-row>
        <im-demo-row title="输入对话框">
            <im-button label="input dialog" @click="$dialog.show({message:'Hello world',editType:'input',onConfirm:val=>$message.show(val),confirmButton:true,cancelButton:true})"/>
        </im-demo-row>
        <im-demo-row title="文本域对话框">
            <im-button label="textarea dialog"
                       @click="$dialog.show({message:'Hello world',editType:'textarea',onConfirm:val=>$message.show(val),confirmButton:true,cancelButton:true,width:'500px',height:'300px',editReadonly:true})"/>
        </im-demo-row>
    </div>
</template>

<script>
    import TestVuex from "../other/test-vuex";

    export default {
        name: "demo-dialog-service",
        components: {TestVuex},
        data() {
            return {
                vertical: 'center',
                horizontal: 'center',
                input: '自定义渲染内容???',
            }
        },
        methods: {
            customRender() {
                this.$dialog.show({
                    render: () => {
                        return (
                            <div>
                                <im-button label="show dialog" onClick={() => this.$dialog.show('hello world')}/>
                                <im-input value={this.input} onInput={e => this.input = e} long/>
                                <test-vuex/>
                            </div>
                        )
                    },
                })
            },
        }
    }
</script>

<style lang="scss">

</style>