<script>

    const optionKeys = [
        'message',
        'editType',
        'editReadonly',
        'render',
        'onConfirm',
        'onCancel',
    ]

    export default {
        name: "pl-dialog-service-item",
        props: {},
        data() {
            return {
                show: false,
                key: 0,

                message: null,
                option: null,

                editValue: null,

                onConfirm: () => {
                    if (!!this.p_option.option.onConfirm) {
                        this.p_option.option.onConfirm(!this.p_option.option.editType ? undefined : this.editValue)
                    }
                },
                onCancel: () => {
                    if (!!this.p_option.option.onCancel) {
                        this.p_option.option.onCancel()
                    }
                },
            }
        },
        render(h) {

            let content = null
            let option = this.p_option.option

            if (!!option.editType) {
                content = <pl-input value={this.editValue} onInput={val => this.editValue = val} readonly={option.editReadonly} textarea={option.editType === 'textarea'}/>
            } else if (!!option.message) {
                content = <div class="pl-dialog-service-item-message">{option.message}</div>
            } else if (!!option.render) {
                content = option.render(h)
            }


            return (
                <pl-dialog class="pl-dialog-service-item"
                           value={this.show}
                           onInput={val => this.show = val}
                           key={this.key}

                           onConfirm={this.onConfirm}
                           onCancel={this.onCancel}

                           {...{props: this.p_option.binding}}>{content}</pl-dialog>
            )
        },
        computed: {
            p_option() {

                let option = {}
                let binding = {}

                if (!this.message) {
                    return {
                        option,
                        binding,
                    }
                }

                if (typeof this.message === 'object') {
                    Object.keys(this.message).forEach((key) => {
                        if (optionKeys.indexOf(key) > -1) {
                            option[key] = this.message[key]
                        } else {
                            binding[key] = this.message[key]
                        }
                    })
                } else {
                    option.message = String(this.message)
                    if (!!this.option) {
                        Object.keys(this.option).forEach((key) => {
                            if (optionKeys.indexOf(key) > -1) {
                                option[key] = this.option[key]
                            } else {
                                binding[key] = this.option[key]
                            }
                        })
                    }
                }

                // console.log({option,binding})

                return {
                    option,
                    binding,
                }

            },
        },
        methods: {
            open(message, option) {
                this.message = message
                this.option = option

                this.key++
                this.show = true

                return () => this.close()
            },
            close() {
                this.show = false
            },
        },
    }
</script>

<style lang="scss">
</style>