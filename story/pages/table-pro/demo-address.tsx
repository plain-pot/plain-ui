import {designPage, reactive} from "plain-design-composition";
import {DemoRow} from "../../components/DemoRow";
import useAddress from "../../../src/packages/useAddress";
import PlAddress from "../../../src/packages/PlAddress";

export const demo1 = designPage(() => {

    const {$address} = useAddress()


    return () => <>
        <DemoRow title="格式化地址code">
            <ul>
                <li>{$address.getNameByCodeComputed('652800')}</li>
                <li>{$address.getNameByCodeComputed('430000')}</li>
                <li>{$address.getNameByCodeComputed('230000')}</li>
            </ul>
        </DemoRow>
    </>

})

export const demo2 = designPage(() => {

    const state = reactive({
        formData: {} as any
    })


    return () => <>
        <DemoRow title="格式化地址code">
            <ul>
                <li>省份：<PlAddress province v-model={state.formData.province}/></li>
                <li>城市：<PlAddress city v-model={state.formData.city} parentValue={state.formData.province}/></li>
                <li>区县：<PlAddress district v-model={state.formData.district} parentValue={state.formData.city}/></li>
            </ul>
            {JSON.stringify(state.formData)}
        </DemoRow>
    </>

})
export const demo3 = designPage(() => {

    const state = reactive({
        formData: {
            province: '630000',
            city: '632500',
            district: '632525',
        } as any
    })


    return () => <>
        <DemoRow title="默认地址">
            <ul>
                <li>省份：<PlAddress province v-model={state.formData.province}/></li>
                <li>城市：<PlAddress city v-model={state.formData.city} parentValue={state.formData.province}/></li>
                <li>区县：<PlAddress district v-model={state.formData.district} parentValue={state.formData.city}/></li>
            </ul>
            {JSON.stringify(state.formData)}
        </DemoRow>
    </>

})
