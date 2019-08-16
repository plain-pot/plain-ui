<template>
    <img :src="p_src" v-if="p_status === STATUS.SUCCESS" class="pl-simple-img">
    <div v-else-if="p_status === STATUS.ERROR" class="pl-simple-img pl-simple-img-status-error">
        <pl-icon icon="pad-image-fill"/>
        <br>
        <span>图片加载失败!</span>
        <br>
        <a :href="p_src" target="_blank">{{p_src}}</a>
    </div>
    <div v-else-if="p_status === STATUS.EMPTY" class="pl-simple-img pl-simple-img-status-empty">
        <pl-icon icon="pad-image"/>
        <br>
        <span>无图片</span>
    </div>
    <div class="" v-else-if="p_status === STATUS.LOADING" class="pl-simple-img">
        <pl-loading/>
    </div>
</template>

<script>
    export default {
        name: "pl-simple-img",
        props: {
            src: {},
        },
        watch: {
            src: {
                immediate: true,
                handler(val) {

                    if (val == null) {
                        this.p_src = null
                        this.changeStatus(this.STATUS.EMPTY)
                        return
                    }

                    this.p_src = val
                    this.changeStatus(this.STATUS.LOADING)
                    const image = new Image()
                    image.onload = () => this.changeStatus(this.STATUS.SUCCESS)
                    image.onerror = () => this.changeStatus(this.STATUS.ERROR)
                    image.src = this.p_src
                },
            },
        },
        data() {
            const STATUS = {
                EMPTY: 'EMPTY',
                SUCCESS: 'SUCCESS',
                ERROR: 'ERROR',
                LOADING: 'LOADING',
            }
            return {
                p_src: null,
                p_image: null,
                p_status: STATUS.EMPTY,
                STATUS,
            }
        },
        methods: {
            changeStatus(status) {
                this.p_status = status
            },
        }
    }
</script>

<style lang="scss">
    .pl-simple-img {
        display: inline-block;
        text-align: center;

        .pl-icon {
            font-size: 50px;

            span {
                font-size: 14px;
            }
        }

        &.pl-simple-img-status-error {
            color: black;
        }

        &.pl-simple-img-status-empty {
            color: white;
        }
    }
</style>
