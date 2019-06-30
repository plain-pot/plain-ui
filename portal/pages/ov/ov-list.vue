<template>
    <div class="ov-list">
        <plain-table :option="option">
            <pl-tc-input title="显示值" field="label" width="120px"/>
            <pl-tc-input title="代码" field="code" width="120px"/>
            <pl-tc-input title="类型" field="type" width="120px"/>
            <pl-tc-object title="父选项" field="parentLabel" :prop="{option:parentOption,map:{parentId:'id',parentLabel:'label'}}" width="120px"/>
            <pl-tc-radio title="是否有效" field="valid"/>
            <pl-tc-input title="备注" field="comment"/>
        </plain-table>
    </div>
</template>

<script>
    export default {
        name: "ov-list",
        data() {
            return {
                option: new PlainOption({
                    context: this,
                    module: 'lov',
                    defaultNewRow: {valid: 'Y'},
                }),
                parentOption: new PlainOption({
                    context: this,
                    module: 'lov',
                    renderFunc(h) {
                        return (
                            <div>
                                <pl-tc-column title="显示值" field="label" width="120px"/>
                                <pl-tc-column title="代码" field="code" width="120px"/>
                                <pl-tc-column title="类型" field="type" width="120px"/>
                                <pl-tc-column title="父选项" field="parentLabel" width="120px"/>
                                <pl-tc-column title="备注" field="comment" width="120px"/>
                            </div>
                        );
                    }
                })
            }
        },
    }
</script>

<style lang="scss">

</style>
