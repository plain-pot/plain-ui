<template>
    <div class="pl-message-container"
         :class="classes">
        <pl-list direction="top">
            <pl-item v-for="(item,index) in messages" :key="item.id">
                <pl-message-item v-bind="item" @done="done(item,index)"/>
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
            duration: {default: '30px'},
        },
        computed: {
            targetVertical() {
                return this.p_vertical || this.vertical
            },
            targetHorizontal() {
                return this.p_horizontal || this.horizontal
            },
            classes() {
                return [
                    `pl-message-container-${this.targetHorizontal}-${this.targetVertical}`
                ]
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