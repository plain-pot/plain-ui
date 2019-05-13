<template>
    <div class="pl-color-history">
        <pl-color class="pl-color-history-item pl-color-history-current" :color="current" :length="30"/>
        <pl-color class="pl-color-history-item" v-for="(color,index) in p_colors" :key="index" :color="color" @click="p_clickItem(color)"/>
    </div>
</template>

<script>
    import PlColor from "./pl-color";

    const STORAGE_KEY = 'color-picker'

    export default {
        name: "pl-color-history",
        components: {PlColor},
        props: {
            current: {type: String},
        },
        data() {
            const p_colors = this.$plain.$storage.get(STORAGE_KEY) || []
            return {
                p_colors
            }
        },
        methods: {
            save(color) {
                if (this.p_colors.indexOf(color) > -1) return

                this.p_colors.unshift(color)
                if (this.p_colors.length > 6) this.p_colors.pop()
                this.$plain.$storage.set(STORAGE_KEY, this.p_colors)
            },
            p_clickItem(color) {
                this.$emit('select', color)
            },
        }
    }
</script>