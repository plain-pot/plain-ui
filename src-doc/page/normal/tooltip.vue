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
                <pl-button :label="$refs.tooltip.isShow?'hide':'show'" v-if="trigger === 'manual'" @click="$refs.tooltip.isShow?$refs.tooltip.hide():$refs.tooltip.show()"/>
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
            }
        },
        methods: {},
    }
</script>

<style lang="scss">
</style>