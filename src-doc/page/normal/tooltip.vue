<template>
    <div class="tooltip">
        <demo-row title="基本用法">
            <pl-tooltip text="这个是tooltip文本"/>
        </demo-row>
        <demo-row title="综合测试">
            <demo-line>
                <pl-input v-model="tooltipText"/>
                <pl-tooltip
                        ref="tooltip"
                        :text="tooltipText"
                        :trigger="trigger"
                        :animate="animate"
                        :theme="theme"
                />
            </demo-line>
            <demo-line title="trigger">
                <pl-radio-group v-model="trigger">
                    <pl-radio v-for="item in ['click','hover','manual','focus','always']" :key="item" :label="item" :val="item"/>
                </pl-radio-group>
                <pl-button :label="$refs.tooltip.isShow.value?'hide':'show'" v-if="trigger === 'manual'" @click="$refs.tooltip.isShow.value?$refs.tooltip.methods.hide():$refs.tooltip.methods.show()"/>
            </demo-line>
            <demo-line title="animate">
                <pl-radio-group v-model="animate">
                    <pl-radio v-for="item in ['fade','drop','scale']" :key="item" :label="item" :val="item"/>
                </pl-radio-group>
            </demo-line>
            <demo-line title="theme">
                <pl-radio-group v-model="theme">
                    <pl-radio v-for="item in ['dark','light']" :key="item" :label="item" :val="item"/>
                </pl-radio-group>
            </demo-line>
        </demo-row>
        <demo-row title="showOverflowTooltip">
            <pl-input textarea v-model="longText"/>
            <pl-tooltip :text="longText" showOverflowTooltip style="width: 100px"/>
            <pl-tooltip :text="longText" showOverflowTooltip/>
        </demo-row>

        <demo-row title="指令调用">
            <pl-icon icon="el-icon-question" v-tooltip="'指令调用'"/>
        </demo-row>

        <demo-row title="指令调用：额外参数">
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
                tooltipText: 'tooltip的文本',
                trigger: 'always',
                animate: 'fade',
                theme: 'dark',
                longText: '这个是非常长非常长的溢出文本',

                direction: 'top',
                align: 'center',
            }
        },
        methods: {},
    }
</script>

<style lang="scss">
</style>