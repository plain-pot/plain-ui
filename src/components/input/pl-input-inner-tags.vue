<template>
    <div class="pl-input-inner-tags">
        <span class="pl-input-inner-tag-item pl-input-inner-tag-item-takeover">&nbsp;</span>
        <span v-for="(item,index) in (collapseTags?data.slice(0,3):data)" :key="index" class="pl-input-inner-tag-item">
            <slot :item="item" :index="index"/>
        </span>
        <span class="pl-input-inner-tag-item" v-if="collapseTags && data.length>3">
            +{{data.length-3}}
        </span>
    </div>
</template>

<script>
    export default {
        name: "pl-input-inner-tags",
        props: {
            data: {type: Array},
            collapseTags: {type: Boolean, default: true},
        },
        data() {
            return {}
        },
        methods: {},
    }
</script>