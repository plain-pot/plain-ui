<template>
    <div class="color-picker">
        <demo-row title="基本用法">
            <pl-input v-model="state.text"/>
            <pl-input v-model="state.myDate.year"/>
            {{state.myDate.displayString}}
        </demo-row>
    </div>
</template>

<script>

    class MyDate {
        year;
        month;
        day;

        get displayString() {
            console.log('displayString')
            return `${this.year}-${this.month}-${this.day}`
        }

        constructor(year, month, day) {
            this.year = year
            this.month = month
            this.day = day
        }
    }

    import {reactive, watch} from 'vue'

    export default {
        name: "color-picker",
        setup() {
            const state = reactive({
                text: 'hello world',
                myDate: new MyDate(2020, 11, 20)
            })

            watch(() => state.myDate.displayString, val => {
                console.log('displayString change', val)
            })

            return {
                state,
            }
        },
    }
</script>

<style lang="scss">

</style>