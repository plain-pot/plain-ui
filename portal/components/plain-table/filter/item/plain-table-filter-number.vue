<template>
    <div class="plain-table-filter-number">
        <pl-number :input="{type:'none',width:'80px',noClear:true,placeholder:'最大值'}" noController v-model="filterData.start" @enter="pl_enter"/>
        到
        <pl-number :input="{type:'none',width:'80px',noClear:true,placeholder:'最小值'}" noController v-model="filterData.end" @enter="pl_enter"/>
        <pl-icon icon="pad-close-circle-fill" class="plain-table-filter-number-clear-icon" @click="pl_clear"/>
    </div>
</template>

<script>
    export default {
        name: "plain-table-filter-number",
        props: {
            filterData: {},
        },
        methods: {
            pl_enter() {
                this.$emit('confirm')
            },
            pl_clear() {
                this.filterData.start = null
                this.filterData.end = null
                this.$emit('clear')
            },
        }
    }
</script>

<style lang="scss">
    @include themeWrap {
        .plain-table-filter-number {
            border-radius: plVar(borderFillet);
            border: solid 1px plVar(colorInfo);
            box-sizing: border-box;
            height: plVar(sizeDefault);
            overflow: hidden;
            width: 200px;
            position: relative;

            .pl-number {
                padding: 0;

                input {
                    text-align: center;
                }
            }

            .plain-table-filter-number-clear-icon {
                position: absolute;
                right: 0;
                font-size: plVar(sizeDefault)/2.5;
                top: 0;
                bottom: 0;
                align-items: center;
                display: inline-flex;
                height: initial;
                opacity: 0;
            }

            &:hover {
                .plain-table-filter-number-clear-icon {
                    opacity: 1;
                }
            }
        }
    }
</style>