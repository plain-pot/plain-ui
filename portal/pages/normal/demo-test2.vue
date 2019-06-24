<template>
    <div class="demo-test2">
        <im-button label="demo-test2"/>

        <text-component v-model="obj"/>
    </div>
</template>

<script>

    const TextComponent = {
        props: {
            value: {},
        },
        render(h) {
            return (
                <div>
                    <span>TextComponent</span>
                    {JSON.stringify(this.value)}
                    <im-button onClick={this.click} label="set"/>
                </div>
            )
        },
        methods: {
            click() {
                this.value.hhh = '112132'
                this.value.xxx = '112132'
                Object.keys(this.value).forEach(key => {
                    this.$set(this.value, key, this.value[key])
                })
                this.$emit('input', this.$plain.$utils.deepCopy(this.value))
                setTimeout(() => {
                    console.log(this.value)
                }, 0)
            },
        }
    }

    export default {
        name: "demo-test2",
        components: {TextComponent},
        data() {
            return {
                obj: {
                    name: 111,
                    desc: "xxx",
                }
            }
        },
    }
</script>

<style lang="scss">

</style>