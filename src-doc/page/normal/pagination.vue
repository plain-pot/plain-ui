<template>
    <div class="pagination">
        <demo-row title="基本用法">
            <pl-pagination pageSize="20" total="100"/>
        </demo-row>

        <demo-row title="大小尺寸">
            <demo-line title="large">
                <pl-pagination pageSize="20" total="100" size="large"/>
            </demo-line>
            <demo-line title="normal">
                <pl-pagination pageSize="20" total="100" size="normal"/>
            </demo-line>
            <demo-line title="large">
                <pl-pagination pageSize="20" total="100" size="mini"/>
            </demo-line>
        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "pagination",
        props: {},
        data() {
            return {}
        },
        methods: {},
    }
</script>

<style lang="scss">
</style>