<template>
    <div class="pl-radio-group" :class="classes">
        <pl-check-all v-if="multiple"
                      :color="color"
                      :size="size"
                      :status="checkAllStatus"
                      @click="p_clickCheckAll"
                      @select-all="$emit('select-all')"
                      @select-some="$emit('select-some')"
                      @select-none="$emit('select-none')"/>
        <slot></slot>
    </div>
</template>

<script>
    import PlCheckAll from "./pl-check-all";

    export default {
        name: "pl-radio-group",
        components: {PlCheckAll},
        props: {
            value: {},                                                          //当前绑定至，多选的话为数组
            size: {type: String, default: 'default'},                           //大小
            color: {type: String, default: 'primary'},                          //颜色
            activeIcon: {type: String,},                                        //激活的时候的图标
            inactiveIcon: {type: String,},                                      //未激活的时候的秃笔哦啊
            activeColor: {type: String,},                                       //激活的时候的颜色
            inactiveColor: {type: String,},                                     //未激活的时候的颜色
            disabled: {type: Boolean,},                                         //是否禁用
            readonly: {type: Boolean,},                                         //是否只读

            multiple: {type: Boolean},                                          //是否多选
            vertical: {type: Boolean},                                          //是否纵向
        },
        data() {
            return {
                singleValue: this.value,
                multipleValue: this.$plain.$utils.deepCopy(this.value) || [],
                p_radios: [],
            };
        },
        watch: {
            value(val) {
                if (!!this.multiple) {
                    if (this.multipleValue !== val) this.multipleValue = this.$plain.$utils.deepCopy(val);
                } else {
                    if (this.singleValue !== val) this.singleValue = val;
                }
                this.updateRadios();
            },
            multipleValue(val) {
                if (JSON.stringify(val) !== JSON.stringify(this.value))
                    this.$emit('input', val);
            },
            singleValue(val) {
                this.$emit('input', val);
            },
        },
        computed: {
            classes() {
                return [
                    `pl-radio-group-${!!this.vertical ? 'vertical' : 'horizontal'}`
                ];
            },
            checkAllStatus() {
                if (this.p_radios.every(radio => radio.currentValue)) return 'all'
                if (this.p_radios.some(radio => radio.currentValue)) return 'some'
                if (this.p_radios.every(radio => !radio.currentValue)) return 'none'
            },
        },
        methods: {
            p_addRadio(radio) {
                this.p_radios.push(radio);
            },
            p_removeRadio(radio) {
                this.$plain.$utils.removeFromArray(this.p_radios, radio);
            },
            updateRadios() {
                this.p_radios.forEach(radio => {
                    if (!!this.multiple) {
                        radio.currentValue = this.$plain.$utils.oneOf(radio.id, this.multipleValue);
                    } else {
                        radio.currentValue = (radio.id === this.singleValue);
                    }
                });
            },
            p_clickCheckAll() {
                const allIds = this.p_radios.map(item => item.id)
                switch (this.checkAllStatus) {
                    case 'all':
                        this.multipleValue = []
                        break
                    case 'some':
                        this.multipleValue = allIds
                        break
                    case 'none':
                        this.multipleValue = allIds
                }
                this.updateRadios()
            },
        },
        created() {
            if (!!this.multiple && !!this.value && this.$plain.$utils.typeOf(this.value) !== 'array') {
                console.error('[radio-group] value must be instance of array when multiple is true!');
            }
        },
    }
</script>