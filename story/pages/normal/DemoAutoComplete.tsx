import {designPage, reactive, VueNode} from "plain-ui-composition";
import {DemoRow} from "../../components/DemoRow";
import {PlAutoComplete, PlLoading, PlSelectGroup, PlSelectOption} from "../../../src";
// @ts-ignore
import addressData from "../data/address.json"
import {defer, DFD} from "plain-utils/utils/defer";
import {debounce} from "plain-utils/utils/debounce";
import {delay} from "plain-utils/utils/delay";

export const demo1 = designPage(() => {
    const state = reactive({
        text: ''
    })

    const suggestion = (addressData as any[]).map(({name}) => (name))

    return () => (
        <DemoRow title="基本用法">
            <PlAutoComplete v-model={state.text} suggestion={suggestion}/>
            {state.text}
        </DemoRow>
    )
})

export const demo2 = designPage(() => {
    const state = reactive({
        text: ''
    })

    return () => (
        <DemoRow title="分组，以及自定义内容">
            <p>SelectOption给label=city.name + province.name，这样可以使得在搜索省份名称的时候筛选到所有的该省份的城市</p>
            <PlAutoComplete v-model={state.text}>
                {(addressData as any[]).map((province, groupIndex) => (
                    <PlSelectGroup label={province.name} key={groupIndex}>
                        {(province.children as any[] || []).map((city, index) => (
                            <PlSelectOption key={index} label={city.name + province.name} val={city.name}>
                                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                    <span>{city.name}</span>
                                    <span style={{color: '#ccc', fontSize: '12px'}}>{city.code}</span>
                                </div>
                            </PlSelectOption>
                        ))}
                    </PlSelectGroup>
                ))}
            </PlAutoComplete>
            {state.text}
        </DemoRow>
    )
})

export const demo3 = designPage(() => {

    const state = reactive({
        text: ''
    })

    const data = (addressData as any[]).map(({name, code}) => ({name, code}))

    const selectConfig = reactive({
        // 任何选项都显示，因为选项都是通过搜索关键字异步加载出来的
        filterMethod: () => true,
        // 异步加载得到的选项数据
        options: [] as string[],
        // 自定义无数据时显示的内容
        empty: (defaultEmpty: () => VueNode) => {
            if (selectConfig.dfd) {
                return null
            } else {
                if (!state.text) {
                    return (
                        <div class="pl-background-disabled-text" style={{padding: '12px 0', textAlign: 'center'}}>
                            请输入搜索关键字！
                        </div>
                    )
                }
                return defaultEmpty()
            }
        },
        // 只要promise存在，就显示加载状态
        dfd: null as null | DFD,
        // 当搜索关键字变化的时候，刷线promise
        onSearchChange: debounce(async (text: string | null) => {
            if (!!selectConfig.dfd) {
                selectConfig.dfd.reject('')
                selectConfig.dfd = null
            }
            state.text = text!
            if (!text) {
                selectConfig.options = []
            } else {
                // 这里模拟网络异步请求动作，等待1s~2s得到匹配的数据
                selectConfig.dfd = defer<any[]>()
                const timer = Math.random() * 1000 + 1000
                await delay(timer)
                selectConfig.options = data.filter(i => i.name.indexOf(text) > -1).map(({name}) => (name))
                selectConfig.dfd = null
            }
        }, 300)
    })

    return () => (
        <DemoRow title="异步加载选项">
            <PlAutoComplete
                modelValue={state.text}
                filterMethod={selectConfig.filterMethod}
                empty={selectConfig.empty}
                onInputChange={selectConfig.onSearchChange}
                popperAttrs={{
                    height: selectConfig.options.length < 6 ? null as any : undefined,
                }}
            >
                {!!selectConfig.dfd ? (
                    <div class="pl-background-disabled-text" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '12px 0'}}>
                        <PlLoading style={{fontSize: '24px'}}/>
                        <span>数据加载中</span>
                    </div>
                ) : (
                    selectConfig.options.map((opt, index) => (
                        <PlSelectOption label={opt} val={opt} key={index} onClick={() => console.log(222, opt)}/>
                    ))
                )}
            </PlAutoComplete>
            {state.text}
        </DemoRow>
    )
})
