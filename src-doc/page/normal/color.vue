<template>
    <div class="demo-color">
        <demo-row title="主题色">
            <div class="pl-block" v-for="(item) in status" :class="`pl-block-status-${item.status}`">
                {{item.name}}
            </div>
        </demo-row>
        <demo-row title="主题在线切换">
            <div class="pl-block" v-for="item in ['default','blue','violet']" :class="`pl-block-${item}`" @click="()=>$plain.changeTheme(item)">
                {{item}}
            </div>
        </demo-row>
        <demo-row title="局部主题">
            <demo-line v-for="theme in ['default','blue','violet']" :class="theme?`theme-${theme}`:''" :title="theme" :key="theme">
                <div class="pl-block" v-for="(item) in status" :class="`pl-block-status-${item.status}`">
                    {{item.name}}
                </div>
            </demo-line>
        </demo-row>
    </div>
</template>

<script>
    export default {
        name: "color",
        data() {
            return {
                status: [
                    {name: '基础', status: 'primary'},
                    {name: '成功', status: 'success'},
                    {name: '警告', status: 'warn'},
                    {name: '错误', status: 'error'},
                    {name: '帮助', status: 'info'},
                ]
            }
        },
    }
</script>

<style lang="scss">
    @include theme {
        .pl-block {
            height: 40px;
            width: 90px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            color: white;
            margin-right: 16px;

            @include statusMixin(block) {
                background-color: $value;
                box-shadow: 0 16px 46px 0 rgba($value, 0.5);
            }

            &.pl-block-default {
                cursor: pointer;
                background-color: #12b4a5;
                box-shadow: 0 16px 46px 0 rgba(#12b4a5, 0.5);
            }

            &.pl-block-blue {
                cursor: pointer;
                background-color: #3E97EC;
                box-shadow: 0 16px 46px 0 rgba(#3E97EC, 0.5);
            }

            &.pl-block-violet {
                cursor: pointer;
                background-color: blueviolet;
                box-shadow: 0 16px 46px 0 rgba(blueviolet, 0.5);
            }
        }
    }
</style>