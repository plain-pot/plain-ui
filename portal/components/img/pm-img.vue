<template>
    <pl-img :value="p_src" :uploadOption="p_uploadOption" v-bind="p_imgProps" @delete="pl_delete"/>
</template>

<script>
    export default {
        name: "pm-img",
        props: {
            id: {type: String, require: true},
            src: {type: String, require: true},
            imgProps: {type: Object,},
            disabled: {type: Boolean,},
            customPreview: {type: Function},                                                                //自定义预览函数
            uploadOption: {},
        },
        watch: {
            id: {
                immediate: true,
                handler(val) {
                    this.p_id = val
                },
            },
            src: {
                immediate: true,
                handler(val) {
                    this.p_src = val
                },
            },
        },
        data() {
            return {
                p_id: null,
                p_src: null,
                p_uploadOption: null,
            }
        },
        computed: {
            p_imgProps() {
                return Object.assign({}, {
                    height: '56px',
                    width: '56px',
                    disabled: this.disabled,
                    customPreview: this.customPreview,
                }, this.imgProps)
            },
        },
        async created() {
            this.p_uploadOption = Object.assign({}, {
                action: `${(await this.$http.getEnv()).server}/upload/uploadFile`,
                filename: 'file',
                data: {
                    module: 'img'
                },
                onSuccess: (data) => {
                    if (data.code !== 0) {
                        this.$notice.show(`文件上传失败！${data.ret}`)
                        return false
                    } else {
                        const info = data.ret
                        this.p_id = info.id
                        this.p_src = info.url
                        this.$emit('update:id', this.p_id)
                        this.$emit('update:src', this.p_src)
                        this.$emit('change', {id: this.p_id, src: this.p_src})
                        return true
                    }
                },
            }, this.uploadOption)
        },
        methods: {
            pl_delete() {
                this.p_id = null
                this.p_src = null
                this.$emit('update:id', this.p_id)
                this.$emit('update:src', this.p_src)
                this.$emit('change', {id: this.p_id, src: this.p_src})
            },
        }
    }
</script>

<style lang="scss">

</style>
