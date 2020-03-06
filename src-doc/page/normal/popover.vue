<template>
    <div class="demo-popover">
        <demo-row title="基本用法">
            <pl-popover ref="popover">
                <pl-button label="reference"/>
                <div slot="popper" style="height: 300px">
                    这里是popover的内容
                </div>
            </pl-popover>
        </demo-row>

        <demo-row title="不使用scroll滚动条，height，width为null，sizeEqual为false">
            <pl-popover :sizeEqual="false">
                <pl-button label="reference"/>
                <div slot="popper" style="height: 300px;width: 300px">
                    <p>这里是popover的内容</p>
                </div>
            </pl-popover>
        </demo-row>

        <demo-row title="设置滚动条属性">
            <pl-popover :scrollProps="{scrollbarColor: 'rgba(0,0,00,0.5)',scrollX:true}">
                <pl-button label="reference"/>
                <div slot="popper" style="height: 300px;width: 300px">
                    这里是popover的内容
                </div>
            </pl-popover>
        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-popover",
        props: {},
        data() {
            return {
                list: [1, 2, 3]
            }
        },
        methods: {},
    }
</script>

<style lang="scss">
</style>