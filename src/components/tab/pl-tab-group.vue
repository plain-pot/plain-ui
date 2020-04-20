<script>
    import {EmitMixin, RefsMixinFactory} from "../../utils/mixins";

    export default {
        name: "pl-tab-group",
        props: {
            value: {},
            type: {type: String, default: 'default'},                      // 页签样式：card,border-card
            position: {type: String, default: 'top'},                      // 选项卡位置：top、bottom、left、right
        },
        mixins: [
            EmitMixin,
            RefsMixinFactory({
                head: Object,
                headScroll: Object,
            })
        ],
        emitters: {
            emitInput: Function,
        },
        provide() {
            return {
                plTabGroup: this,
            }
        },
        data() {
            // 刷新每个step的index，以便step知道自己处于哪个位置
            const refreshStepIndex = this.$plain.utils.debounce((callback) => {
                this.items.forEach(item => item.refreshIndex())
                if (!!callback) callback()
            }, 100)

            const {value: p_value} = this

            return {
                items: [],
                refreshStepIndex,

                p_value,
            }
        },
        render() {

            const head = (
                <div class="pl-tab-head-wrapper">
                    <div class="pl-tab-head-bottom"/>
                    <pl-scroll scrollY={false} scrollX={true} scrollbarSize={6} ref="headScroll">
                        <ul class="pl-tab-head" ref="head" onMousewheel={this.onMousewheelHeadList}>
                            {this.sortItems.map(item => (
                                <li
                                    key={item.tabId}
                                    class={['pl-tab-head-item', {'pl-tab-head-item-current': item.tabId === this.p_value}]}
                                    onClick={() => this.onClickTitle(item)}
                                >
                                    {item.title}
                                </li>
                            ))}
                            {this.type === 'default' && <li class="pl-tab-head-indicator" style={this.headIndicatorStyles}/>}
                        </ul>
                    </pl-scroll>
                </div>
            )

            const body = (
                <ul class="pl-tab-body" style={this.borderStyles}>
                    {this.$slots.default}
                </ul>
            )

            const content = [head, body]

            return (
                <div class={this.classes}>
                    {content}
                </div>
            )
        },
        computed: {
            classes() {
                return [
                    'pl-tab-group',
                    `pl-tab-group-position-${this.position}`,
                    {
                        [`pl-tab-group-type-${this.type}`]: !!this.type
                    }
                ]
            },
            borderStyles() {
                const {position} = this
                const styles = {}

                if (position === 'top') {
                    styles.paddingTop = '62px'
                } else if (position === 'bottom') {
                    styles.paddingBottom = '62px'
                }

                return styles
            },
            sortItems() {
                return this.items.sort((a, b) => a.index - b.index)
            },
            currentIndex() {
                const target = this.$plain.utils.findOne(this.sortItems, item => item.tabId == this.p_value, true)
                if (!!target) {
                    return target.index
                }
            },
            headIndicatorStyles() {
                let offsetLeft, offsetWidth;
                const currentIndex = this.currentIndex
                if (!this.head || !this.head.childNodes) {
                    return null
                }
                for (let i = 0; i < this.head.childNodes.length; i++) {
                    const childNode = this.head.childNodes[i]
                    if (currentIndex === i) {
                        offsetLeft = childNode.offsetLeft
                        offsetWidth = childNode.offsetWidth
                    }
                }
                return {
                    width: `${offsetWidth}px`,
                    left: `${offsetLeft}px`,
                }
            },
        },
        methods: {
            /*---------------------------------------utils-------------------------------------------*/
            addItem(item) {
                this.items.push(item)
                this.refreshStepIndex(this.p_value == null ? () => {
                    this.p_value = this.items[0].tabId
                } : null)
            },
            removeItem(item) {
                this.items.splice(this.items.indexOf(item), 1)
                this.refreshStepIndex()
            },
            /*---------------------------------------handler-------------------------------------------*/
            onClickTitle(item) {
                this.p_value = item.tabId
                this.emitInput(this.p_value)
            },
            onMousewheelHeadList(e) {
                e.stopPropagation()
                e.preventDefault()
                let oldLeft = this.headScroll.p_wrapperScrollLeft
                let delta = e.deltaX || e.deltaY
                this.headScroll.scroll({x: oldLeft + delta})
            },
        },
    }
</script>

