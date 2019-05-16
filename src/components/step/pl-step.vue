<template>
    <div class="pl-step" :class="classes">
        <div class="pl-step-icon-wrapper">
            <pl-icon :icon="icon" v-if="!!icon"/>
            <div class="pl-step-number" v-else-if="p_index!=null">
                {{p_index+1}}
            </div>
        </div>
        <div class="pl-step-body">
            <div class="pl-step-title-wrapper">
                <div class="pl-step-title">
                    <slot name="title">
                        {{title}}
                    </slot>
                </div>
                <div class="pl-step-title-line" v-if="!isLast"></div>
            </div>
            <div class="pl-step-content">
                <slot name="content">
                    {{content}}
                </slot>
            </div>
        </div>
    </div>
</template>

<script>
    import PlIcon from "../pl-icon";

    export default {
        name: "pl-step",
        components: {PlIcon},
        props: {
            icon: {type: String,},
            title: {type: String,},
            content: {type: String,},
        },
        data() {
            return {
                p_container: null,
                p_index: null,
            }
        },
        computed: {
            isLast() {
                if (!this.p_container) return false
                return this.p_index === this.p_container.items.length - 1
            },
            isActive() {
                if (!this.p_container) return false
                return this.p_index === this.p_container.value
            },
            isComplete() {
                if (!this.p_container) return false
                return this.p_index < this.p_container.value
            },
            classes() {
                return [
                    {
                        'pl-step-active': this.isActive,
                        'pl-step-complete': this.isComplete,
                    }
                ]
            },
        },
        created() {
            this.p_container = this.$plain.$dom.findComponentUpward(this, 'pl-step-container')
            if (!this.p_container) {
                console.log(`can't find container!`)
                return
            } else {
                this.p_container.pl_add(this)
            }
        },
        beforeDestroy() {
            !!this.p_container && this.p_container.pl_remove(this)
        }

    }
</script>

<style lang="scss">

</style>