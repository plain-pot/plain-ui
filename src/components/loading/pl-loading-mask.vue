<template>
    <transition name="pl-transition-loading-mask">
        <div class="pl-loading-mask" v-if="value">
            <pl-loading type="delta"/>
            <span v-if="!!p_message">
            {{p_message}}
        </span>
        </div>
    </transition>
</template>

<script>
    import {PropsMixinFactory} from "../../utils/mixins";

    export default {
        name: "pl-loading-mask",
        mixins: [
            PropsMixinFactory.create({
                message: PropsMixinFactory.Promise
            })
        ],
        props: {
            value: {type: Boolean},
            message: {type: String},
        },
        data() {
            return {}
        },
        methods: {},
    }
</script>

<style lang="scss">
    @include themify {
        .pl-loading-mask {
            color: $colorPrimary;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(255, 255, 255, 0.5);
            transition: all linear 300ms;
            transform-origin: center center;
            cursor: progress;

            .pl-loading {
                margin-bottom: 20px;
                font-size: 32px;

                & + span {
                    font-size: 14px;
                }
            }
        }
    }

    .pl-transition-loading-mask-enter-active, .pl-transition-loading-mask-leave-active {
        opacity: 1;
    }

    .pl-transition-loading-mask-enter, .pl-transition-loading-mask-leave-to {
        opacity: 0;
    }
</style>