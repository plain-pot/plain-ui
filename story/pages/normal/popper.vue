<template>
    <div class="demo-popper">
        <demo-row title="基本用法">
            <pl-popper title="标题" message="消息文本">
                <span>默认hover显示</span>
            </pl-popper>
            <pl-popper title="标题" message="消息文本">
                <pl-button mode="text">默认hover显示</pl-button>
            </pl-popper>
            <pl-popper>
                <span>自定义内容</span>
                <template #title>
                    <span>自定义标题</span>
                    <pl-icon icon="el-icon-info"/>
                </template>
                <template #popper>
                    <p>popper content 111</p>
                    <p>popper content 222</p>
                </template>
            </pl-popper>
        </demo-row>

        <demo-row title="位置" class="demo-popper-placement">
            <demo-line v-for="direction in directions" :key="direction">
                <pl-button-group>
                    <pl-popper :placement="direction" :key="`${direction}-1`">
                        <pl-button :label="direction"/>
                        <template #popper>
                            <div class="demo-popper-content">
                                这里是popper的内容
                            </div>
                        </template>
                    </pl-popper>
                    <pl-popper :placement="`${direction}-${align}`" :key="align" v-for="align in aligns">
                        <pl-button :label="`${direction}-${align}`"/>
                        <template #popper>
                            <div class="demo-popper-content">
                                这里是popper的内容
                            </div>
                        </template>
                    </pl-popper>
                </pl-button-group>
            </demo-line>
        </demo-row>

        <demo-row title="唯一根节点组件">
            <pl-popper>
                <pl-button label="BUTTON"/>
                <template #popper>
                    this is popper content 222
                </template>
            </pl-popper>
        </demo-row>
        <demo-row title="多根节点组件">
            <pl-popper>
                <pl-checkbox-group>
                    <pl-checkbox label="全选" checkboxForAll/>
                    <pl-checkbox label="标签一" val="tag1"/>
                    <pl-checkbox label="标签二" val="tag2"/>
                    <pl-checkbox label="标签三" val="tag3"/>
                </pl-checkbox-group>
                <template #popper>
                    this is popper content 333
                </template>
            </pl-popper>
        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "popper",
        data() {
            return {
                val: {
                    0: true,
                },
                directions: ['top', 'bottom', 'left', 'right'],
                aligns: ['start', 'center', 'end'],
                animations: [
                    'pl-transition-fade',
                    'pl-transition-scale',
                    'pl-transition-scale-y',
                    'pl-transition-popper-drop',
                ],
            }
        },
    }
</script>

<style lang="scss">
    .demo-group {
    }

    .demo-popper-content {
        height: 55px;
    }
</style>