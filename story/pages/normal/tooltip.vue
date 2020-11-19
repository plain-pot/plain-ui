<template>
    <div class="demo-tooltip">
        <demo-row title="基本用法">
            <pl-tooltip tooltip="Tooltip文本">
                <span>普通文本一定要用节点包裹</span>
            </pl-tooltip>
            <pl-tooltip tooltip="Tooltip文本">
                <pl-button>按钮</pl-button>
            </pl-tooltip>
        </demo-row>
        <demo-row title="主题">
            <pl-tooltip tooltip="Tooltip文本" theme="dark">
                <span>DARK</span>
            </pl-tooltip>
            <pl-tooltip tooltip="Tooltip文本" theme="light">
                <span>LIGHT</span>
            </pl-tooltip>
        </demo-row>
        <demo-row title="溢出时tooltip显示">
            <pl-input v-model="tooltipText"/>
            <pl-tooltip tooltip="Tooltip文本" :showWidth="100">
                {{tooltipText}}
            </pl-tooltip>
        </demo-row>
        <!-- <demo-row title="继承Popper属性">
             <pl-tooltip tooltip="Tooltip文本" transition="pl-transition-scale" @enterReference="()=>$message('enter reference')">
                 <span>普通文本一定要用节点包裹</span>
             </pl-tooltip>
         </demo-row>-->
        <demo-row title="指令调用">
            <span v-tooltip="'指令调用'">
                普通文本
            </span>
            <pl-button v-tooltip="'指令调用'">
                带有根节点的组件
            </pl-button>
            <pl-icon icon="el-icon-info" v-tooltip="'指令调用'"/>
        </demo-row>
        <demo-row title="指令调用：自定义参数">
            <demo-line style="margin-bottom: 40px">
                <pl-icon icon="el-icon-question" v-tooltip="{content:'指令调用',trigger:'always',placement:`${direction}-${align}`,theme:'light'}"/>
            </demo-line>

            <demo-line>
                <pl-icon icon="el-icon-question" v-tooltip="{content:'指令调用',trigger:'always',placement:`${direction}-${align}`,theme:'dark'}"/>
            </demo-line>

            <demo-line>
                <pl-radio-group v-model="direction">
                    <pl-radio v-for="item in ['top','bottom','left','right']" :key="item" :val="item" :label="item"/>
                </pl-radio-group>
            </demo-line>
            <demo-line>
                <pl-radio-group v-model="align">
                    <pl-radio v-for="item in ['start','center','end']" :key="item" :val="item" :label="item"/>
                </pl-radio-group>
            </demo-line>
        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "tooltip",
        data() {
            return {
                tooltipText: '文本长度溢出时tooltip显示文本',
                direction: 'top',
                align: 'center',
            }
        },
    }
</script>

<style lang="scss">

</style>