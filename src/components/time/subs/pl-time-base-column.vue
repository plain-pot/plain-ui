<template>
    <div class="pl-time-base-column">
        <pl-scroll ref="scroll">
            <ul class="pl-time-base-column-list">
                <li class="pl-time-base-column-item" v-for="item in 3" :key="-item"></li>
                <li v-for="item in options"
                    class="pl-time-base-column-item pl-time-base-column-option-item"
                    :class="{
                            'pl-time-base-column-item-current':p_value == item,
                            'pl-time-base-column-item-disabled': checkDisabled(item),
                        }"
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
    import {EditMixin, EmitMixin, RefsMixinFactory} from "../../../utils/mixins";

    export default {
        name: "pl-time-base-column",
        mixins: [
            EmitMixin,
            EditMixin,
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
            p_value() {
                this.resetPosition()
            },
        },
        data() {
            return {
                p_value: Number(this.value),
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
            /*---------------------------------------methods-------------------------------------------*/
            resetPosition() {
                let scrollTop = !this.p_value ? 0 : (Number(this.p_value)) * 24
                this.scroll.scroll({y: scrollTop}, 150)
            },
            /*---------------------------------------utils-------------------------------------------*/
            checkDisabled(item) {
                if (this.isDisabled) return true
                if (this.max != null && this.max < item) return true
                if (this.min != null && this.min > item) return true
                return false
            },
            /*---------------------------------------handler-------------------------------------------*/
            onClickItem(item) {
                if (this.checkDisabled(item)) {
                    return
                }
                this.p_value = Number(item)
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
            border: solid $ibc 1px;
            border-radius: 2px;

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

                    &.pl-time-base-column-item-disabled {
                        color: $disabledText;
                        cursor: not-allowed;
                        &:hover {
                            color: $disabledText;
                            background-color: transparent;
                        }
                    }

                    &.pl-time-base-column-item-current {
                        background-color: rgba($colorPrimary, 0.1);
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