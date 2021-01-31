<template>
    <div class="demo-tab">
        <demo-row title="基本用法">
            <pl-tabs>
                <pl-tab title="用户管理">
                    <div style="height: 100px">
                        user management
                    </div>
                </pl-tab>
                <pl-tab title="配置管理">
                    <div style="height: 200px">
                        config management
                    </div>
                </pl-tab>
                <pl-tab title="数据集">
                    <div style="height: 300px">
                        data map
                    </div>
                </pl-tab>
            </pl-tabs>
        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-tab"
    }
</script>

<style lang="scss">

</style>