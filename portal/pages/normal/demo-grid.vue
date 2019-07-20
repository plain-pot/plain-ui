<!--suppress ALL -->
<template>
    <div class="demo-layout">
        <im-demo-row title="基本用法，一共24格">
            <im-row>
                <im-col span="24">
                    <div class="ct-cls">col-24</div>
                </im-col>
            </im-row>
            <im-row>
                <im-col span="12">
                    <div class="ct-cls">col-12</div>
                </im-col>
                <im-col span="12">
                    <div class="ct-cls">col-12</div>
                </im-col>
            </im-row>
            <im-row>
                <im-col span="2">
                    <div class="ct-cls">col-2</div>
                </im-col>
                <im-col span="4">
                    <div class="ct-cls">col-4</div>
                </im-col>
                <im-col span="6">
                    <div class="ct-cls">col-6</div>
                </im-col>
                <im-col span="8">
                    <div class="ct-cls">col-8</div>
                </im-col>
                <im-col span="4">
                    <div class="ct-cls">col-4</div>
                </im-col>
            </im-row>
        </im-demo-row>
        <im-demo-row title="列间隔gutter(单位px)">
            <im-row gutter="16">
                <im-col span="2">
                    <div class="ct-cls">col-2</div>
                </im-col>
                <im-col span="4">
                    <div class="ct-cls">col-4</div>
                </im-col>
                <im-col span="6">
                    <div class="ct-cls">col-6</div>
                </im-col>
                <im-col span="8">
                    <div class="ct-cls">col-8</div>
                </im-col>
                <im-col span="4">
                    <div class="ct-cls">col-4</div>
                </im-col>
            </im-row>
        </im-demo-row>

        <im-demo-row title="flex布局的栅格">
            <im-demo-row-item>
                <im-row type="flex" align="middle">
                    <im-col span="2">
                        <div class="ct-cls">col-2</div>
                    </im-col>
                    <im-col span="4">
                        <div class="ct-cls" style="height: 48px">col-4</div>
                    </im-col>
                    <im-col span="6">
                        <div class="ct-cls" style="height: 56px">col-6</div>
                    </im-col>
                    <im-col span="8">
                        <div class="ct-cls" style="height: 48px">col-8</div>
                    </im-col>
                    <im-col span="4">
                        <div class="ct-cls" style="height: 36px">col-4</div>
                    </im-col>
                </im-row>
            </im-demo-row-item>
            <im-demo-row-item>
                <im-row type="flex" justify="space-between">
                    <im-col span="2">
                        <div class="ct-cls">col-2</div>
                    </im-col>
                    <im-col span="4">
                        <div class="ct-cls" style="height: 48px">col-4</div>
                    </im-col>
                    <im-col span="6">
                        <div class="ct-cls" style="height: 56px">col-6</div>
                    </im-col>
                    <im-col span="4">
                        <div class="ct-cls">col-4</div>
                    </im-col>
                </im-row>
            </im-demo-row-item>
            <im-demo-row-item>
                <im-row type="flex" justify="start">
                    <im-col span="2">
                        <div class="ct-cls">col-2</div>
                    </im-col>
                    <im-col span="4">
                        <div class="ct-cls" style="height: 48px">col-4</div>
                    </im-col>
                    <im-col span="6">
                        <div class="ct-cls" style="height: 56px">col-6</div>
                    </im-col>
                    <im-col span="4">
                        <div class="ct-cls">col-4</div>
                    </im-col>
                </im-row>
            </im-demo-row-item>
            <im-demo-row-item>
                <im-row type="flex" align="bottom" justify="end">
                    <im-col span="2">
                        <div class="ct-cls">col-2</div>
                    </im-col>
                    <im-col span="4">
                        <div class="ct-cls" style="height: 48px">col-4</div>
                    </im-col>
                    <im-col span="6">
                        <div class="ct-cls" style="height: 56px">col-6</div>
                    </im-col>
                    <im-col span="4">
                        <div class="ct-cls">col-4</div>
                    </im-col>
                </im-row>
            </im-demo-row-item>
        </im-demo-row>
        <im-demo-row title="当使用flex布局时，可以使用order属性排序">
            <im-row type="flex" align="middle" gutter="16">
                <im-col span="2" order="1">
                    <div class="ct-cls">col-2</div>
                </im-col>
                <im-col span="4" order="2">
                    <div class="ct-cls">col-4</div>
                </im-col>
                <im-col span="6" order="4">
                    <div class="ct-cls">col-6</div>
                </im-col>
                <im-col span="8" order="3">
                    <div class="ct-cls">col-8</div>
                </im-col>
                <im-col span="4" order="5">
                    <div class="ct-cls">col-4</div>
                </im-col>
            </im-row>
        </im-demo-row>

        <im-demo-row title="当使用浮动布局时，可以使用pull以及push属性排序">
            <im-row gutter="16">
                <im-col span="2" push="10" :xs="xs[0]">
                    <div class="ct-cls">col-2</div>
                </im-col>
                <im-col span="4" pull="2" :xs="xs[1]">
                    <div class="ct-cls">col-4</div>
                </im-col>
                <im-col span="6" pull="2" :xs="xs[2]">
                    <div class="ct-cls">col-6</div>
                </im-col>
            </im-row>
        </im-demo-row>

        <im-demo-row title="响应式布局，可以用chrome把客户端变成移动端模式，当为普通模式时，分别占2,4,6格，当为移动端时，分别占4,8,12格">
            <im-row gutter="16">
                <im-col span="2" :xs="xs[0]">
                    <div class="ct-cls">col-2</div>
                </im-col>
                <im-col span="4" :xs="xs[1]">
                    <div class="ct-cls">col-4</div>
                </im-col>
                <im-col span="6" :xs="xs[2]">
                    <div class="ct-cls">col-6</div>
                </im-col>
            </im-row>
        </im-demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-layout",
        data() {
            return {
                xs: [4, 8, 12, 8]
            }
        },
    }
</script>

<style lang="scss">
    .demo-layout {
        .demo-row .demo-row-body > * {
            margin-right: 0 !important;
        }
    }

    @include themeWrap {
        .ct-cls {
            background-color: #f2f2f2;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 2px;
        }

        .pl-row {
            .pl-col:nth-child(odd) {
                .ct-cls {
                    background-color: #e2e2e2;
                }
            }
        }
    }
</style>
