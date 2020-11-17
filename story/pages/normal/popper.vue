<template>
    <div class="demo-popper">
        <demo-row title="普通文本">
            <pl-popper v-model="val[0]"
                       title="标题"
                       trigger="click">
                <div>
                    这个是reference的内容
                </div>
                <template #popper>
                    <p>this is popper content 111</p>
                    <p>this is popper content 222</p>
                </template>
            </pl-popper>
            <pl-checkbox v-model="val[0]" label="show"/>
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
            }
        },
    }
</script>

<style lang="scss">
    .demo-group {
    }
</style>