<template>
    <div class="pl-message-container"
         :style="containerStyles">
        <pl-list direction="top">
            <pl-item v-for="(item,index) in messages" :key="item.id">
                <pl-message-item :text="item.text" :type="item.type" :time="item.time" :done="item.done" :click="item.click" @done="done(item,index)"/>
            </pl-item>
        </pl-list>
    </div>
</template>

<script>
    import PlList from "../list/pl-list";
    import PlItem from "../list/pl-item";
    import PlMessageItem from "./pl-message-item";

    export default {
        name: "pl-message-container",
        components: {PlMessageItem, PlItem, PlList},
        props: {
            horizontal: {type: String, default: 'center'},
            vertical: {type: String, default: 'start'},
            messages: {type: Array, default: () => []},
        },
        computed: {
            position() {
                return {
                    [this.targetHorizontal === 'end' ? 'right' : 'left']: this.targetHorizontal === 'center' ? '50%' : '20px',
                    [this.targetVertical === 'end' ? 'bottom' : 'top']: this.targetVertical === 'center' ? '50%' : '20px',
                }
            },
            containerStyles() {
                const styles = {}
                styles[this.targetHorizontal === 'end' ? 'right' : 'left'] = this.targetHorizontal === 'center' ? '50%' : '20px'
                styles[this.targetVertical === 'end' ? 'bottom' : 'top'] = this.targetVertical === 'center' ? '50%' : '20px'
                styles.transform = `translate(${this.targetHorizontal === 'center' ? '-50%' : '0'},${this.targetVertical === 'center' ? '-50%' : '0'})`
                return styles;
            },
            targetVertical() {
                return this.p_vertical || this.vertical
            },
            targetHorizontal() {
                return this.p_horizontal || this.horizontal
            },
        },
        data() {
            return {
                p_vertical: null,
                p_horizontal: null,
            }
        },
        methods: {
            done(item, index) {
                this.messages.splice(index, 1)
            },
            add(message) {
                this.messages.push(message)
            },
            remove(message) {
                const index = this.messages.indexOf(message)
                if (index > -1) this.messages.splice(index, 1)
            },
        }
    }
</script>