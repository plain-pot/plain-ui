<template>
    <pl-dialog dialogClass="pl-address-modal"
               v-model="show"
               width="550px"
               initialized
               noPadding
               confirmButton
               cancelButton
               @confirm="pl_confirm"
               @cancel="pl_cancel"
               title="选择地址">
        <div class="pl-address-modal-content">
            <pl-justify :data="province" labelKey="name" valueKey="code" @click="val=>pl_click(val,'province')" :value="data.province"/>
        </div>
    </pl-dialog>
</template>

<script>
    import PlJustify from "../justify/pl-justify";

    export default {
        name: "pl-address-modal",
        components: {PlJustify},
        data() {
            return {
                show: false,
                province: [
                    {"id": "1144179386988101632", "createdAt": "2019-06-27 17:43:18", "updatedAt": "2019-06-27 18:33:46", "name": "北京市", "deep": "0", "code": "110000", "parentCode": "0", "longitude": "39.93170166", "latitude": "116.3690033"}, {
                        "id": "1144179395141828608",
                        "createdAt": "2019-06-27 17:43:20",
                        "updatedAt": "2019-06-27 18:33:46",
                        "name": "天津市",
                        "deep": "0",
                        "code": "120000",
                        "parentCode": "0",
                        "longitude": "39.1371994",
                        "latitude": "117.18800354"
                    }, {"id": "1144179402548969472", "createdAt": "2019-06-27 17:43:22", "updatedAt": "2019-06-27 18:33:46", "name": "河北省", "deep": "0", "code": "130000", "parentCode": "0", "longitude": "38.61384", "latitude": "115.661434"}, {
                        "id": "1144179484480503808",
                        "createdAt": "2019-06-27 17:43:41",
                        "updatedAt": "2019-06-27 18:33:46",
                        "name": "山西省",
                        "deep": "0",
                        "code": "140000",
                        "parentCode": "0",
                        "longitude": "37.866566",
                        "latitude": "112.515496"
                    }, {"id": "1144179539274891264", "createdAt": "2019-06-27 17:43:54", "updatedAt": "2019-06-27 18:33:46", "name": "内蒙古自治区", "deep": "0", "code": "150000", "parentCode": "0", "longitude": "43.468238", "latitude": "114.415868"}, {
                        "id": "1144179586108489728",
                        "createdAt": "2019-06-27 17:44:05",
                        "updatedAt": "2019-06-27 18:33:46",
                        "name": "辽宁省",
                        "deep": "0",
                        "code": "210000",
                        "parentCode": "0",
                        "longitude": "41.6216",
                        "latitude": "122.753592"
                    }, {"id": "1144179638633758720", "createdAt": "2019-06-27 17:44:18", "updatedAt": "2019-06-27 18:33:46", "name": "吉林省", "deep": "0", "code": "220000", "parentCode": "0", "longitude": "43.678846", "latitude": "126.262876"}, {
                        "id": "1144179669864546304",
                        "createdAt": "2019-06-27 17:44:25",
                        "updatedAt": "2019-06-27 18:33:46",
                        "name": "黑龙江省",
                        "deep": "0",
                        "code": "230000",
                        "parentCode": "0",
                        "longitude": "47.356592",
                        "latitude": "128.047414"
                    }, {"id": "1144179732615528448", "createdAt": "2019-06-27 17:44:40", "updatedAt": "2019-06-27 18:33:46", "name": "上海市", "deep": "0", "code": "310000", "parentCode": "0", "longitude": "31.23019981", "latitude": "121.45999908"}, {
                        "id": "1144179739938783232",
                        "createdAt": "2019-06-27 17:44:42",
                        "updatedAt": "2019-06-27 18:33:46",
                        "name": "江苏省",
                        "deep": "0",
                        "code": "320000",
                        "parentCode": "0",
                        "longitude": "33.013797",
                        "latitude": "119.368489"
                    }, {"id": "1144179789200883712", "createdAt": "2019-06-27 17:44:54", "updatedAt": "2019-06-27 18:33:46", "name": "浙江省", "deep": "0", "code": "330000", "parentCode": "0", "longitude": "29.159494", "latitude": "119.957202"}, {
                        "id": "1144179831882121216",
                        "createdAt": "2019-06-27 17:45:04",
                        "updatedAt": "2019-06-27 18:33:46",
                        "name": "安徽省",
                        "deep": "0",
                        "code": "340000",
                        "parentCode": "0",
                        "longitude": "31.859252",
                        "latitude": "117.216005"
                    }, {"id": "1144179884705185792", "createdAt": "2019-06-27 17:45:17", "updatedAt": "2019-06-27 18:33:46", "name": "福建省", "deep": "0", "code": "350000", "parentCode": "0", "longitude": "26.050118", "latitude": "117.984943"}, {
                        "id": "1144179925746450432",
                        "createdAt": "2019-06-27 17:45:26",
                        "updatedAt": "2019-06-27 18:33:46",
                        "name": "江西省",
                        "deep": "0",
                        "code": "360000",
                        "parentCode": "0",
                        "longitude": "27.757258",
                        "latitude": "115.676082"
                    }, {"id": "1144179973108531200", "createdAt": "2019-06-27 17:45:38", "updatedAt": "2019-06-27 18:33:46", "name": "山东省", "deep": "0", "code": "370000", "parentCode": "0", "longitude": "36.09929", "latitude": "118.527663"}, {
                        "id": "1144180043526701056",
                        "createdAt": "2019-06-27 17:45:55",
                        "updatedAt": "2019-06-27 18:33:46",
                        "name": "河南省",
                        "deep": "0",
                        "code": "410000",
                        "parentCode": "0",
                        "longitude": "34.157184",
                        "latitude": "113.486804"
                    }, {"id": "1144180121251348480", "createdAt": "2019-06-27 17:46:13", "updatedAt": "2019-06-27 18:33:46", "name": "湖北省", "deep": "0", "code": "420000", "parentCode": "0", "longitude": "31.209316", "latitude": "112.410562"}, {
                        "id": "1144180170916102144",
                        "createdAt": "2019-06-27 17:46:25",
                        "updatedAt": "2019-06-27 18:33:46",
                        "name": "湖南省",
                        "deep": "0",
                        "code": "430000",
                        "parentCode": "0",
                        "longitude": "27.695864",
                        "latitude": "111.720664"
                    }, {"id": "1144180229170790400", "createdAt": "2019-06-27 17:46:39", "updatedAt": "2019-06-27 18:33:46", "name": "广东省", "deep": "0", "code": "440000", "parentCode": "0", "longitude": "23.408004", "latitude": "113.394818"}, {
                        "id": "1144180289900118016",
                        "createdAt": "2019-06-27 17:46:53",
                        "updatedAt": "2019-06-27 18:33:46",
                        "name": "广西壮族自治区",
                        "deep": "0",
                        "code": "450000",
                        "parentCode": "0",
                        "longitude": "23.552255",
                        "latitude": "108.924274"
                    }, {"id": "1144180344887443456", "createdAt": "2019-06-27 17:47:06", "updatedAt": "2019-06-27 18:33:46", "name": "海南省", "deep": "0", "code": "460000", "parentCode": "0", "longitude": "19.180501", "latitude": "109.733755"}, {
                        "id": "1144180357235474432",
                        "createdAt": "2019-06-27 17:47:09",
                        "updatedAt": "2019-06-27 18:33:46",
                        "name": "重庆市",
                        "deep": "0",
                        "code": "500000",
                        "parentCode": "0",
                        "longitude": "29.59049988",
                        "latitude": "106.44499969"
                    }, {"id": "1144180374222405632", "createdAt": "2019-06-27 17:47:13", "updatedAt": "2019-06-27 18:33:46", "name": "四川省", "deep": "0", "code": "510000", "parentCode": "0", "longitude": "30.65049934", "latitude": "104.07800293"}, {
                        "id": "1144180458762797056",
                        "createdAt": "2019-06-27 17:47:34",
                        "updatedAt": "2019-06-27 18:33:46",
                        "name": "贵州省",
                        "deep": "0",
                        "code": "520000",
                        "parentCode": "0",
                        "longitude": "26.902826",
                        "latitude": "106.734996"
                    }, {"id": "1144180501196570624", "createdAt": "2019-06-27 17:47:44", "updatedAt": "2019-06-27 18:33:46", "name": "云南省", "deep": "0", "code": "530000", "parentCode": "0", "longitude": "24.864213", "latitude": "101.592952"}, {
                        "id": "1144180560923459584",
                        "createdAt": "2019-06-27 17:47:58",
                        "updatedAt": "2019-06-27 18:33:46",
                        "name": "西藏自治区",
                        "deep": "0",
                        "code": "540000",
                        "parentCode": "0",
                        "longitude": "29.65239906",
                        "latitude": "91.13430023"
                    }, {"id": "1144180593706139648", "createdAt": "2019-06-27 17:48:06", "updatedAt": "2019-06-27 18:33:46", "name": "陕西省", "deep": "0", "code": "610000", "parentCode": "0", "longitude": "35.860026", "latitude": "109.503789"}, {
                        "id": "1144180642968240128",
                        "createdAt": "2019-06-27 17:48:17",
                        "updatedAt": "2019-06-27 18:33:46",
                        "name": "甘肃省",
                        "deep": "0",
                        "code": "620000",
                        "parentCode": "0",
                        "longitude": "38.103267",
                        "latitude": "102.457625"
                    }, {"id": "1144180684542181376", "createdAt": "2019-06-27 17:48:27", "updatedAt": "2019-06-27 18:33:46", "name": "青海省", "deep": "0", "code": "630000", "parentCode": "0", "longitude": "36.60910034", "latitude": "101.78399658"}, {
                        "id": "1144180705165574144",
                        "createdAt": "2019-06-27 17:48:32",
                        "updatedAt": "2019-06-27 18:33:46",
                        "name": "宁夏回族自治区",
                        "deep": "0",
                        "code": "640000",
                        "parentCode": "0",
                        "longitude": "37.321323",
                        "latitude": "106.155481"
                    }, {"id": "1144180717412941824", "createdAt": "2019-06-27 17:48:35", "updatedAt": "2019-06-27 18:33:46", "name": "新疆维吾尔自治区", "deep": "0", "code": "650000", "parentCode": "0", "longitude": "43.79119873", "latitude": "87.60379791"}, {
                        "id": "1144180764468838400",
                        "createdAt": "2019-06-27 17:48:46",
                        "updatedAt": "2019-06-27 18:33:46",
                        "name": "台湾省",
                        "deep": "0",
                        "code": "710000",
                        "parentCode": "0",
                        "longitude": "23.941928",
                        "latitude": "120.997639"
                    }, {"id": "1144180764867297280", "createdAt": "2019-06-27 17:48:47", "updatedAt": "2019-06-27 18:33:46", "name": "香港特别行政区", "deep": "0", "code": "810000", "parentCode": "0", "longitude": "22.293586", "latitude": "114.186124"}, {
                        "id": "1144180765295116288",
                        "createdAt": "2019-06-27 17:48:47",
                        "updatedAt": "2019-06-27 18:33:46",
                        "name": "澳门特别行政区",
                        "deep": "0",
                        "code": "820000",
                        "parentCode": "0",
                        "longitude": "22.204118",
                        "latitude": "113.557519"
                    }],
                city: [],
                area: [],

                data: {
                    province: null,
                    city: null,
                    area: null,
                },
            }
        },
        methods: {
            pick({type, pickParent}) {
                this.show = true


            },
            pl_click(item, type) {
                console.log(item)
                this.data[type] = item.code
            },
            pl_confirm() {

            },
            pl_cancel() {

            },
        }
    }
</script>

<style lang="scss">
    .pl-address-modal {
        .pl-address-modal-content {
            padding: 6px 9px;
            box-sizing: border-box;
        }
    }
</style>
