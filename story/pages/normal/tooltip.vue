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
                普通节点
            </span>
            <pl-button v-tooltip="'指令调用'">
                普通节点
            </pl-button>
            <pl-icon icon="el-icon-info" v-tooltip="'指令调用'"/>
        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "tooltip",
        data() {
            return {
                tooltipText: '文本长度溢出时tooltip显示文本',
            }
        },
    }
</script>

<style lang="scss">

</style>