import {reactive, designPage, useRefs} from "plain-ui-composition";
import {DemoRow} from "../../components/DemoRow";
import {PlScroll} from "../../../src/packages/PlScroll";
import PlButtonGroup from "../../../src/packages/PlButtonGroup";
import PlButton from "../../../src/packages/PlButton";
import './DemoScroll.scss'
import {PlCheckboxGroup} from "../../../src/packages/PlCheckboxGroup";
import PlList from "../../../src/packages/PlList";
import {PlCheckbox} from "../../../src/packages/PlCheckbox";

export default designPage(() => {

    const state = reactive({
        list: (() => {
            let ret = []
            let i = 0;
            while (i < 40) {
                ret.push(i++)
            }
            return ret
        })(),
        checkboxValue: [] as string[],
    })

    const {refs, onRef} = useRefs({
        scroll1: PlScroll,
        scroll2: PlScroll,
        autoScroll1: PlScroll,
        autoScroll2: PlScroll,
    })

    function getClass(item: any) {
        console.log('item', item)
        return {}
    }

    return () => (
        <div class={'demo-scroll'}>
            <DemoRow title={'基本用法(检查滚动的时候会不会导致插槽的内容重新执行)'}>
                <div class={'demo-scroll-wrapper'} style={{display: 'inline-block', verticalAlign: 'top'}}>
                    <PlScroll>
                        <div>
                            {state.list.map((item, index) => (
                                <div class={['demo-scroll-label', getClass(item),]} key={index}>
                                    {item}
                                </div>
                            ))}
                        </div>
                    </PlScroll>
                </div>
                <PlButtonGroup vertical>
                    <PlButton label={'添加'} icon={'el-icon-circle-plus-outline'} onClick={() => state.list.push(state.list.length + 1)}/>
                    <PlButton label={'删除'} icon={'el-icon-remove-outline'} onClick={() => state.list.shift()}/>
                </PlButtonGroup>
            </DemoRow>
            <DemoRow title={'基本用法'}>
                <div class="demo-scroll-wrapper">
                    <PlScroll>
                        <div style={{height: '400px', width: '400px'}} class={'demo-scroll-content'}>
                            this is content
                        </div>
                    </PlScroll>
                </div>
            </DemoRow>
            <DemoRow title={'基本用法(多选列表)'}>
                <div class="demo-scroll-wrapper" style={{display: 'inline-block', verticalAlign: 'top'}}>
                    <PlScroll>
                        <PlCheckboxGroup v-model={state.checkboxValue}>
                            {state.list.map(item => (
                                <div class={'demo-scroll-label'} key={item}>
                                    <PlCheckbox val={item}/>、
                                    {item}
                                </div>
                            ))}
                        </PlCheckboxGroup>
                    </PlScroll>
                </div>
                <PlButtonGroup vertical>
                    <PlButton label={'添加'} icon={'el-icon-circle-plus-outline'} onClick={() => state.list.push(state.list.length + 1)}/>
                    <PlButton label={'删除'} icon={'el-icon-remove-outline'} onClick={() => state.list.shift()}/>
                </PlButtonGroup>
                {JSON.stringify(state.checkboxValue)}
            </DemoRow>
            <DemoRow title={'可以横向滚动'}>
                <div class={'demo-scroll-wrapper'}>
                    <PlScroll scrollX scrollAfterDragEnd>
                        <div style={{height: '400px', width: '400px'}} class={'demo-scroll-content'}>
                            this is content
                        </div>
                    </PlScroll>
                </div>
            </DemoRow>
            <DemoRow title={'只能横向滚动'}>
                <div class={'demo-scroll-wrapper'}>
                    <PlScroll scrollX scrollY={false}>
                        <div style={{height: '400px', width: '400px'}} class={'demo-scroll-content'}>
                            this is content
                        </div>
                    </PlScroll>
                </div>
            </DemoRow>
            <DemoRow title={'适配内容高度'}>
                <div class={'demo-scroll-wrapper'} style={{height: 'auto'}}>
                    <PlScroll scrollX fitContentHeight>
                        <div style={{height: '400px', width: '400px'}} class={'demo-scroll-content'}>
                            this is content
                        </div>
                    </PlScroll>
                </div>
            </DemoRow>
            <DemoRow title={'适配内容宽度'}>
                <div class={'demo-scroll-wrapper'} style={{width: 'auto'}}>
                    <PlScroll fitContentWidth>
                        <div style={{height: '400px', width: '400px'}} class={'demo-scroll-content'}>
                            this is content
                        </div>
                    </PlScroll>
                </div>
            </DemoRow>
            <DemoRow title={'适配host高度'}>
                <div class={'demo-scroll-wrapper'}>
                    <PlScroll fitContentWidth scrollX>
                        <div style={{height: '100%', width: '400px'}} class={'demo-scroll-content'}>
                            this is content
                        </div>
                    </PlScroll>
                </div>
            </DemoRow>
            <DemoRow title={'适配host宽度'}>
                <div class={'demo-scroll-wrapper'}>
                    <PlScroll fitHostWidth>
                        <div style={{height: '400px', width: '400px'}} class={'demo-scroll-content'}>
                            this is content
                        </div>
                    </PlScroll>
                </div>
            </DemoRow>

            <DemoRow title={'滚动：纵向'}>
                <div class="demo-scroll-wrapper">
                    <PlScroll ref={onRef.scroll1} onScroll={() => console.log('vertical scroll')}>
                        <div style={{height: '400px', width: '400px'}} class={'demo-scroll-content'}>
                            this is content
                            <div>
                                <p><PlButton size={'mini'} label={'scroll'} onClick={() => refs.scroll1!.methods.scroll({y: 100}, 1000)}/></p>
                                <p><PlButton size={'mini'} label={'scroll(no emit)'} onClick={() => refs.scroll1!.methods.scroll({y: 100}, {time: 1000, noEmitScroll: true})}/></p>
                                <p><PlButton size={'mini'} label={'scrollEnd'} onClick={() => refs.scroll1!.methods.scrollEnd()}/></p>
                            </div>
                        </div>
                    </PlScroll>
                </div>
            </DemoRow>
            <DemoRow title={'滚动：横向'}>
                <div class="demo-scroll-wrapper">
                    <PlScroll ref={onRef.scroll2} scrollX onScroll={() => console.log('horizontal scroll')}>
                        <div style={{height: '400px', width: '400px'}} class={'demo-scroll-content'}>
                            this is content
                            <div>
                                <p><PlButton size={'mini'} label={'scroll'} onClick={() => refs.scroll2!.methods.scroll({x: 100}, 1000)}/></p>
                                <p><PlButton size={'mini'} label={'scroll(no emit)'} onClick={() => refs.scroll2!.methods.scroll({x: 100}, {time: 1000, noEmitScroll: true})}/></p>
                                <p><PlButton size={'mini'} label={'scrollEnd'} onClick={() => refs.scroll2!.methods.scrollEnd()}/></p>
                            </div>
                        </div>
                    </PlScroll>
                </div>
            </DemoRow>
            <DemoRow title={'自动滚动：纵向'}>
                <div class={'demo-scroll-wrapper'} style={{display: 'inline-block', verticalAlign: 'top'}}>
                    <PlScroll ref={onRef.autoScroll1}>
                        <div>
                            {state.list.map((item, index) => (
                                <div class="demo-scroll-label" key={index}>
                                    {item}
                                </div>
                            ))}
                        </div>
                    </PlScroll>
                </div>
                <div style={{display: 'inline-block'}}>
                    <PlButtonGroup>
                        <PlButton label={'向下滚动'} onClick={() => refs.autoScroll1!.methods.autoScrollBottom()}/>
                        <PlButton label={'向上滚动'} onClick={() => refs.autoScroll1!.methods.autoScrollTop()}/>
                        <PlButton label={'停止滚动'} onClick={() => refs.autoScroll1!.methods.stopAutoScroll()}/>
                    </PlButtonGroup>
                </div>
            </DemoRow>
            <DemoRow title={'自动滚动：横向'}>
                <div class={'demo-scroll-wrapper'} style={{display: 'inline-block', verticalAlign: 'top'}}>
                    <PlScroll ref={onRef.autoScroll2} scrollX>
                        <div style={{display: 'inline-block', whiteSpace: 'nowrap'}}>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item, index) => (
                                <div class="demo-scroll-label" key={index} style={{width: '30px', display: 'inline-block', marginRight: '10px'}}>
                                    {item}
                                </div>
                            ))}
                        </div>
                    </PlScroll>
                </div>
                <div style={{display: 'inline-block'}}>
                    <PlButtonGroup>
                        <PlButton label={'向右滚动'} onClick={() => refs.autoScroll2!.methods.autoScrollRight()}/>
                        <PlButton label={'向左滚动'} onClick={() => refs.autoScroll2!.methods.autoScrollLeft()}/>
                        <PlButton label={'停止滚动'} onClick={() => refs.autoScroll2!.methods.stopAutoScroll()}/>
                    </PlButtonGroup>
                </div>
            </DemoRow>
            <DemoRow title={'拖拽结束之后滚动'}>
                <div class={'demo-scroll-wrapper'}>
                    <PlScroll scrollX scrollAfterDragEnd>
                        <div style={{height: '400px', width: '400px'}} class={'demo-scroll-content'}>
                            this is content
                        </div>
                    </PlScroll>
                </div>
            </DemoRow>
        </div>
    )
})
