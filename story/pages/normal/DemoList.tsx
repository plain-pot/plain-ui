import {designComponent, reactive} from "plain-ui-composition";
import {DemoRow} from "../../components/DemoRow";
import {PlButtonGroup} from "../../../src/packages/PlButtonGroup";
import {PlButton} from "../../../src/packages/PlButton";
import './DemoList.scss'
import {shuffle} from "plain-utils/object/shuffle";
import PlList from "../../../src/packages/PlList";
import PlItem from "../../../src/packages/PlItem";

export default designComponent({
    setup() {

        let count = 0;

        const directions = [
            'top',
            'left',
            'right',
            'bottom',
            'top-left',
            'top-right',
            'bottom-left',
            'bottom-right',
            'scale'
        ]

        const state = reactive({
            cities: [
                {id: '广州市', name: '广州市'},
                {id: '上海市', name: '上海市'},
                {id: '北京市', name: '北京市'},
                {id: '深圳市', name: '深圳市'},
                {id: '长沙市', name: '长沙市'},
                {id: '南京市', name: '南京市'},
            ],
            direction: directions[0],
        })

        const handler = {
            add: (index: number) => {
                const item = state.cities[index]
                if (!item) return
                state.cities.splice(index + 1, 0, {
                    id: `count_${count++}`,
                    name: `${item.id}_${count}`,
                })
            },
            remove: (index: number) => {
                state.cities.splice(index, 1)
            },
        }

        return () => (
            <div class={'demo-list'}>
                <DemoRow title={'基本用法，设置动画'}>
                    <PlButtonGroup>
                        <PlButton onClick={() => handler.add(0)}>add</PlButton>
                        <PlButton onClick={() => handler.remove(0)}>remove</PlButton>
                        <PlButton onClick={() => state.cities = shuffle(state.cities)}>shuffle</PlButton>
                    </PlButtonGroup>
                </DemoRow>
                <DemoRow title={'动画'}>
                    {directions.map(ani => (
                        <PlButton label={String(ani)} active={state.direction === ani} key={String(ani)} onClick={() => state.direction = ani}/>
                    ))}
                </DemoRow>
                <DemoRow>
                    <PlList direction={state.direction}>
                        {state.cities.map((city, index) => (
                            <PlItem class={"test-item"} key={city.name}>
                                <span>{city.name}</span>
                                <div style={{position: 'absolute', right: '8px', bottom: '8px'}}>
                                    <PlButton label={'add'} status={'success'} size={'mini'} style={{marginRight: '8px'}}
                                              onClick={() => handler.add(index)}
                                    />
                                    <PlButton label={'remove'} status={'success'} size={'mini'}
                                              onClick={() => handler.remove(index)}
                                    />
                                </div>
                            </PlItem>)
                        )}
                    </PlList>
                </DemoRow>
            </div>
        )
    },
})