<style lang="scss">
    @include themify {
        .pl-tab-group {

            .pl-tab-head, .pl-tab-body {
                margin: 0;
                padding: 0;
                list-style: none;

                & > li {
                    display: inline-block;
                }
            }

            &.pl-tab-group-position-top, &.pl-tab-group-position-bottom {
                position: relative;

                .pl-tab-head-wrapper {
                    width: 100%;
                    left: 0;
                    right: 0;
                    position: absolute;

                    & > .pl-scroll {
                        & > .pl-horizontal-scrollbar-wrapper {
                            bottom: 12px;
                        }
                    }
                }

                .pl-tab-body {
                    padding: 20px 0;
                    width: 100%;
                    height: 100%;
                }

                .pl-tab-head-bottom {
                    position: absolute;
                    left: 0;
                    right: 0;
                    height: 2px;
                    background-color: $ibl;
                }

                .pl-tab-head {
                    white-space: nowrap;
                    display: inline-block;
                    position: relative;
                    min-width: 100%;

                    .pl-tab-head-item {
                        padding: 12px 0;
                        font-size: 14px;
                        color: $itc;
                        cursor: pointer;
                        user-select: none;

                        &:hover {
                            color: $colorPrimary;
                        }

                        &.pl-tab-head-item-current {
                            color: $colorPrimary;
                        }

                        &:not(:first-child) {
                            margin-left: 16px;
                        }
                    }

                    .pl-tab-head-indicator {
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        height: 2px;
                        background-color: $colorPrimary;
                        transition: all 500ms $transition;
                    }
                }


                &.pl-tab-group-position-top {
                    .pl-tab-head-wrapper {
                        top: 0;

                        .pl-tab-head-bottom {
                            bottom: 20px;
                        }
                    }

                    &.pl-tab-group-type-card, &.pl-tab-group-type-card-border {
                        border-radius: 2px;

                        .pl-tab-head-item {
                            padding-left: 20px;
                            padding-right: 20px;

                            border-top: solid 1px $ibl;
                            border-right: solid 1px $ibl;
                            border-bottom: solid 1px $ibl;

                            transition: background-color 300ms $transition;
                            background-color: #f6f6f6;

                            &:not(:first-child ) {
                                margin-left: 0;
                            }

                            &:first-child {
                                border-left: solid 1px $ibl;
                                border-top-left-radius: 2px;
                            }

                            &:last-child {
                                border-top-right-radius: 2px;
                            }

                            &.pl-tab-head-item-current {
                                background-color: white;
                            }
                        }

                        .pl-tab-head-bottom {
                            height: 1px;
                        }
                    }

                    &.pl-tab-group-type-card-border {
                        box-shadow: $boxshadow;

                        .pl-tab-head {
                            background-color: #f6f6f6;
                        }

                        .pl-tab-head-item {
                            border-top: none;

                            &:first-child {
                                border-left: none;
                            }

                            &.pl-tab-head-item-current {
                                border-bottom-color: white;
                            }

                        }

                        .pl-tab-body {
                            padding-left: 12px;
                            padding-right: 12px;
                        }
                    }
                }

                &.pl-tab-group-position-bottom {
                    .pl-tab-head-wrapper {
                        bottom: -20px;

                        .pl-tab-head-bottom {
                            top: 0;
                        }

                        .pl-tab-head-indicator {
                            top: 0;
                        }
                    }

                    &.pl-tab-group-type-card, &.pl-tab-group-type-card-border {
                        border-radius: 2px;

                        .pl-tab-head-item {
                            padding-left: 20px;
                            padding-right: 20px;

                            border-bottom: solid 1px $ibl;
                            border-right: solid 1px $ibl;
                            border-top: solid 1px $ibl;

                            transition: background-color 300ms $transition;
                            background-color: #f6f6f6;

                            &:not(:first-child ) {
                                margin-left: 0;
                            }

                            &:first-child {
                                border-left: solid 1px $ibl;
                                border-bottom-left-radius: 2px;
                            }

                            &:last-child {
                                border-bottom-right-radius: 2px;
                            }

                            &.pl-tab-head-item-current {
                                background-color: white;
                            }
                        }

                        .pl-tab-head-bottom {
                            height: 1px;
                        }
                    }

                    &.pl-tab-group-type-card-border {
                        box-shadow: $boxshadow;

                        .pl-tab-head {
                            background-color: #f6f6f6;
                        }

                        .pl-tab-head-item {
                            border-bottom: none;

                            &:first-child {
                                border-left: none;
                            }

                            &.pl-tab-head-item-current {
                                border-top-color: white;
                            }

                        }

                        .pl-tab-body {
                            padding-left: 12px;
                            padding-right: 12px;
                        }
                    }
                }
            }

            &.pl-tab-group-position-left, &.pl-tab-group-position-right {
                &.pl-tab-group-position-left {
                    .pl-tab-head-wrapper {
                        float: left;
                    }
                }

                &.pl-tab-group-position-right {
                    .pl-tab-head-wrapper {
                        float: right;
                    }
                }
            }
        }
    }
</style>