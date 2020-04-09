<template>
    <div class="pl-time-base-column">
        <pl-scroll ref="scroll">
            <ul class="pl-time-base-column-list">
                <li class="pl-time-base-column-item" v-for="item in 3" :key="-item"></li>
                <li v-for="item in options"
                    class="pl-time-base-column-item pl-time-base-column-option-item"
                    :class="{'pl-time-base-column-item-current':p_value == item}"
                    :key="item"
                    @click="onClickItem(item)">
                    {{item}}
                </li>
                <li class="pl-time-base-column-item" v-for="item in 3" :key="-item*2"></li>
            </ul>
        </pl-scroll>
    </div>
</template>

<script>
    import {EmitMixin, RefsMixinFactory} from "../../../utils/mixins";

    export default {
        name: "pl-time-base-column",
        mixins: [
            EmitMixin,
            RefsMixinFactory({
                scroll: Object,
            })
        ],
        emitters: {
            emitInput: Function,
            emitClickItem: Function,
        },
        props: {
            layout: {type: String},                 // 模式，h：时，m：分，s：秒
            value: {type: Number},                  // 当前值
            max: {type: Number},                    // 最大值
            min: {type: Number},                    // 最小值
        },
        watch: {
            value(val) {
                this.p_value = val
            },
            p_value(val) {
                let scrollTop = !val ? 0 : (Number(val)) * 24
                this.scroll.scroll({y: scrollTop}, 150)
            },
        },
        data() {
            return {
                p_value: this.value,
            }
        },
        computed: {
            options() {
                let count = this.layout === 'h' ? 24 : 60
                let options = []
                for (let i = 0; i < count; i++) {
                    options.push(this.$plain.utils.zeroize(i, 2))
                }
                return options
            },
        },
        methods: {
            onClickItem(item) {
                this.p_value = item
                this.emitInput(this.p_value)
                this.emitClickItem(item)
            },
        },
    }
</script>

<style lang="scss">
    @include themify {
        .pl-time-base-column {

            $item_height: 24px;

            display: inline-block;
            height: 7*$item_height;
            width: 60px;

            .pl-time-base-column-list {
                margin: 0;
                padding: 0;
                list-style: none;
                position: relative;

                .pl-time-base-column-item {
                    font-size: 12px;
                    height: $item_height;
                    line-height: $item_height;
                    transition: all 300ms $transition;
                    text-align: center;

                    &.pl-time-base-column-option-item {
                        cursor: pointer;

                        &:hover {
                            background-color: rgba($colorInfo, 0.1);
                            color: $ihc;
                        }
                    }

                    &.pl-time-base-column-item-current {
                        background-color: rgba($colorInfo, 0.1);
                        color: $colorPrimary;

                        &:hover {
                            color: $colorPrimary;
                        }
                    }
                }
            }
        }
    }
</style>