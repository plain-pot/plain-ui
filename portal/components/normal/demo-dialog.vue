<template>
    <div class="demo-dialog">
        <im-demo-row  title="基本用法">
            <im-button label="open" @click="val1=!val1" :active="val1"/>
            <im-dialog v-model="val1">
                一二三四五六七
                <im-button label="关闭" @click="val1 = false" full/>
                <im-demo-child title="i am child"/>
                <im-button label="hello world" @click="$dialog.show('Hello world')"/>
                <test-vuex/>
            </im-dialog>
        </im-demo-row >
        <im-demo-row  title="形状">
            <im-button label="fillet" @click="$refs.filletDialog.show()"/>
            <im-dialog ref="filletDialog" shape="fillet">fillet</im-dialog>
            <im-button label="none" @click="$refs.noneDialog.show()"/>
            <im-dialog ref="noneDialog" shape="none">none</im-dialog>
        </im-demo-row >
        <im-demo-row  title="类型">
            <im-button v-for="(type,index) in  types" :key="index" :label="type" @click="showDialog(index)"/>
            <im-dialog ref="typeDialogs" v-for="(type,index) in types" :type="type" :key="index+10">{{type}}</im-dialog>
        </im-demo-row >
        <im-demo-row  title="遮罩色">
            <im-button label="shadowColor" @click="$refs.shadowColorDialog.show()"/>
            <im-dialog ref="shadowColorDialog" shadow-color="black">shadowColor</im-dialog>
        </im-demo-row >
        <im-demo-row  title="禁用点击遮罩之后关闭动作">
            <im-button label="disabledHideOnClickShadow" @click="$refs.disabledHideOnClickShadowDialog.show()"/>
            <im-dialog ref="disabledHideOnClickShadowDialog" disabled-hide-on-click-shadow>disabledHideOnClickShadow</im-dialog>
        </im-demo-row >

        <im-demo-row  title="弹出动画">
            <im-button label="transition" @click="$refs.transitionDialog.show()"/>
            <im-dialog ref="transitionDialog" transition="pl-dialog-scale">transition</im-dialog>
        </im-demo-row >

        <im-demo-row  title="设定宽度以及高度">
            <im-button label="size" @click="$refs.sizeDialog.show()"/>
            <im-dialog ref="sizeDialog" width="500px" height="250px">width and height</im-dialog>
        </im-demo-row >
        <im-demo-row  title="设定最小宽度以及最小高度">
            <im-button label="size" @click="$refs.minSizeDialog.show()"/>
            <im-dialog ref="minSizeDialog" min-width="500px" min-height="250px">minWidth and minHeight</im-dialog>
        </im-demo-row >
        <im-demo-row  title="设定最大宽度以及最大高度">
            <im-button label="size" @click="$refs.maxSizeDialog.show()"/>
            <im-dialog ref="maxSizeDialog" max-width="500px" max-height="250px">
                maxWidth and maxHeight,maxWidth and maxHeight,maxWidth and maxHeight,maxWidth and maxHeight,maxWidth and maxHeight,
                maxWidth and maxHeight,maxWidth and maxHeight,maxWidth and maxHeight,maxWidth and maxHeight,maxWidth and maxHeight,
                maxWidth and maxHeight,maxWidth and maxHeight,maxWidth and maxHeight,maxWidth and maxHeight,maxWidth and maxHeight,
                maxWidth and maxHeight,maxWidth and maxHeight,maxWidth and maxHeight,maxWidth and maxHeight,maxWidth and maxHeight,
                maxWidth and maxHeight,maxWidth and maxHeight,maxWidth and maxHeight,maxWidth and maxHeight,maxWidth and maxHeight,
                maxWidth and maxHeight,maxWidth and maxHeight,maxWidth and maxHeight,maxWidth and maxHeight,maxWidth and maxHeight,
                maxWidth and maxHeight,maxWidth and maxHeight,maxWidth and maxHeight,maxWidth and maxHeight,maxWidth and maxHeight,
                maxWidth and maxHeight,maxWidth and maxHeight,maxWidth and maxHeight,maxWidth and maxHeight,maxWidth and maxHeight,
                maxWidth and maxHeight,maxWidth and maxHeight,maxWidth and maxHeight,maxWidth and maxHeight,maxWidth and maxHeight,
                maxWidth and maxHeight,maxWidth and maxHeight,maxWidth and maxHeight,maxWidth and maxHeight,maxWidth and maxHeight,
            </im-dialog>
        </im-demo-row >

        <im-demo-row  title="满屏">
            <im-button label="full" @click="$refs.fullDialog.show()"/>
            <im-dialog ref="fullDialog" full>full</im-dialog>
        </im-demo-row >

        <im-demo-row  title="确认以及取消按钮">
            <im-button label="button" @click="$refs.buttonDialog.show()"/>
            <im-dialog ref="buttonDialog" confirm-button cancel-button @confirm="$message.show('confrm')" @cancel="$message.show('cancel')">button</im-dialog>
        </im-demo-row >
        <im-demo-row  title="无关闭按钮">
            <im-button label="noClose" @click="$refs.noCloseDialog.show()"/>
            <im-dialog ref="noCloseDialog" no-close>noClose</im-dialog>
        </im-demo-row >
        <im-demo-row  title="给对话框添加class">
            <im-button label="dialogClass" @click="$refs.dialogClassDialog.show()"/>
            <im-dialog ref="dialogClassDialog" dialog-class="demo-class">dialogClass</im-dialog>
        </im-demo-row >
        <im-demo-row  title="横向以及纵向位置">
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
            <im-button label="position" @click="$refs.positionDialog.show()"/>
            <im-dialog ref="positionDialog" :vertical="vertical" :horizontal="horizontal">positionDialog</im-dialog>
        </im-demo-row >

        <im-demo-row  title="初始化的时候就初始化内容">
            <im-button label="initialized" @click="$refs.initializedDialog.show()"/>
            <im-dialog ref="initializedDialog" initialized>
                一二三四五六七
                <im-button label="关闭" @click="$refs.initializedDialog.hide()" full/>
                <im-demo-child/>
            </im-dialog>
        </im-demo-row >

        <im-demo-row  title="关闭的时候销毁内容">
            <im-button label="destroyOnHide" @click="$refs.destroyOnHideDialog.show()"/>
            <im-dialog ref="destroyOnHideDialog" destroy-on-hide>
                一二三四五六七
                <im-button label="关闭" @click="$refs.destroyOnHideDialog.hide()"/>
                <im-demo-child title="destroyOnHideDialog"/>
            </im-dialog>
        </im-demo-row >

        <im-demo-row  title="将dom移动到body下面">
            <im-button label="transfer-dom" @click="$refs.transferDomDialog.show()"/>
            <im-dialog ref="transferDomDialog" transfer-dom dialog-class="transferDomDialog">transfer-dom</im-dialog>
        </im-demo-row >
        <im-demo-row  title="可最大化">
            <im-button label="max" @click="$refs.maxDialog.show()"/>
            <im-dialog ref="maxDialog" max>max</im-dialog>
        </im-demo-row >
        <im-demo-row  title="去掉默认的内容padding">
            <im-button label="no-padding" @click="$refs.noPaddingDialog.show()"/>
            <im-dialog ref="noPaddingDialog" no-padding>no-padding</im-dialog>
        </im-demo-row >
        <im-demo-row  title="调整上下左右位置">
            <im-button label="left top right bottom" @click="$refs.positionAdjustDialog.show()"/>
            <im-dialog ref="positionAdjustDialog" top="100px" left="100px" bottom="0" right="0">
                <im-button-group>
                    <im-button>top:100px</im-button>
                    <im-button>left:100px</im-button>
                    <im-button>bottom:0</im-button>
                    <im-button>right:0</im-button>
                </im-button-group>
            </im-dialog>
        </im-demo-row >
        <im-demo-row  title="没有顶部标题以及底部栏">
            <im-button label="no head and not foot" @click="$refs.noHeadAndFootDialog.show()"/>
            <im-dialog ref="noHeadAndFootDialog" no-header no-footer>no head and not foot</im-dialog>
        </im-demo-row >
        <im-demo-row  title="底部栏对其方式">
            <im-button label="foot align" @click="$refs.footAlignDialog.show()"/>
            <im-dialog ref="footAlignDialog" foot-align="right" confirm-button cancel-button>foot align right</im-dialog>
        </im-demo-row >
        <!--<im-button label="open" @click="val1=!val1" :active="val1"/>
        <im-dialog v-model="val1" title="基本对话框" @confirm="log('confirm')" @cancel="log('cancel')">
            <div>
                demo-dialog1111
            </div>
            <im-button label="open" @click="val2=!val2" :active="val2"/>
            <im-dialog v-model="val2" :width="300" :height="156">
                demo-dialog2222
            </im-dialog>
        </im-dialog>-->
    </div>
</template>

<script>
    import TestVuex from "../other/test-vuex";
    export default {
        name: "demo-dialog",
        components: {TestVuex},
        data() {
            return {
                val1: false,
                val2: false,
                types: ['info', 'success', 'warn', 'error', 'help'],
                vertical: 'center',
                horizontal: 'center',
            }
        },
        methods: {
            showDialog(index) {
                console.log(index);
                this.$refs.typeDialogs[index].show()
            },
        }
    }
</script>

<style lang="scss">
    .test-box {
        height: 200px;
        width: 100%;
        background-color: #1076ca
    }

    .demo-class {
        background-color: black !important;
    }
</style>