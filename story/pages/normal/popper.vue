<template>
    <div class="demo-popper">
        <demo-row title="普通文本">
            <pl-popper>
                <div>this is popper content 111</div>

                <div>this is popper content 222</div>
                <div>this is popper content 333</div>
            </pl-popper>
        </demo-row>
        <demo-row title="唯一根节点组件">
            <pl-popper>
                <pl-button label="BUTTON"/>
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
            </pl-popper>
        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "popper"
    }
</script>

<style lang="scss">
    .demo-group {
    }
</style>