<!--suppress ALL -->
<template>
    <div class="demo-layout">
        <demo-row title="基本用法，一共24格">
            <pl-row>
                <pl-col span="24">
                    <div class="ct-cls">col-24</div>
                </pl-col>
            </pl-row>
            <pl-row>
                <pl-col span="12">
                    <div class="ct-cls">col-12</div>
                </pl-col>
                <pl-col span="12">
                    <div class="ct-cls">col-12</div>
                </pl-col>
            </pl-row>
            <pl-row>
                <pl-col span="2">
                    <div class="ct-cls">col-2</div>
                </pl-col>
                <pl-col span="4">
                    <div class="ct-cls">col-4</div>
                </pl-col>
                <pl-col span="6">
                    <div class="ct-cls">col-6</div>
                </pl-col>
                <pl-col span="8">
                    <div class="ct-cls">col-8</div>
                </pl-col>
                <pl-col span="4">
                    <div class="ct-cls">col-4</div>
                </pl-col>
            </pl-row>
        </demo-row>
        <demo-row title="列间隔gutter(单位px)">
            <pl-row gutter="16">
                <pl-col span="2">
                    <div class="ct-cls">col-2</div>
                </pl-col>
                <pl-col span="4">
                    <div class="ct-cls">col-4</div>
                </pl-col>
                <pl-col span="6">
                    <div class="ct-cls">col-6</div>
                </pl-col>
                <pl-col span="8">
                    <div class="ct-cls">col-8</div>
                </pl-col>
                <pl-col span="4">
                    <div class="ct-cls">col-4</div>
                </pl-col>
            </pl-row>
        </demo-row>

        <demo-row title="flex布局的栅格">
            <demo-row-item>
                <pl-row type="flex" align="middle">
                    <pl-col span="2">
                        <div class="ct-cls">col-2</div>
                    </pl-col>
                    <pl-col span="4">
                        <div class="ct-cls" style="height: 48px">col-4</div>
                    </pl-col>
                    <pl-col span="6">
                        <div class="ct-cls" style="height: 56px">col-6</div>
                    </pl-col>
                    <pl-col span="8">
                        <div class="ct-cls" style="height: 48px">col-8</div>
                    </pl-col>
                    <pl-col span="4">
                        <div class="ct-cls" style="height: 36px">col-4</div>
                    </pl-col>
                </pl-row>
            </demo-row-item>
            <demo-row-item>
                <pl-row type="flex" justify="space-between">
                    <pl-col span="2">
                        <div class="ct-cls">col-2</div>
                    </pl-col>
                    <pl-col span="4">
                        <div class="ct-cls" style="height: 48px">col-4</div>
                    </pl-col>
                    <pl-col span="6">
                        <div class="ct-cls" style="height: 56px">col-6</div>
                    </pl-col>
                    <pl-col span="4">
                        <div class="ct-cls">col-4</div>
                    </pl-col>
                </pl-row>
            </demo-row-item>
            <demo-row-item>
                <pl-row type="flex" justify="start">
                    <pl-col span="2">
                        <div class="ct-cls">col-2</div>
                    </pl-col>
                    <pl-col span="4">
                        <div class="ct-cls" style="height: 48px">col-4</div>
                    </pl-col>
                    <pl-col span="6">
                        <div class="ct-cls" style="height: 56px">col-6</div>
                    </pl-col>
                    <pl-col span="4">
                        <div class="ct-cls">col-4</div>
                    </pl-col>
                </pl-row>
            </demo-row-item>
            <demo-row-item>
                <pl-row type="flex" align="bottom" justify="end">
                    <pl-col span="2">
                        <div class="ct-cls">col-2</div>
                    </pl-col>
                    <pl-col span="4">
                        <div class="ct-cls" style="height: 48px">col-4</div>
                    </pl-col>
                    <pl-col span="6">
                        <div class="ct-cls" style="height: 56px">col-6</div>
                    </pl-col>
                    <pl-col span="4">
                        <div class="ct-cls">col-4</div>
                    </pl-col>
                </pl-row>
            </demo-row-item>
        </demo-row>
        <demo-row title="当使用flex布局时，可以使用order属性排序">
            <pl-row type="flex" align="middle" gutter="16">
                <pl-col span="2" order="1">
                    <div class="ct-cls">col-2</div>
                </pl-col>
                <pl-col span="4" order="2">
                    <div class="ct-cls">col-4</div>
                </pl-col>
                <pl-col span="6" order="4">
                    <div class="ct-cls">col-6</div>
                </pl-col>
                <pl-col span="8" order="3">
                    <div class="ct-cls">col-8</div>
                </pl-col>
                <pl-col span="4" order="5">
                    <div class="ct-cls">col-4</div>
                </pl-col>
            </pl-row>
        </demo-row>

        <demo-row title="当使用浮动布局时，可以使用pull以及push属性排序">
            <pl-row gutter="16">
                <pl-col span="2" push="10" :xs="xs[0]">
                    <div class="ct-cls">col-2</div>
                </pl-col>
                <pl-col span="4" pull="2" :xs="xs[1]">
                    <div class="ct-cls">col-4</div>
                </pl-col>
                <pl-col span="6" pull="2" :xs="xs[2]">
                    <div class="ct-cls">col-6</div>
                </pl-col>
            </pl-row>
        </demo-row>

        <demo-row title="响应式布局，可以用chrome把客户端变成移动端模式，当为普通模式时，分别占2,4,6格，当为移动端时，分别占4,8,12格">
            <pl-row gutter="16">
                <pl-col span="2" :xs="xs[0]">
                    <div class="ct-cls">col-2</div>
                </pl-col>
                <pl-col span="4" :xs="xs[1]">
                    <div class="ct-cls">col-4</div>
                </pl-col>
                <pl-col span="6" :xs="xs[2]">
                    <div class="ct-cls">col-6</div>
                </pl-col>
            </pl-row>
        </demo-row>
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

    @include themify {
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
