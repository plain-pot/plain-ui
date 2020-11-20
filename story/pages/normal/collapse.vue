<template>
    <div class="demo-collapse">
        <demo-row title="CollapseTransition">
            <pl-checkbox label="is show" v-model="isShow"/>
            <pl-collapse-transition>
                <div class="demo-collapse-block" v-if="isShow">
                    <p>this is collapse content</p>
                    <p>this is collapse content</p>
                    <p>this is collapse content</p>
                    <p>this is collapse content</p>
                    <p>this is collapse content</p>
                    <p>this is collapse content</p>
                    <p>this is collapse content</p>
                </div>
            </pl-collapse-transition>
        </demo-row>
        <demo-row title="Collapse">
            <pl-collapse title="折叠标题">
                <div style="font-size: 12px">
                    <ul>
                        <li>折叠内容</li>
                        <li>折叠内容</li>
                        <li>折叠内容</li>
                        <li>折叠内容</li>
                        <li>折叠内容</li>
                        <li>折叠内容</li>
                    </ul>
                </div>
            </pl-collapse>
        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "collapse",
        data() {
            return {
                isShow: true,
            }
        },
    }
</script>

<style lang="scss">
    .demo-collapse-block {
        width: 100%;
    }
</style>