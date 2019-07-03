<template>
    <div class="demo-address">
        <im-demo-row title="地址选择服务">
            <pl-button label="queryByCodes" @click="queryByCodes"/>
            <pl-button label="queryByParent" @click="queryByParent"/>
        </im-demo-row>
        <im-demo-row titile="选择">
            <pl-button label="省" @click="pickProvince"/>
            <pl-button label="市" @click="pickCity"/>
            <pl-button label="县" @click="pickArea"/>
            <pl-button label="省市" @click="pickProvinceAndCity"/>
            <pl-button label="省市县" @click="pickAll"/>
            <pl-button label="市县" @click="pickCityAndArea"/>
            {{serviceData}}
        </im-demo-row>
        <im-demo-row title="选择框">
            <pl-button @click="resetRow" label="resetRow"/>
            <pl-address province v-model="row.province"/>
            <pl-address city v-model="row.city" :parentCode="row.province"/>
            <pl-address area v-model="row.area" :parentCode="row.city"/>
            <span>{{row}}</span>
        </im-demo-row>
    </div>
</template>

<script>
    export default {
        name: "demo-address",
        data() {
            return {
                row: {},
                serviceData: {
                    province: null,
                    city: null,
                    area: null,
                },
            }
        },
        methods: {
            async resetRow() {
                this.row = {province: "310000", city: "310100", area: "310108"}
            },
            async queryByCodes() {
                console.log(await this.$address.queryByCodes(['110000', '110100', '110113', '120103']))
            },
            async queryByParent() {
                console.log(await this.$address.queryByParent(null))
            },
            async pickProvince() {
                this.$address.pick({
                    view: {
                        province: true,
                    },
                    onConfirm: (data) => {
                        this.serviceData.province = data.province
                    },
                })
            },
            async pickCity() {
                this.$address.pick({
                    view: {
                        city: true,
                    },
                    data: {province: this.serviceData.province},
                    onConfirm: (data) => {
                        this.serviceData.city = data.city
                    },
                })
            },
            async pickArea() {
                this.$address.pick({
                    view: {
                        area: true,
                    },
                    data: {city: this.serviceData.city},
                    onConfirm: (data) => {
                        this.serviceData.area = data.area
                    },
                })
            },
            async pickProvinceAndCity() {
                this.$address.pick({
                    view: {
                        province: true,
                        city: true,
                    },
                    pickParent: true,
                    onConfirm: (data) => {
                        this.serviceData.province = data.province
                        this.serviceData.city = data.city
                    },
                })
            },
            async pickAll() {
                this.$address.pick({
                    view: {
                        province: true,
                        city: true,
                        area: true,
                    },
                    pickParent: true,
                    onConfirm: (data) => {
                        this.serviceData.province = data.province
                        this.serviceData.city = data.city
                        this.serviceData.area = data.area
                    },
                })
            },
            async pickCityAndArea() {
                this.$address.pick({
                    view: {
                        city: true,
                        area: true,
                    },
                    data: {province: this.serviceData.province},
                    pickParent: true,
                    onConfirm: (data) => {
                        this.serviceData.city = data.city
                        this.serviceData.area = data.area
                    },
                })
            },
        }
    }
</script>

<style lang="scss">

</style>
