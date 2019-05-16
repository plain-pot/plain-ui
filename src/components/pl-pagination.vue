<template>
    <div class="pl-pagination">
        <div class="pl-pagination-left">
            <div class="pl-pagination-operation">
                <pl-icon icon="pad-left-circle-fill" class="pl-pagination-operate-icon"/>
                <div class="pl-pagination-operate-num-wrapper">
                    <template v-if="p_page-availablePage-1>0">
                        <div class="pl-pagination-operate-num" @click="p_clickPage(1)">1</div>
                        <pl-icon icon="pl-more-solid" class="pl-pagination-more-icon"/>
                    </template>
                    <div v-for="(item,index) in pages" :key="index"
                         class="pl-pagination-operate-num"
                         :class="{'pl-pagination-operate-num-active':item === p_page}"
                         @click="p_clickPage(item)">
                        {{item}}
                    </div>
                    <template v-if="p_page+availablePage+1<=totalPage">
                        <pl-icon icon="pl-more-solid" class="pl-pagination-more-icon"/>
                        <div class="pl-pagination-operate-num" @click="p_clickPage(totalPage)">{{totalPage}}</div>
                    </template>
                </div>
                <pl-icon icon="pad-right-circle-fill" class="pl-pagination-operate-icon"/>
            </div>
            <pl-icon icon="pl-refresh" class="pl-pagination-operate-icon pl-pagination-operate-refresh-icon" :loading="loading"/>
            <div class="pl-pagination-jump-wrapper">
                <span>前往</span>
                <pl-number no-controller :input="{width:40,placeholder:null,noClear:true}" :value="p_page" class="pl-pagination-jump-input"/>
                <span>页</span>
            </div>
            <pl-select
                    class="pl-pagination-select"
                    :data="p_sizeData"
                    label-key="label"
                    value-key="value"
                    v-model="p_size"
                    :input="inputBinding"
                    :clearable="false"
                    :height="120"/>
        </div>

        <div class="pl-pagination-right">
            当前显示:{{(p_page-1)*p_size+1}}-{{(p_page)*p_size}}，总共{{total}}条记录
        </div>
    </div>
</template>

<script>
    import PlIcon from "./pl-icon";
    import PlSelect from "./select/pl-select";
    import PlNumber from "./pl-number";

    export default {
        name: "pl-pagination",
        components: {PlNumber, PlSelect, PlIcon},
        props: {
            size: {type: Number, default: 10},
            page: {type: Number, default: 1},
            total: {type: Number, default: 0},
            sizeData: {type: Array, default: () => [10, 20, 50, 100]},
            availablePage: {type: Number, default: 3},
            loading: {type: Boolean},
        },
        data() {
            return {
                p_size: this.size || this.sizeData[0],
                p_page: this.page,
            }
        },
        watch: {
            size(val) {
                if (this.p_size !== val) this.p_size = val
            },
            p_size(val) {
                this.$emit('update:size', val)
            },
            page(val) {
                if (this.p_page !== val) this.p_page = val
            },
            p_page(val) {
                this.$emit('update:page', val)
            },
        },
        computed: {
            inputBinding() {
                return Object.assign({
                    noClear: true,
                    width: 90,
                    type: 'none',
                }, this.input)
            },
            totalPage() {
                return Math.ceil(this.total / this.p_size);
            },
            pages() {
                if (!this.p_size) return [];
                const ret = []

                let begin = this.p_page - this.availablePage
                let end = this.p_page + this.availablePage
                if (begin < 1) {
                    end += (1 - begin + 1)
                    begin = 1
                }
                if (end > this.totalPage) {
                    end = this.totalPage
                }
                this.begin = begin
                this.end = end

                while (begin <= end) {
                    ret.push(begin)
                    begin++
                }

                return ret
            },
            p_sizeData() {
                return this.sizeData.map(item => ({
                    label: `${item}条/页`,
                    value: item
                }))
            },
        },
        methods: {
            p_clickPage(page) {
                this.p_page = page
            },
        }
    }
</script>

<style lang="scss">
    @include themeWrap {
        .pl-pagination {
            @include public-style;
            display: inline-flex;
            width: 100%;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;

            $borderColor: plVar(colorInfoLight);
            $borderTopVal: 6px;
            $borderBottomVal: 6px;

            .pl-pagination-left {
                display: inline-flex;
                align-items: center;
                border: solid 1px $borderColor;
                box-sizing: border-box;
                padding: 1px 0;
                border-radius: plVar(borderFillet);

                .pl-pagination-operation {
                    display: flex;
                    align-items: center;
                    padding: 0 16px;
                    position: relative;
                    height: 28px;

                    &:after {
                        width: 1px;
                        position: absolute;
                        top: $borderTopVal;
                        bottom: $borderBottomVal;
                        right: 0;
                        background-color: $borderColor;
                        content: '';
                    }

                    .pl-pagination-operate-num-wrapper {
                        display: flex;
                        align-items: center;
                        padding: 0 1em;

                        .pl-pagination-operate-num {
                            padding: 0 12px;
                            text-align: center;
                        }
                    }
                }

                .pl-pagination-operate-icon {
                    color: plVar(colorInfoDeep);
                }

                .pl-pagination-operate-num, .pl-pagination-more-icon {
                    color: plVar(colorInfo);
                }

                .pl-pagination-operate-icon, .pl-pagination-operate-num {
                    cursor: pointer;

                    &:hover {
                        color: plVar(colorPrimary);
                    }

                    &:active {
                        color: plVar(colorPrimaryDeep);
                    }

                    &.pl-pagination-operate-num-active {
                        color: plVar(colorPrimary);
                    }

                    &.pl-pagination-operate-refresh-icon {
                        padding: 0 16px;
                    }

                    &.pl-icon-loading {
                        color: plVar(colorPrimary);
                    }
                }

                .pl-pagination-jump-wrapper {
                    font-size: 12px;
                    position: relative;
                    padding: 0 16px;

                    &:before {
                        width: 1px;
                        position: absolute;
                        top: $borderTopVal;
                        bottom: $borderBottomVal;
                        left: 0;
                        background-color: $borderColor;
                        content: '';
                    }

                    &:after {
                        width: 1px;
                        position: absolute;
                        top: $borderTopVal;
                        bottom: $borderBottomVal;
                        right: 0;
                        background-color: $borderColor;
                        content: '';
                    }

                    .pl-pagination-jump-input {
                        border: none;
                        padding-right: 6px;

                        input {
                            text-align: center;
                        }
                    }
                }
            }

            .pl-pagination-right {
                height: 100%;
                display: inline-block;
                vertical-align: middle;

                .pl-box, .pl-box-content {
                    width: fit-content !important;
                }
            }
        }
    }
</style>