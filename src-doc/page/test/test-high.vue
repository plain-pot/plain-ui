<template>
    <div class="test-high">
        <h1>
            test-high
        </h1>
        <div>
            <input type="text" v-model="name">
        </div>
        <TargetComponent :name="name" @click="$plain.log"/>
    </div>
</template>

<script>

    let TargetComponent = {
        props: {
            name: {type: String},
        },
        data() {
            return {
                myName: this._uid
            }
        },
        render() {
            return (
                <div>
                    <div onClick={() => this.$emit('click', this.name)}>name:{this.name}</div>
                    <div>myName:{this.myName}</div>
                </div>
            )
        },
    }

    const Wrap = (Component) => {
        return {
            render() {
                const {
                    $props,
                    $attrs,
                    $listeners,
                } = this
                console.log($props, $attrs)

                return <Component {...{props: $attrs, on: $listeners}}/>
            },
        }
    }

    TargetComponent = Wrap(TargetComponent)

    export default {
        name: "test-high",
        components: {
            TargetComponent,
        },
        data() {
            return {
                name: null,
            }
        },
    }
</script>

<style lang="scss">

</style>