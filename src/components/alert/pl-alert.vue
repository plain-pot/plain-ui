<template>
    <div class="pl-alert" :class="classes">
        <span class="pl-alert-title" v-if="!!title || $slots.title">
            <slot name="title">{{title}}</slot>
        </span>
        <span class="pl-alert-message" v-if="!!message || $slots.message">
            <slot name="message">
                {{message}}
            </slot>
        </span>
        <div class="pl-alert-icon">
            <pl-icon :icon="targetIcon"/>
        </div>
    </div>
</template>

<script>
    import {StyleMixin} from "../../utils/mixins";

    export default {
        name: "pl-alert",
        mixins: [
            StyleMixin,
        ],
        props: {
            title: {type: String},
            message: {type: String},
            icon: {type: String},
        },
        computed: {
            targetStatus() {
                return this.status || 'primary'
            },
            targetIcon() {
                if (this.icon === null) {
                    return null
                }
                return this.icon || this.$plain.STATUS[this.targetStatus].icon
            },
            classes() {
                return [
                    `pl-alert-status-${this.targetStatus}`,
                    `pl-alert-shape-${this.p_shape || 'fillet'}`,
                    {
                        'pl-alert-has-icon': !!this.targetIcon,
                        'pl-alert-has-title': !!this.title || this.$slots.title,
                    }
                ]
            },
        },
    }
</script>

<style lang="scss">
    @include themify {
        .pl-alert {
            position: relative;
            padding: 8px;

            .pl-alert-title {
                color: $ihc;
                display: block;
                margin-bottom: 8px;
                font-size: 16px;

                .pl-icon {
                    color: $icc;
                }
            }

            .pl-alert-message {
                color: $itc;
                font-size: 14px;

                .pl-icon {
                    color: $icc;
                }
            }

            .pl-alert-icon {
                position: absolute;
                top: 0;
                bottom: 0;
                content: '';
                display: flex;
                align-items: center;
                justify-content: center;
                left: 12px;
            }

            @include statusMixin(alert) {
                background-color: rgba($value, 0.1);
                border: solid 1px rgba($value, 0.3);
                .pl-alert-icon {
                    color: $value;
                }
            }

            @include shapeMixin(alert) {
                border-radius: $value;
            }

            &.pl-alert-has-icon {
                .pl-alert-title, .pl-alert-message {
                    padding-left: 24px
                }
            }

            &.pl-alert-has-title {
                padding: 16px;

                .pl-alert-title, .pl-alert-message {
                    padding-left: 40px
                }

                .pl-alert-icon {
                    left: 16px;
                    font-size: 24px;
                }
            }
        }
    }
</style>