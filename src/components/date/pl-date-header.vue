<template>
    <div class="pl-date-header">
        <div class="pl-date-header-left">
            <slot name="left">
                <template v-if="!hideLeftButton">
                    <pl-icon icon="pad-doubleleft" class="pl-date-header-label" @click="p_pickYear--" hover/>
                    <pl-icon icon="pad-left" class="pl-date-header-label" @click="p_previousMonth" hover/>
                </template>
            </slot>
        </div>
        <div class="pl-date-header-center">
            <slot name="center">
                <span class="pl-date-header-label" @click="$emit('changeMode','year')">{{p_pickYear}}</span>
                <template v-if="view !== 'year'">
                    <span>-</span>
                    <span class="pl-date-header-label" @click="$emit('changeMode','month')">{{$plain.$utils.zeroize(p_pickMonth+1)}}</span>
                </template>
                <slot name="time"></slot>
            </slot>
        </div>
        <div class="pl-date-header-right">
            <slot name="right">
                <template v-if="!hideRightButton">
                    <pl-icon icon="pad-right" class="pl-date-header-label" @click="p_nextMonth" hover/>
                    <pl-icon icon="pad-doubleright" class="pl-date-header-label" @click="p_pickYear++" hover/>
                </template>
            </slot>
        </div>
    </div>
</template>

<script>

    import PlIcon from "../pl-icon";
    export default {
        name: "pl-date-header",
        components: {PlIcon},
        props: {
            pickYear: {},
            pickMonth: {},
            view: {},
            hideLeftButton: {type: Boolean},
            hideRightButton: {type: Boolean},
        },
        watch: {
            pickYear(val) {
                if (this.p_pickYear !== val) this.p_pickYear = val
            },
            p_pickYear(val) {
                if (this.pickYear !== val) this.$emit('update:pickYear', val)
            },
            pickMonth(val) {
                if (this.p_pickMonth !== val) this.p_pickMonth = val
            },
            p_pickMonth(val) {
                if (this.pickMonth !== val) this.$emit('update:pickMonth', val)
            },
        },
        data() {
            return {
                p_pickYear: this.pickYear,
                p_pickMonth: this.pickMonth,
            }
        },
        methods: {
            p_previousMonth() {
                if (this.p_pickMonth - 1 < 0) {
                    this.p_pickMonth = 11
                    this.p_pickYear--
                } else {
                    this.p_pickMonth--
                }
            },
            p_nextMonth() {
                if (this.p_pickMonth + 1 > 11) {
                    this.p_pickMonth = 0
                    this.p_pickYear++
                } else {
                    this.p_pickMonth++
                }
            },
        },
    }
</script>