import {designPage, onMounted, reactive, useRefs} from "plain-ui-composition";
import {DemoRow} from "../../components/DemoRow";
import PlColorAlphaSlider from "../../../src/packages/PlColorPicker/sub/PlColorAlphaSlider";
import PlColorHueSlider from "../../../src/packages/PlColorPicker/sub/PlColorHueSlider";
import PlColorPanel from "../../../src/packages/PlColorPicker/PlColorPanel";
import {DemoLine} from "../../components/DemoLine";
import useColorPicker from "../../../src/packages/useColorPicker";
import $$message from "../../../src/packages/$$message";
import PlButton from "../../../src/packages/PlButton";
import PlColorPicker from "../../../src/packages/PlColorPicker";
import PlIcon from "../../../src/packages/PlIcon";
import {PlCheckbox} from "../../../src/packages/PlCheckbox";

export default designPage(() => {

    const val = reactive({
        val: {
            0: 50,
            1: 240,
        } as any
    }).val

    const {refs, onRef} = useRefs({
        serviceBasicUsage: PlButton,
        hexValue: PlButton,
        rgbValue: PlButton,
        rgbWithoutOpacity: PlButton,
        hexWithOpacity: PlButton,
        rgbaWithOpacity: PlButton,
        saveValue: PlButton,
    })

    const $colorPicker = useColorPicker()

    const service = {
        serviceBasicUsage: $colorPicker({
            reference: () => refs.serviceBasicUsage!.refs.el,
            renderAttrs: {
                onChange: val => $$message(val)
            },
        }),
        hexValue: $colorPicker({
            reference: () => refs.hexValue!.refs.el,
            renderAttrs: {
                onChange: val => $$message(val),
                modelValue: '#ff0000',
                format: 'hex',
            },
        }),
        rgbValue: $colorPicker({
            reference: () => refs['rgbValue']!.refs.el,
            renderAttrs: {
                onChange: val => $$message(val),
                modelValue: 'rgb(134,74,212)',
                format: 'rgb',
            },
        }),
        rgbWithoutOpacity: $colorPicker({
            reference: () => refs['rgbWithoutOpacity']!.refs.el,
            renderAttrs: {
                onChange: val => $$message(val),
                modelValue: 'rgb(134,74,212,0.5)',
                format: 'rgb',
            },
        }),
        hexWithOpacity: $colorPicker({
            reference: () => refs['hexWithOpacity']!.refs.el,
            renderAttrs: {
                onChange: val => $$message(val),
                modelValue: '#00ff00',
                format: 'hex',
                enableAlpha: true,
            },
        }),
        rgbaWithOpacity: $colorPicker({
            reference: () => refs['rgbaWithOpacity']!.refs.el,
            renderAttrs: {
                onChange: val => $$message(val),
                modelValue: 'rgb(134,74,212,0.5)',
                format: 'rgb',
                enableAlpha: true,
            },
        }),
        saveValue: (() => {
            const option = {
                reference: () => refs['saveValue']!.refs.el,
                renderAttrs: {
                    onChange: (val: any) => option.renderAttrs.modelValue = val,
                    modelValue: 'rgb(134,74,212,0.5)',
                    format: 'rgb',
                    enableAlpha: true,
                },
            }
            return $colorPicker(option)
        })()
    }

    onMounted(() => {
        // console.log('mounted', refs.serviceBasicUsage)
    })

    return () => (
        <div>
            <DemoRow title={'Panel??????'}>
                <DemoRow title={'PlColorAlphaSlider'}>
                    <PlColorAlphaSlider v-model={val[0]} color={'black'} size={180}/>
                    {val[0]}
                </DemoRow>
                <DemoRow title={'PlColorHueSlider'}>
                    <PlColorHueSlider v-model={val[1]} size={240}/>
                    {val[1]}
                </DemoRow>
                <DemoRow title={'PlColorPanel:????????????'}>
                    <DemoLine>
                        <div style={{backgroundColor: val.color1, width: '100px', height: '30px'}}>
                            {val.color1}
                        </div>
                    </DemoLine>
                    <DemoLine>
                        <PlColorPanel v-model={val.color1} format={'hex'}/>
                    </DemoLine>
                </DemoRow>
                <DemoRow title={'PlColorPanel:?????????'}>
                    <DemoLine>
                        <div style={{backgroundColor: val.color2, width: '100px', height: '30px'}}>
                            {val.color2}
                        </div>
                    </DemoLine>
                    <DemoLine>
                        <PlColorPanel v-model={val.color2} enableAlpha format={'rgb'}/>
                    </DemoLine>
                </DemoRow>
            </DemoRow>
            <DemoRow title={'Service??????'}>
                <DemoRow title={'????????????'}>
                    <PlButton onClick={service.serviceBasicUsage.toggle} label={'??????????????????????????????'} ref={onRef.serviceBasicUsage}/>
                </DemoRow>
                <DemoRow title={'????????????????????????'}>
                    <PlButton label={'hex?????????'} ref={onRef.hexValue} onClick={service.hexValue.toggle}/>
                    <PlButton label={'rgb?????????'} ref={onRef.rgbValue} onClick={service.rgbValue.toggle}/>
                    <PlButton label={'rgba?????????????????????????????????'} ref={onRef.rgbWithoutOpacity} onClick={service.rgbWithoutOpacity.toggle}/>
                    <PlButton label={'hex?????????????????????'} ref={onRef.hexWithOpacity} onClick={service.hexWithOpacity.toggle}/>
                    <PlButton label={'rgba?????????????????????'} ref={onRef.rgbaWithOpacity} onClick={service.rgbaWithOpacity.toggle}/>
                </DemoRow>
                <DemoRow title={'?????????'}>
                    <PlButton label={'?????????'} ref={onRef.saveValue} onClick={service.saveValue.toggle}/>
                </DemoRow>
            </DemoRow>
            <DemoRow title={'PlColorPicker'}>
                <PlColorPicker v-model={val[3]}/>
                <PlColorPicker v-model={val[3]} onFocus={() => console.log('focus')} onBlur={() => console.log('blur')}/>
            </DemoRow>
            <DemoRow title={'PlColorPicker????????????'}>
                <PlColorPicker v-model={val[3]} type={'button'}/>
            </DemoRow>
            <DemoRow title={'???????????????'}>
                <PlColorPicker v-model={val[3]} v-slots={{
                    default: ({color, onClick}) => (
                        <div style={{display: 'inline-flex', height: '30px', width: '30px', alignItems: 'center', justifyContent: 'center', backgroundColor: color || 'gray', color: 'white'}} onClick={onClick}>
                            <PlIcon icon={'el-icon-folder-s'}/>
                        </div>
                    )
                }}/>
            </DemoRow>
            <DemoRow title={'ColorPicker????????????????????????????????????????????????'}>
                <PlColorPicker enableAlpha={false} v-model={val[4]}/>
                <PlColorPicker enableAlpha={false} v-model={val[4]}/>
            </DemoRow>
            <DemoRow title={'??????????????????'}>
                <DemoLine>
                    <PlCheckbox label={'??????/??????'} v-model={val[5]}/>
                </DemoLine>
                <DemoLine>
                    <PlColorPicker disabled={val[5]}/>
                    <PlColorPicker readonly={val[5]}/>
                </DemoLine>
            </DemoRow>
        </div>
    )
})
