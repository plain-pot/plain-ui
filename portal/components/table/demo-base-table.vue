<template>
    <div class="demo-base-table">
        <im-base-table>
            <im-tc-group title="组一">
                <im-tc-column title="编号" field="id"/>
                <im-tc-column title="姓名" field="name"/>
                <im-tc-group title="组二">
                    <im-tc-column title="编号22" field="id"/>
                    <im-tc-column title="姓名22" field="name"/>
                </im-tc-group>
            </im-tc-group>
            <im-tc-group title="组三">
                <im-tc-column title="编号33" field="id"/>
                <im-tc-column title="姓名33" field="name"/>
            </im-tc-group>
        </im-base-table>
    </div>
</template>

<script>
    export default {
        name: "demo-base-table"
    }
</script>

<style lang="scss">

</style>