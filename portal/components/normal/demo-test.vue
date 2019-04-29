<template>
    <div class="demo-test">
        <im-demo-row title="测试函数绑定">
            <im-radio :value="disabled.insertable" label="insertable"/>
            <im-radio :value="disabled.updateable" label="updateable"/>
        </im-demo-row>
        <im-demo-row>
            <im-radio v-model="option.insertable" label="active1"/>
            <im-radio v-model="option.updatebale" label="active2"/>
        </im-demo-row>
        <im-demo-row>
            {{message}}
        </im-demo-row>
    </div>
</template>

<script>

    import Vue from 'vue'

    const component = {
        data() {
            return {
                a: 1,
                b: 2,
                c: 3,
            }
        },
    }

    class Option extends Vue {
        constructor(_option) {
            super(component)
            Object.assign(this, _option)
        }
    }

    export default {
        name: "demo-test",
        data() {
            return {
                message:'bearer 4a9b32f4-3536-444b-a5ac-1d9cf9daa026↵2019-04-29 15:23:47: \'Cannot read property \'style\' of null   ↵↵    at renderUI (http://localhost:8080/static/lib/ue/ueditor.all.js:32753:22)↵<<<↵>>>page=knowledge-form↵==>2019-04-29 15:23:54: \'Cannot read property \'removeEventListener\' of undefined   ↵    at Object.un (http://localhost:8080/static/lib/ue/ueditor.all.js:3015:21)↵<<<↵>>>page=knowledge-form↵==>2019-04-29 15:23:55: \'Cannot read property \'removeEventListener\' of undefined   ↵    at Object.un (http://localhost:8080/static/lib/ue/ueditor.all.js:3015:21)↵<<<↵>>>page=knowledge-form↵==>2019-04-29 15:23:55: \'Cannot read property \'removeEventListener\' of undefined   ↵    at Object.un (http://localhost:8080/static/lib/ue/ueditor.all.js:3015:21)↵<<<↵>>>page=knowledge-form↵==>2019-04-29 15:23:55: \'Cannot read property \'removeEventListener\' of undefined   ↵    at Object.un (http://localhost:8080/static/lib/ue/ueditor.all.js:3015:21)↵<<<↵>>>page=knowledge-form↵==>2019-04-29 15:23:59: \'Cannot read property \'removeEventListener\' of undefined   ↵    at Object.un (http://localhost:8080/static/lib/ue/ueditor.all.js:3015:21)↵<<<↵>>>page=knowledge-form↵==>2019-04-29 15:23:59: \'Cannot read property \'removeEventListener\' of undefined   ↵    at Object.un (http://localhost:8080/static/lib/ue/ueditor.all.js:3015:21)↵<<<↵>>>page=knowledge-form↵==>2019-04-29 15:23:59: \'Cannot read property \'removeEventListener\' of undefined   ↵    at Object.un (http://localhost:8080/static/lib/ue/ueditor.all.js:3015:21)↵<<<↵>>>page=knowledge-form↵==>2019-04-29 15:24:00: \'Cannot read property \'removeEventListener\' of undefined   ↵    at Object.un (http://localhost:8080/static/lib/ue/ueditor.all.js:3015:21)↵<<<↵>>>page=knowledge-form↵==>2019-04-29 15:24:00: \'Cannot read property \'removeEventListener\' of undefined   ↵    at Object.un (http://localhost:8080/static/lib/ue/ueditor.all.js:3015:21)↵<<<↵>>>page=knowledge-form↵==>2019-04-29 15:24:00: \'Cannot read property \'removeEventListener\' of undefined   ↵    at Object.un (http://localhost:8080/static/lib/ue/ueditor.all.js:3015:21)↵<<<↵>>>page=knowledge-form↵==>2019-04-29 15:24:07: \'Cannot read property \'removeEventListener\' of undefined   ↵    at Object.un (http://localhost:8080/static/lib/ue/ueditor.all.js:3015:21)↵<<<↵>>>page=knowledge-form↵==>2019-04-29 15:24:16: \'Cannot read property \'removeEventListener\' of undefined   ↵    at Object.un (http://localhost:8080/static/lib/ue/ueditor.all.js:3015:21)↵<<<↵',
                active1: true,
                active2: false,
                option: {
                    insertable: true,
                    updatebale: false,
                    enable() {
                        return {
                            insertable: this.option.insertable,
                            updateable: this.option.updatebale,
                        }
                    },
                }
            }
        },
        computed: {
            disabled() {
                console.log('disabled calculate')
                const ret = this.option.enable.apply(this)
                return ret
            },
        },
        mounted() {
            const a = new Option({
                a: true,
            })
            console.log(a)
        },
    }
</script>

<style lang="scss">

</style>