import {designPage, reactive} from "plain-ui-composition";

// @ts-ignore
import data2 from '../data/data-2.json'
import {DemoRow} from "../../components/DemoRow";
import PlVirtualList from "../../../src/packages/PlVirtualList";
import {PlCheckbox} from "../../../src/packages/PlCheckbox";
import {classnames} from "plain-utils/dom/classnames";

export default designPage(() => {

    const list = data2.slice(0, 188)
    const state = reactive({
        disabledVirtualScroll: false,
    })

    function getClass(item: any) {
        console.log('item', item)
        return {}
    }

    return () => (
        <div>
            <DemoRow title={'基本用法'}>
                <div style={{width: '300px', height: '400px', backgroundColor: '#f6f6f6'}}>
                    <PlVirtualList
                        data={list} size={40} v-slots={{
                        default: ({item, index}) => (
                            <div
                                key={index}
                                {...{vid: index} as any}
                                onClick={() => console.log(index, {...item})}
                                style={{
                                    backgroundColor: item.color,
                                    height: '40px',
                                    display: 'block',
                                    width: '100%'
                                }}
                            >
                                <div
                                    style={{
                                        width: '40px',
                                        backgroundColor: 'rgba(0,0,0,0.5)',
                                        color: 'white',
                                        height: '100%',
                                        overflow: 'hidden',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                    class={classnames(getClass(item))}>
                                    {index + 1}
                                </div>
                                <div style={{
                                    width: 'calc(100% - 40px)',
                                    float: 'right',
                                    height: '100%',
                                    padding: '0 12px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    flexDirection: 'column',
                                    boxSizing: 'border-box',
                                }}>
                                    <div style={{
                                        fontSize: '12px',
                                        display: 'flex',
                                        justifyContent: 'space-between'
                                    }}>
                                        <span>{item.name}</span>
                                        <span>{item.date}</span>
                                    </div>
                                    <div style={{
                                        textAlign: 'right',
                                        color: 'white'
                                    }}>
                                        {item.star}
                                    </div>
                                </div>
                            </div>
                        )
                    }}/>
                </div>
            </DemoRow>

            <DemoRow title={'动态高度'}>
                <div style={{width: '300px', height: '400px', backgroundColor: '#f6f6f6'}}>
                    <PlVirtualList data={list} size={60} dynamicSize v-slots={{
                        default: ({item, index}) => (
                            <div
                                key={index}
                                {...{vid: index} as any}
                                onClick={() => console.log(index, {...item})}
                                style={{
                                    backgroundColor: item.color,
                                    height: item.size + 'px',
                                    display: 'block',
                                    width: '100%'
                                }}
                            >
                                <div
                                    style={{
                                        width: '40px',
                                        backgroundColor: 'rgba(0,0,0,0.5)',
                                        color: 'white',
                                        height: '100%',
                                        overflow: 'hidden',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                    {index + 1}
                                </div>
                                <div style={{
                                    width: 'calc(100% - 40px)',
                                    float: 'right',
                                    height: '100%',
                                    padding: '0 12px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    flexDirection: 'column',
                                    boxSizing: 'border-box',
                                }}>
                                    <div style={{
                                        fontSize: '12px',
                                        display: 'flex',
                                        justifyContent: 'space-between'
                                    }}>
                                        <span>{item.name}</span>
                                        <span>{item.date}</span>
                                    </div>
                                    <div style={{
                                        textAlign: 'right',
                                        color: 'white'
                                    }}>
                                        {item.star}
                                    </div>
                                </div>
                            </div>
                        )
                    }}/>
                </div>
            </DemoRow>

            <DemoRow title={'禁用虚拟滚动'}>
                <PlCheckbox v-model={state.disabledVirtualScroll} label={'禁用虚拟滚动'}/>
                <div style={{width: '300px', height: '400px', backgroundColor: '#f6f6f6'}} key={state.disabledVirtualScroll ? '1' : '2'}>
                    <PlVirtualList data={data2} size={40} disabled={state.disabledVirtualScroll} v-slots={{
                        default: ({item, index}) => (
                            <div
                                key={index}
                                {...{vid: index} as any}
                                onClick={() => console.log(index, {...item})}
                                style={{
                                    backgroundColor: item.color,
                                    height: '40px',
                                    display: 'block',
                                    width: '100%'
                                }}
                            >
                                <div
                                    style={{
                                        width: '40px',
                                        backgroundColor: 'rgba(0,0,0,0.5)',
                                        color: 'white',
                                        height: '100%',
                                        overflow: 'hidden',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                    class={classnames(getClass(item))}>
                                    {index + 1}
                                </div>
                                <div style={{
                                    width: 'calc(100% - 40px)',
                                    float: 'right',
                                    height: '100%',
                                    padding: '0 12px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    flexDirection: 'column',
                                    boxSizing: 'border-box',
                                }}>
                                    <div style={{
                                        fontSize: '12px',
                                        display: 'flex',
                                        justifyContent: 'space-between'
                                    }}>
                                        <span>{item.name}</span>
                                        <span>{item.date}</span>
                                    </div>
                                    <div style={{
                                        textAlign: 'right',
                                        color: 'white'
                                    }}>
                                        {item.star}
                                    </div>
                                </div>
                            </div>
                        )
                    }}/>
                </div>
            </DemoRow>

        </div>
    )
})
